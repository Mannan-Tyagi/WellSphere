"""
Models for the medical_records app
"""

import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User, PatientProfile, DoctorProfile


class PatientCondition(models.Model):
    """
    Represents a medical condition or diagnosis for a patient.
    """
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        RESOLVED = 'resolved', _('Resolved')
        RECURRING = 'recurring', _('Recurring')
        IN_REMISSION = 'in_remission', _('In Remission')

    class Severity(models.TextChoices):
        MILD = 'mild', _('Mild')
        MODERATE = 'moderate', _('Moderate')
        SEVERE = 'severe', _('Severe')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='conditions'
    )
    condition_name = models.CharField(max_length=255)
    icd_10_code = models.CharField(max_length=20, blank=True, null=True)
    diagnosed_date = models.DateField(blank=True, null=True)
    diagnosed_by = models.ForeignKey(
        DoctorProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='diagnosed_conditions'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    resolved_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    is_chronic = models.BooleanField(default=False)
    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
        default=Severity.MODERATE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['status']),
            models.Index(fields=['icd_10_code']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.condition_name} ({self.get_status_display()})"


class PatientMedication(models.Model):
    """
    Represents a medication prescribed to a patient.
    """
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        DISCONTINUED = 'discontinued', _('Discontinued')
        COMPLETED = 'completed', _('Completed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='medications'
    )
    medication_name = models.CharField(max_length=255)
    generic_name = models.CharField(max_length=255, blank=True, null=True)
    prescribed_by = models.ForeignKey(
        DoctorProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='prescribed_medications'
    )
    prescribed_date = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    route = models.CharField(max_length=50)
    reason = models.CharField(max_length=255, blank=True, null=True)
    instruction = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    pharmacy_notes = models.TextField(blank=True, null=True)
    refills_authorized = models.IntegerField(default=0)
    refills_remaining = models.IntegerField(default=0)
    is_controlled_substance = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.medication_name} ({self.dosage})"


class MedicationRefillRequest(models.Model):
    """
    Represents a request to refill a medication.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        APPROVED = 'approved', _('Approved')
        DENIED = 'denied', _('Denied')
        COMPLETED = 'completed', _('Completed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    medication = models.ForeignKey(
        PatientMedication,
        on_delete=models.CASCADE,
        related_name='refill_requests'
    )
    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medication_refill_requests'
    )
    requested_date = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    response_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='medication_refill_responses'
    )
    response_date = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    pharmacy_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['medication']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Refill request for {self.medication} ({self.get_status_display()})"


class VitalSigns(models.Model):
    """
    Represents vital signs recorded for a patient.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='vital_signs'
    )
    appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vital_signs'
    )
    recorded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recorded_vital_signs'
    )
    recorded_at = models.DateTimeField()
    temperature = models.DecimalField(
        max_digits=4, decimal_places=1, blank=True, null=True,
        help_text=_("Temperature in Celsius")
    )
    heart_rate = models.IntegerField(
        blank=True, null=True,
        help_text=_("Heart rate in beats per minute")
    )
    respiratory_rate = models.IntegerField(
        blank=True, null=True,
        help_text=_("Respiratory rate in breaths per minute")
    )
    blood_pressure_systolic = models.IntegerField(blank=True, null=True)
    blood_pressure_diastolic = models.IntegerField(blank=True, null=True)
    oxygen_saturation = models.DecimalField(
        max_digits=4, decimal_places=1, blank=True, null=True,
        help_text=_("Oxygen saturation percentage")
    )
    pain_level = models.PositiveSmallIntegerField(
        blank=True, null=True,
        help_text=_("Pain level on a scale of 0-10")
    )
    height_cm = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True,
        help_text=_("Height in centimeters")
    )
    weight_kg = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True,
        help_text=_("Weight in kilograms")
    )
    bmi = models.DecimalField(
        max_digits=4, decimal_places=1, blank=True, null=True,
        help_text=_("Body Mass Index")
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['appointment']),
            models.Index(fields=['recorded_at']),
        ]
        verbose_name_plural = 'vital signs'

    def __str__(self):
        return f"Vitals for {self.patient} on {self.recorded_at}"

    def save(self, *args, **kwargs):
        # Calculate BMI if height and weight are provided
        if self.height_cm and self.weight_kg and not self.bmi:
            height_m = self.height_cm / 100
            self.bmi = self.weight_kg / (height_m * height_m)
        super().save(*args, **kwargs)


