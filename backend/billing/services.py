"""
Database operations for the billing app
"""
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from django.conf import settings
import logging
import uuid

from .models import (
    Invoice, 
    InvoiceItem, 
    Payment, 
    PaymentMethod, 
    InsuranceClaim,
    InsuranceProvider
)
from users.models import User, PatientProfile

logger = logging.getLogger('django')

# Invoice operations
def get_all_invoices(patient_id=None, provider_id=None, status=None, start_date=None, end_date=None):
    """Get all invoices, with optional filtering"""
    queryset = Invoice.objects.all()
    
    if patient_id:
        queryset = queryset.filter(patient_id=patient_id)
    if provider_id:
        queryset = queryset.filter(provider_id=provider_id)
    if status:
        queryset = queryset.filter(status=status)
    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)
        
    return queryset

def get_invoice(invoice_id):
    """Get a specific invoice by ID"""
    return get_object_or_404(Invoice, id=invoice_id)

def create_invoice(invoice_data, items_data):
    """Create a new invoice with items"""
    try:
        with transaction.atomic():
            # Create the invoice
            invoice = Invoice.objects.create(**invoice_data)
            
            # Create invoice items
            total_amount = 0
            for item_data in items_data:
                item_data['invoice'] = invoice
                item = InvoiceItem.objects.create(**item_data)
                total_amount += item.amount
            
            # Update invoice total
            invoice.total_amount = total_amount
            invoice.balance_due = total_amount
            invoice.save()
            
            logger.info(f"Created invoice: {invoice.id} for patient: {invoice.patient_id}")
            return invoice
    except Exception as e:
        logger.error(f"Error creating invoice: {str(e)}")
        raise

def update_invoice(invoice_id, invoice_data):
    """Update an invoice"""
    invoice = get_object_or_404(Invoice, id=invoice_id)
    
    # Don't allow updates to paid or voided invoices
    if invoice.status in ['paid', 'voided']:
        raise ValueError(f"Cannot update invoice with status: {invoice.status}")
    
    for key, value in invoice_data.items():
        setattr(invoice, key, value)
    invoice.save()
    
    logger.info(f"Updated invoice: {invoice_id}")
    return invoice

def void_invoice(invoice_id, reason=None):
    """Void an invoice"""
    invoice = get_object_or_404(Invoice, id=invoice_id)
    
    # Don't allow voiding paid invoices
    if invoice.status == 'paid':
        raise ValueError("Cannot void a paid invoice")
    
    invoice.status = 'voided'
    if reason:
        invoice.notes = f"{invoice.notes}\nVoided: {reason}" if invoice.notes else f"Voided: {reason}"
    invoice.save()
    
    logger.info(f"Voided invoice: {invoice_id}")
    return invoice

def add_invoice_item(invoice_id, item_data):
    """Add an item to an invoice"""
    invoice = get_object_or_404(Invoice, id=invoice_id)
    
    # Don't allow updates to paid or voided invoices
    if invoice.status in ['paid', 'voided']:
        raise ValueError(f"Cannot update invoice with status: {invoice.status}")
    
    # Create the item
    item_data['invoice'] = invoice
    item = InvoiceItem.objects.create(**item_data)
    
    # Update invoice total and balance
    invoice.total_amount += item.amount
    invoice.balance_due += item.amount
    invoice.save()
    
    logger.info(f"Added item to invoice: {invoice_id}")
    return item

def remove_invoice_item(invoice_id, item_id):
    """Remove an item from an invoice"""
    invoice = get_object_or_404(Invoice, id=invoice_id)
    
    # Don't allow updates to paid or voided invoices
    if invoice.status in ['paid', 'voided']:
        raise ValueError(f"Cannot update invoice with status: {invoice.status}")
    
    item = get_object_or_404(InvoiceItem, id=item_id, invoice=invoice)
    
    # Update invoice total and balance
    invoice.total_amount -= item.amount
    invoice.balance_due -= item.amount
    invoice.save()
    
    # Delete the item
    item.delete()
    
    logger.info(f"Removed item from invoice: {invoice_id}")
    return True

