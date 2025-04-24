"""
Models for the appointments app
"""

import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User, DoctorProfile, PatientProfile


class AppointmentType(models.Model):
    """
    Represents configurable appointment types with default durations.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    default_duration = models.PositiveIntegerField(
        help_text=_("Default duration in minutes")
    )
    color = models.CharField(max_length=20, blank=True, null=True,
                            help_text=_("Color code for calendar display"))
    requires_approval = models.BooleanField(default=False)
    virtual_allowed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name


class Appointment(models.Model):
    """
    Represents a scheduled appointment between a patient and a doctor.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        CONFIRMED = 'confirmed', _('Confirmed')
        CHECKED_IN = 'checked_in', _('Checked In')
        IN_PROGRESS = 'in_progress', _('In Progress')
        COMPLETED = 'completed', _('Completed')
        CANCELLED = 'cancelled', _('Cancelled')
        NO_SHOW = 'no_show', _('No Show')

    class LocationType(models.TextChoices):
        OFFICE = 'office', _('Office')
        VIDEO = 'video', _('Video')
        PHONE = 'phone', _('Phone')
        HOME = 'home', _('Home')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    appointment_type = models.ForeignKey(
        AppointmentType,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration = models.IntegerField(
        help_text=_("Duration in minutes")
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    cancellation_reason = models.TextField(blank=True, null=True)
    cancelled_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cancelled_appointments'
    )
    location_type = models.CharField(
        max_length=20,
        choices=LocationType.choices,
        default=LocationType.OFFICE
    )
    location_details = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text=_("Office number, video link, etc.")
    )
    purpose = models.CharField(max_length=255, blank=True, null=True)
    preparation_instructions = models.TextField(blank=True, null=True)
    follow_up_required = models.BooleanField(default=False)
    follow_up_interval = models.IntegerField(
        blank=True,
        null=True,
        help_text=_("Days until follow-up")
    )
    is_recurring = models.BooleanField(default=False)
    recurring_pattern = models.ForeignKey(
        'RecurringAppointmentPattern',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_appointments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['doctor']),
            models.Index(fields=['start_time', 'end_time']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.doctor} - {self.start_time}"

    def cancel(self, cancelled_by, reason=None):
        """
        Cancel the appointment and record who cancelled it and why.
        """
        self.status = self.Status.CANCELLED
        self.cancelled_by = cancelled_by
        self.cancellation_reason = reason
        self.save()

    def mark_as_no_show(self):
        """
        Mark the appointment as a no-show.
        """
        self.status = self.Status.NO_SHOW
        self.save()

    def is_past(self):
        """
        Check if the appointment is in the past.
        """
        return self.end_time < timezone.now()

    def is_upcoming(self):
        """
        Check if the appointment is upcoming.
        """
        return self.start_time > timezone.now()

    def is_in_progress(self):
        """
        Check if the appointment is currently in progress.
        """
        now = timezone.now()
        return self.start_time <= now <= self.end_time


class RecurringAppointmentPattern(models.Model):
    """
    Defines the pattern for recurring appointments.
    """
    class Frequency(models.TextChoices):
        DAILY = 'daily', _('Daily')
        WEEKLY = 'weekly', _('Weekly')
        BIWEEKLY = 'biweekly', _('Biweekly')
        MONTHLY = 'monthly', _('Monthly')
        CUSTOM = 'custom', _('Custom')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    frequency = models.CharField(
        max_length=20,
        choices=Frequency.choices
    )
    days_of_week = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text=_("Comma-separated days: sun,mon,tue,wed,thu,fri,sat")
    )
    day_of_month = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        help_text=_("Day of the month for monthly recurrence")
    )
    interval_count = models.PositiveIntegerField(
        default=1,
        help_text=_("How many units (days, weeks, etc.) between occurrences")
    )
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    end_after_occurrences = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_frequency_display()} pattern starting {self.start_date}"


class AppointmentNote(models.Model):
    """
    Notes associated with appointments.
    """
    class NoteType(models.TextChoices):
        PRE_VISIT = 'pre_visit', _('Pre-Visit')
        DURING_VISIT = 'during_visit', _('During Visit')
        POST_VISIT = 'post_visit', _('Post-Visit')
        ADMINISTRATIVE = 'administrative', _('Administrative')
        PRIVATE = 'private', _('Private')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointment_notes'
    )
    note_type = models.CharField(
        max_length=20,
        choices=NoteType.choices
    )
    note_text = models.TextField()
    is_private = models.BooleanField(
        default=False,
        help_text=_("If true, only visible to the author")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['appointment']),
            models.Index(fields=['author']),
        ]

    def __str__(self):
        return f"Note for {self.appointment} by {self.author}"


class AppointmentReminder(models.Model):
    """
    Reminders for upcoming appointments.
    """
    class ReminderType(models.TextChoices):
        EMAIL = 'email', _('Email')
        SMS = 'sms', _('SMS')
        PUSH = 'push', _('Push Notification')
        PHONE = 'phone', _('Phone Call')

    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        SENT = 'sent', _('Sent')
        FAILED = 'failed', _('Failed')
        CANCELLED = 'cancelled', _('Cancelled')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name='reminders'
    )
    reminder_type = models.CharField(
        max_length=20,
        choices=ReminderType.choices
    )
    reminder_time = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    custom_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['appointment']),
            models.Index(fields=['reminder_time']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.get_reminder_type_display()} reminder for {self.appointment}"