class LabResult(models.Model):
    """
    Represents laboratory test results for a patient.
    """
    class Status(models.TextChoices):
        ORDERED = 'ordered', _('Ordered')
        IN_PROGRESS = 'in_progress', _('In Progress')
        COMPLETED = 'completed', _('Completed')
        CANCELLED = 'cancelled', _('Cancelled')

    class AbnormalFlag(models.TextChoices):
        NORMAL = 'normal', _('Normal')
        LOW = 'low', _('Low')
        HIGH = 'high', _('High')
        ABNORMAL = 'abnormal', _('Abnormal')
        CRITICAL = 'critical', _('Critical')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='lab_results'
    )
    ordered_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ordered_lab_results'
    )
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_lab_results'
    )
    order_date = models.DateTimeField()
    result_date = models.DateTimeField(blank=True, null=True)
    lab_name = models.CharField(max_length=255, blank=True, null=True)
    test_name = models.CharField(max_length=255)
    test_code = models.CharField(max_length=50, blank=True, null=True)
    test_category = models.CharField(max_length=100, blank=True, null=True)
    result_value = models.TextField(blank=True, null=True)
    reference_range = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=50, blank=True, null=True)
    abnormal_flag = models.CharField(
        max_length=20,
        choices=AbnormalFlag.choices,
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ORDERED
    )
    notes = models.TextField(blank=True, null=True)
    is_public_to_patient = models.BooleanField(default=False)
    viewed_by_patient = models.BooleanField(default=False)
    viewed_by_patient_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['status']),
            models.Index(fields=['test_name']),
        ]

    def __str__(self):
        return f"{self.test_name} for {self.patient}"


class MedicalDocument(models.Model):
    """
    Represents medical documents or files associated with a patient.
    """
    class DocumentType(models.TextChoices):
        LAB_RESULT = 'lab_result', _('Lab Result')
        IMAGING = 'imaging', _('Imaging')
        CLINICAL_NOTE = 'clinical_note', _('Clinical Note')
        REFERRAL = 'referral', _('Referral')
        PRESCRIPTION = 'prescription', _('Prescription')
        CONSENT_FORM = 'consent_form', _('Consent Form')
        DISCHARGE_SUMMARY = 'discharge_summary', _('Discharge Summary')
        OTHER = 'other', _('Other')

    class StorageProvider(models.TextChoices):
        LOCAL = 'local', _('Local Storage')
        S3 = 's3', _('Amazon S3')
        AZURE = 'azure', _('Azure Blob Storage')
        GCP = 'gcp', _('Google Cloud Storage')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='medical_documents'
    )
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='uploaded_documents'
    )
    appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documents'
    )
    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file_path = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    file_size = models.IntegerField(
        blank=True, null=True,
        help_text=_("File size in bytes")
    )
    storage_provider = models.CharField(
        max_length=20,
        choices=StorageProvider.choices,
        default=StorageProvider.LOCAL
    )
    is_encrypted = models.BooleanField(default=True)
    ocr_processed = models.BooleanField(default=False)
    ocr_text = models.TextField(blank=True, null=True)
    is_public_to_patient = models.BooleanField(default=False)
    viewed_by_patient = models.BooleanField(default=False)
    viewed_by_patient_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['document_type']),
            models.Index(fields=['appointment']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_document_type_display()}) for {self.patient}"


class ClinicalEncounter(models.Model):
    """
    Represents a clinical encounter or visit.
    """
    class EncounterType(models.TextChoices):
        OFFICE_VISIT = 'office_visit', _('Office Visit')
        TELEMEDICINE = 'telemedicine', _('Telemedicine')
        PHONE_CONSULTATION = 'phone_consultation', _('Phone Consultation')
        HOSPITAL_ADMISSION = 'hospital_admission', _('Hospital Admission')
        EMERGENCY = 'emergency', _('Emergency')
        FOLLOW_UP = 'follow_up', _('Follow Up')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='clinical_encounters'
    )
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='clinical_encounters'
    )
    appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clinical_encounters'
    )
    encounter_date = models.DateTimeField()
    encounter_type = models.CharField(
        max_length=30,
        choices=EncounterType.choices
    )
    chief_complaint = models.TextField(blank=True, null=True)
    subjective = models.TextField(
        blank=True, null=True,
        help_text=_("Patient's description")
    )
    objective = models.TextField(
        blank=True, null=True,
        help_text=_("Clinician's observations")
    )
    assessment = models.TextField(
        blank=True, null=True,
        help_text=_("Diagnosis and interpretation")
    )
    plan = models.TextField(
        blank=True, null=True,
        help_text=_("Treatment plan")
    )
    diagnoses = models.JSONField(
        blank=True, null=True,
        help_text=_("Array of condition IDs or ICD-10 codes")
    )
    billing_code = models.CharField(max_length=50, blank=True, null=True)
    billing_level = models.CharField(max_length=20, blank=True, null=True)
    is_finalized = models.BooleanField(default=False)
    finalized_at = models.DateTimeField(blank=True, null=True)
    finalized_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='finalized_encounters'
    )
    is_public_to_patient = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['doctor']),
            models.Index(fields=['encounter_date']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.get_encounter_type_display()} on {self.encounter_date}"

    def finalize(self, user):
        """
        Finalize the encounter note.
        """
        self.is_finalized = True
        self.finalized_at = timezone.now()
        self.finalized_by = user
        self.save()


class ClinicalEncounterVersion(models.Model):
    """
    Stores versions of clinical encounters for audit and history.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    encounter = models.ForeignKey(
        ClinicalEncounter,
        on_delete=models.CASCADE,
        related_name='versions'
    )
    version_number = models.IntegerField()
    modified_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='modified_encounters'
    )
    modified_at = models.DateTimeField()
    content_json = models.JSONField(
        help_text=_("Full JSON snapshot of the encounter")
    )
    change_reason = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ('encounter', 'version_number')
        indexes = [
            models.Index(fields=['encounter']),
        ]

    def __str__(self):
        return f"Version {self.version_number} of {self.encounter}"
