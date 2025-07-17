"""
Models for the billing app
"""

import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User, PatientProfile, DoctorProfile


class InsurancePlan(models.Model):
    """
    Represents an insurance plan.
    """
    class PlanType(models.TextChoices):
        HMO = 'hmo', _('HMO')
        PPO = 'ppo', _('PPO')
        EPO = 'epo', _('EPO')
        POS = 'pos', _('POS')
        HDHP = 'hdhp', _('HDHP')
        MEDICAID = 'medicaid', _('Medicaid')
        MEDICARE = 'medicare', _('Medicare')
        OTHER = 'other', _('Other')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    insurer = models.CharField(max_length=255)
    plan_type = models.CharField(
        max_length=20,
        choices=PlanType.choices
    )
    group_number = models.CharField(max_length=100, blank=True, null=True)
    coverage_start_date = models.DateField()
    coverage_end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    primary_insured = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='primary_insurance_plans'
    )
    relationship_to_insured = models.CharField(
        max_length=50,
        default='self',
        help_text=_("Relationship to the primary insured (self, spouse, child, etc.)")
    )
    policy_number = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['insurer']),
            models.Index(fields=['plan_type']),
            models.Index(fields=['primary_insured']),
            models.Index(fields=['policy_number']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.insurer} ({self.policy_number})"


class PatientInsurance(models.Model):
    """
    Maps patients to their insurance plans.
    """
    class CoverageType(models.TextChoices):
        PRIMARY = 'primary', _('Primary')
        SECONDARY = 'secondary', _('Secondary')
        TERTIARY = 'tertiary', _('Tertiary')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='insurance_plans'
    )
    insurance_plan = models.ForeignKey(
        InsurancePlan,
        on_delete=models.CASCADE,
        related_name='patients'
    )
    coverage_type = models.CharField(
        max_length=20,
        choices=CoverageType.choices,
        default=CoverageType.PRIMARY
    )
    member_id = models.CharField(max_length=100)
    copay_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    deductible = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    deductible_met = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    coverage_percentage = models.IntegerField(
        blank=True,
        null=True,
        help_text=_("Coverage percentage (e.g., 80 for 80%)")
    )
    verification_date = models.DateField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_insurances'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('patient', 'insurance_plan', 'coverage_type')
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['coverage_type']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.insurance_plan} ({self.get_coverage_type_display()})"


class ServiceCode(models.Model):
    """
    Represents a service code (CPT, HCPCS, etc.) for billing.
    """
    class CodeType(models.TextChoices):
        CPT = 'cpt', _('CPT')
        HCPCS = 'hcpcs', _('HCPCS')
        CUSTOM = 'custom', _('Custom')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20)
    description = models.TextField()
    code_type = models.CharField(
        max_length=20,
        choices=CodeType.choices
    )
    default_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    requires_modifier = models.BooleanField(default=False)
    typical_duration = models.IntegerField(
        blank=True,
        null=True,
        help_text=_("Typical duration in minutes")
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('code', 'code_type')
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['code_type']),
        ]

    def __str__(self):
        return f"{self.code} - {self.description}"


class DiagnosisCode(models.Model):
    """
    Represents a diagnosis code (ICD-10) for billing.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20)
    description = models.TextField()
    category = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.code} - {self.description}"


class Claim(models.Model):
    """
    Represents an insurance claim.
    """
    class Status(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        SUBMITTED = 'submitted', _('Submitted')
        PENDING = 'pending', _('Pending')
        APPROVED = 'approved', _('Approved')
        DENIED = 'denied', _('Denied')
        PARTIALLY_APPROVED = 'partially_approved', _('Partially Approved')
        APPEALED = 'appealed', _('Appealed')
        SETTLED = 'settled', _('Settled')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='claims'
    )
    patient_insurance = models.ForeignKey(
        PatientInsurance,
        on_delete=models.SET_NULL,
        null=True,
        related_name='claims'
    )
    appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='claims'
    )
    provider = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='claims'
    )
    claim_number = models.CharField(max_length=100, unique=True)
    date_of_service = models.DateField()
    service_location = models.CharField(max_length=255)
    diagnosis_codes = models.ManyToManyField(
        DiagnosisCode,
        related_name='claims'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    submission_date = models.DateField(blank=True, null=True)
    total_charge = models.DecimalField(max_digits=10, decimal_places=2)
    allowed_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    patient_responsibility = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    insurance_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    payment_date = models.DateField(blank=True, null=True)
    denial_reason = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_claims'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['provider']),
            models.Index(fields=['claim_number']),
            models.Index(fields=['date_of_service']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Claim {self.claim_number} for {self.patient}"


class ClaimService(models.Model):
    """
    Represents a service line item on a claim.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    claim = models.ForeignKey(
        Claim,
        on_delete=models.CASCADE,
        related_name='services'
    )
    service_code = models.ForeignKey(
        ServiceCode,
        on_delete=models.PROTECT,
        related_name='claim_services'
    )
    service_date = models.DateField()
    modifiers = models.CharField(max_length=20, blank=True, null=True)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    allowed_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    insurance_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    patient_responsibility = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['claim']),
            models.Index(fields=['service_code']),
            models.Index(fields=['service_date']),
        ]

    def __str__(self):
        return f"{self.service_code.code} for {self.claim.claim_number}"

    def save(self, *args, **kwargs):
        # Calculate total price
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)


