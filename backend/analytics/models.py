"""
Models for the analytics app
"""

import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User, DoctorProfile, PatientProfile


class DashboardMetric(models.Model):
    """
    Represents a dashboard metric that is tracked over time.
    """
    class MetricType(models.TextChoices):
        PATIENT_COUNT = 'patient_count', _('Patient Count')
        APPOINTMENT_COUNT = 'appointment_count', _('Appointment Count')
        REVENUE = 'revenue', _('Revenue')
        SATISFACTION = 'satisfaction', _('Satisfaction')
        WAIT_TIME = 'wait_time', _('Wait Time')
        COMPLETION_RATE = 'completion_rate', _('Completion Rate')
        CANCELLATION_RATE = 'cancellation_rate', _('Cancellation Rate')
        REFERRAL_COUNT = 'referral_count', _('Referral Count')
        CUSTOM = 'custom', _('Custom Metric')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    metric_type = models.CharField(
        max_length=50,
        choices=MetricType.choices,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['metric_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_metric_type_display()})"


class MetricValue(models.Model):
    """
    Represents a value for a dashboard metric at a specific point in time.
    """
    class TimeScope(models.TextChoices):
        DAY = 'day', _('Day')
        WEEK = 'week', _('Week')
        MONTH = 'month', _('Month')
        QUARTER = 'quarter', _('Quarter')
        YEAR = 'year', _('Year')
        CUSTOM = 'custom', _('Custom Period')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    metric = models.ForeignKey(
        DashboardMetric,
        on_delete=models.CASCADE,
        related_name='values'
    )
    value = models.DecimalField(max_digits=15, decimal_places=2)
    timestamp = models.DateTimeField()
    time_scope = models.CharField(
        max_length=20,
        choices=TimeScope.choices,
        default=TimeScope.DAY
    )
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='metric_values'
    )
    reference_id = models.CharField(max_length=100, blank=True, null=True)
    reference_type = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['metric']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['doctor']),
            models.Index(fields=['time_scope']),
        ]

    def __str__(self):
        return f"{self.metric.name}: {self.value} ({self.timestamp})"


class AIInsight(models.Model):
    """
    Represents an AI-generated insight for a doctor or admin.
    """
    class InsightType(models.TextChoices):
        SCHEDULING = 'scheduling', _('Scheduling')
        PATIENT_TRENDS = 'patient_trends', _('Patient Trends')
        CLINICAL = 'clinical', _('Clinical')
        FINANCIAL = 'financial', _('Financial')
        WORKFLOW = 'workflow', _('Workflow')
        CUSTOM = 'custom', _('Custom')

    class InsightPriority(models.TextChoices):
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')
        URGENT = 'urgent', _('Urgent')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='ai_insights',
        null=True,
        blank=True
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    insight_type = models.CharField(
        max_length=20,
        choices=InsightType.choices
    )
    priority = models.CharField(
        max_length=20,
        choices=InsightPriority.choices,
        default=InsightPriority.MEDIUM
    )
    confidence_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text=_("AI confidence in this insight (0-1)")
    )
    action_taken = models.BooleanField(default=False)
    action_notes = models.TextField(blank=True, null=True)
    action_taken_at = models.DateTimeField(blank=True, null=True)
    related_patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ai_insights'
    )
    reference_data = models.JSONField(
        blank=True,
        null=True,
        help_text=_("Data used to generate this insight")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['doctor']),
            models.Index(fields=['insight_type']),
            models.Index(fields=['priority']),
            models.Index(fields=['created_at']),
            models.Index(fields=['related_patient']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_insight_type_display()})"


class ReportTemplate(models.Model):
    """
    Represents a report template that can be used to generate reports.
    """
    class ReportScope(models.TextChoices):
        DOCTOR = 'doctor', _('Doctor')
        PRACTICE = 'practice', _('Practice')
        PATIENT = 'patient', _('Patient')
        FINANCIAL = 'financial', _('Financial')
        CLINICAL = 'clinical', _('Clinical')
        CUSTOM = 'custom', _('Custom')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    scope = models.CharField(
        max_length=20,
        choices=ReportScope.choices
    )
    metrics = models.ManyToManyField(
        DashboardMetric,
        related_name='report_templates'
    )
    config = models.JSONField(
        help_text=_("Configuration for report generation")
    )
    is_system = models.BooleanField(
        default=False,
        help_text=_("Whether this is a system-provided template")
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_report_templates'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['scope']),
            models.Index(fields=['is_system']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_scope_display()})"


class Report(models.Model):
    """
    Represents a generated report.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    template = models.ForeignKey(
        ReportTemplate,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reports'
    )
    parameters = models.JSONField(
        help_text=_("Parameters used for report generation")
    )
    result = models.JSONField(
        null=True,
        blank=True,
        help_text=_("Generated report data")
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    error_message = models.TextField(blank=True, null=True)
    file_path = models.CharField(max_length=255, blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    file_size = models.IntegerField(blank=True, null=True)
    generated_for = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='generated_reports'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['generated_for']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"