# Payment operations
def process_payment(invoice_id, payment_data):
    """Process a payment for an invoice"""
    try:
        with transaction.atomic():
            invoice = get_object_or_404(Invoice, id=invoice_id)
            
            # Don't allow payments to voided invoices
            if invoice.status == 'voided':
                raise ValueError("Cannot pay a voided invoice")
            
            # Create the payment
            payment_data['invoice'] = invoice
            payment_data['date'] = payment_data.get('date', timezone.now())
            payment = Payment.objects.create(**payment_data)
            
            # Update invoice balance and status
            invoice.balance_due -= payment.amount
            
            if invoice.balance_due <= 0:
                invoice.status = 'paid'
                invoice.paid_date = timezone.now()
            else:
                invoice.status = 'partial'
            
            invoice.save()
            
            logger.info(f"Processed payment for invoice: {invoice_id}")
            return payment
    except Exception as e:
        logger.error(f"Error processing payment: {str(e)}")
        raise

def void_payment(payment_id, reason=None):
    """Void a payment"""
    try:
        with transaction.atomic():
            payment = get_object_or_404(Payment, id=payment_id)
            invoice = payment.invoice
            
            # Update payment
            payment.status = 'voided'
            if reason:
                payment.notes = f"{payment.notes}\nVoided: {reason}" if payment.notes else f"Voided: {reason}"
            payment.save()
            
            # Update invoice
            invoice.balance_due += payment.amount
            
            if invoice.balance_due >= invoice.total_amount:
                invoice.status = 'unpaid'
            else:
                invoice.status = 'partial'
                
            if invoice.status != 'paid':
                invoice.paid_date = None
                
            invoice.save()
            
            logger.info(f"Voided payment: {payment_id}")
            return payment
    except Exception as e:
        logger.error(f"Error voiding payment: {str(e)}")
        raise

# Payment Method operations
def get_user_payment_methods(user_id):
    """Get all payment methods for a user"""
    user = get_object_or_404(User, id=user_id)
    return PaymentMethod.objects.filter(user=user)

def get_payment_method(method_id, user_id=None):
    """Get a specific payment method"""
    if user_id:
        return get_object_or_404(PaymentMethod, id=method_id, user_id=user_id)
    return get_object_or_404(PaymentMethod, id=method_id)

def create_payment_method(method_data):
    """Create a new payment method"""
    try:
        method = PaymentMethod.objects.create(**method_data)
        
        # If this is set as default, unset others
        if method.is_default:
            PaymentMethod.objects.filter(
                user=method.user, 
                is_default=True
            ).exclude(id=method.id).update(is_default=False)
        
        logger.info(f"Created payment method: {method.id} for user: {method.user_id}")
        return method
    except Exception as e:
        logger.error(f"Error creating payment method: {str(e)}")
        raise

def update_payment_method(method_id, method_data):
    """Update a payment method"""
    method = get_object_or_404(PaymentMethod, id=method_id)
    
    for key, value in method_data.items():
        setattr(method, key, value)
    method.save()
    
    # If this is set as default, unset others
    if method.is_default:
        PaymentMethod.objects.filter(
            user=method.user, 
            is_default=True
        ).exclude(id=method.id).update(is_default=False)
    
    logger.info(f"Updated payment method: {method_id}")
    return method

def delete_payment_method(method_id):
    """Delete a payment method"""
    method = get_object_or_404(PaymentMethod, id=method_id)
    
    # Check if it has been used for payments
    if Payment.objects.filter(payment_method=method).exists():
        # Don't delete, just mark as inactive
        method.is_active = False
        method.save()
    else:
        # Safe to delete
        method.delete()
    
    logger.info(f"Deleted/deactivated payment method: {method_id}")
    return True

