"""
Models for family relationships and shared health records
"""

import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User, PatientProfile


class FamilyRelationship(models.Model):
    """
    Represents family relationships between patients.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='family_relationships'
    )
    related_patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='related_to_family'
    )
    relationship_type = models.CharField(
        max_length=50,
        help_text=_("E.g., parent, child, spouse, sibling")
    )
    is_emergency_contact = models.BooleanField(default=False)
    has_proxy_access = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('patient', 'related_patient')
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['related_patient']),
        ]

    def __str__(self):
        return f"{self.patient} is {self.relationship_type} of {self.related_patient}"


class HealthRecordAccess(models.Model):
    """
    Defines access permissions for shared health records.
    Handles both family and provider access to patient records.
    """
    class AccessType(models.TextChoices):
        FAMILY = 'family', _('Family Member')
        PROVIDER = 'provider', _('Healthcare Provider')
        CAREGIVER = 'caregiver', _('Caregiver')
        EMERGENCY = 'emergency', _('Emergency Access')
        OTHER = 'other', _('Other')

    class AccessLevel(models.TextChoices):
        FULL = 'full', _('Full Access')
        LIMITED = 'limited', _('Limited Access')
        EMERGENCY = 'emergency', _('Emergency Only')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='shared_record_access'
    )
    granted_to_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='accessible_patient_records'
    )
    access_type = models.CharField(
        max_length=20,
        choices=AccessType.choices
    )
    access_level = models.CharField(
        max_length=20,
        choices=AccessLevel.choices,
        default=AccessLevel.LIMITED
    )
    accessible_data = models.JSONField(
        blank=True, null=True,
        help_text=_("Array of accessible data categories")
    )
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    granted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='granted_record_access'
    )
    is_active = models.BooleanField(default=True)
    revoked_at = models.DateTimeField(blank=True, null=True)
    revoked_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='revoked_record_access'
    )
    revocation_reason = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('patient', 'granted_to_user')
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['granted_to_user']),
            models.Index(fields=['access_type']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.granted_to_user} has {self.get_access_level_display()} to {self.patient}'s records"


class AccessLog(models.Model):
    """
    Logs access to patient health records.
    """
    class AccessReason(models.TextChoices):
        TREATMENT = 'treatment', _('Treatment')
        CONSULTATION = 'consultation', _('Consultation')
        REVIEW = 'review', _('Record Review')
        ADMINISTRATIVE = 'administrative', _('Administrative')
        EMERGENCY = 'emergency', _('Emergency')
        PATIENT_REQUEST = 'patient_request', _('Patient Request')
        OTHER = 'other', _('Other')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='record_access_logs'
    )
    accessed_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='record_access_actions'
    )
    access_time = models.DateTimeField(auto_now_add=True)
    access_reason = models.CharField(
        max_length=20,
        choices=AccessReason.choices
    )
    reason_note = models.TextField(blank=True, null=True)
    data_accessed = models.JSONField(
        help_text=_("List of data categories accessed")
    )
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['accessed_by']),
            models.Index(fields=['access_time']),
            models.Index(fields=['access_reason']),
        ]

    def __str__(self):
        return f"{self.accessed_by} accessed {self.patient}'s records at {self.access_time}"