class Invoice(models.Model):
    """
    Represents a patient invoice.
    """
    class Status(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        SENT = 'sent', _('Sent')
        PARTIALLY_PAID = 'partially_paid', _('Partially Paid')
        PAID = 'paid', _('Paid')
        OVERDUE = 'overdue', _('Overdue')
        CANCELLED = 'cancelled', _('Cancelled')
        REFUNDED = 'refunded', _('Refunded')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='invoices'
    )
    invoice_number = models.CharField(max_length=100, unique=True)
    issue_date = models.DateField()
    due_date = models.DateField()
    claim = models.ForeignKey(
        Claim,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoices'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    payment_instructions = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(blank=True, null=True)
    sent_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_invoices'
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_invoices'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['invoice_number']),
            models.Index(fields=['issue_date']),
            models.Index(fields=['due_date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Invoice {self.invoice_number} for {self.patient}"

    def save(self, *args, **kwargs):
        # Calculate balance
        self.balance = self.total - self.amount_paid
        
        # Update status based on payment
        if self.amount_paid == 0 and self.status not in [Invoice.Status.DRAFT, Invoice.Status.CANCELLED]:
            self.status = Invoice.Status.SENT
        elif self.amount_paid > 0 and self.amount_paid < self.total:
            self.status = Invoice.Status.PARTIALLY_PAID
        elif self.amount_paid >= self.total:
            self.status = Invoice.Status.PAID
            
        # Check if overdue
        if self.status not in [Invoice.Status.PAID, Invoice.Status.CANCELLED, Invoice.Status.REFUNDED]:
            if self.due_date < timezone.now().date():
                self.status = Invoice.Status.OVERDUE
                
        super().save(*args, **kwargs)


class InvoiceItem(models.Model):
    """
    Represents a line item on an invoice.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='items'
    )
    description = models.CharField(max_length=255)
    service_code = models.ForeignKey(
        ServiceCode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoice_items'
    )
    service_date = models.DateField()
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['invoice']),
            models.Index(fields=['service_code']),
        ]

    def __str__(self):
        return f"{self.description} for {self.invoice.invoice_number}"

    def save(self, *args, **kwargs):
        # Calculate total price
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)


class Payment(models.Model):
    """
    Represents a payment from a patient.
    """
    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'credit_card', _('Credit Card')
        DEBIT_CARD = 'debit_card', _('Debit Card')
        BANK_TRANSFER = 'bank_transfer', _('Bank Transfer')
        CHECK = 'check', _('Check')
        CASH = 'cash', _('Cash')
        INSURANCE = 'insurance', _('Insurance')
        OTHER = 'other', _('Other')

    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
        REFUNDED = 'refunded', _('Refunded')
        VOIDED = 'voided', _('Voided')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    payment_number = models.CharField(max_length=100, unique=True)
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices
    )
    payment_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    check_number = models.CharField(max_length=50, blank=True, null=True)
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    received_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='received_payments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['invoice']),
            models.Index(fields=['patient']),
            models.Index(fields=['payment_date']),
            models.Index(fields=['status']),
            models.Index(fields=['payment_method']),
        ]

    def __str__(self):
        return f"Payment {self.payment_number} for {self.invoice.invoice_number}"

    def save(self, *args, **kwargs):
        # Create a new payment
        is_new = not self.pk
        super().save(*args, **kwargs)
        
        # Update invoice if payment is completed
        if is_new and self.status == Payment.Status.COMPLETED:
            invoice = self.invoice
            invoice.amount_paid += self.amount
            invoice.save()