# Insurance Claim operations
def get_all_claims(patient_id=None, provider_id=None, status=None):
    """Get all insurance claims, with optional filtering"""
    queryset = InsuranceClaim.objects.all()
    
    if patient_id:
        queryset = queryset.filter(patient_id=patient_id)
    if provider_id:
        queryset = queryset.filter(provider_id=provider_id)
    if status:
        queryset = queryset.filter(status=status)
        
    return queryset

def get_claim(claim_id):
    """Get a specific insurance claim"""
    return get_object_or_404(InsuranceClaim, id=claim_id)

def create_claim(claim_data):
    """Create a new insurance claim"""
    try:
        claim = InsuranceClaim.objects.create(**claim_data)
        logger.info(f"Created insurance claim: {claim.id} for patient: {claim.patient_id}")
        return claim
    except Exception as e:
        logger.error(f"Error creating insurance claim: {str(e)}")
        raise

def update_claim(claim_id, claim_data):
    """Update an insurance claim"""
    claim = get_object_or_404(InsuranceClaim, id=claim_id)
    
    for key, value in claim_data.items():
        setattr(claim, key, value)
    claim.save()
    
    logger.info(f"Updated insurance claim: {claim_id}")
    return claim

def process_claim_response(claim_id, response_data):
    """Process insurance claim response"""
    try:
        with transaction.atomic():
            claim = get_object_or_404(InsuranceClaim, id=claim_id)
            
            # Update claim with response
            claim.status = response_data.get('status', claim.status)
            claim.insurance_paid_amount = response_data.get('paid_amount', 0)
            claim.patient_responsibility = response_data.get('patient_responsibility', 0)
            claim.response_date = response_data.get('response_date', timezone.now())
            claim.response_details = response_data.get('details', '')
            claim.claim_number = response_data.get('claim_number', claim.claim_number)
            claim.save()
            
            # If there's an associated invoice, update it
            if claim.invoice:
                invoice = claim.invoice
                
                # Calculate new balance due
                if claim.status == 'approved':
                    invoice.balance_due = claim.patient_responsibility
                    
                    # If insurance paid in full, mark as paid
                    if invoice.balance_due <= 0:
                        invoice.status = 'paid'
                        invoice.paid_date = timezone.now()
                    else:
                        invoice.status = 'partial'
                        
                    invoice.save()
            
            logger.info(f"Processed response for claim: {claim_id}")
            return claim
    except Exception as e:
        logger.error(f"Error processing claim response: {str(e)}")
        raise

# Insurance Provider operations
def get_all_insurance_providers():
    """Get all insurance providers"""
    return InsuranceProvider.objects.all()

def get_insurance_provider(provider_id):
    """Get a specific insurance provider"""
    return get_object_or_404(InsuranceProvider, id=provider_id)

def create_insurance_provider(provider_data):
    """Create a new insurance provider"""
    try:
        provider = InsuranceProvider.objects.create(**provider_data)
        logger.info(f"Created insurance provider: {provider.id}")
        return provider
    except Exception as e:
        logger.error(f"Error creating insurance provider: {str(e)}")
        raise

def update_insurance_provider(provider_id, provider_data):
    """Update an insurance provider"""
    provider = get_object_or_404(InsuranceProvider, id=provider_id)
    
    for key, value in provider_data.items():
        setattr(provider, key, value)
    provider.save()
    
    logger.info(f"Updated insurance provider: {provider_id}")
    return provider

def delete_insurance_provider(provider_id):
    """Delete an insurance provider"""
    provider = get_object_or_404(InsuranceProvider, id=provider_id)
    
    # Check if it has been used for claims
    if InsuranceClaim.objects.filter(insurance_provider=provider).exists():
        # Don't delete, just mark as inactive
        provider.is_active = False
        provider.save()
    else:
        # Safe to delete
        provider.delete()
    
    logger.info(f"Deleted/deactivated insurance provider: {provider_id}")
    return True
