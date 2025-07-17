"""
Database operations for the medical records app
"""
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.conf import settings
import logging

from .models import (
    PatientCondition,
    PatientMedication,
    MedicationRefillRequest,
    VitalSigns,
    LabResult,
    MedicalDocument,
    ClinicalEncounter
)
from users.models import PatientProfile, DoctorProfile

logger = logging.getLogger('django')

# Patient Condition operations
def get_all_conditions(patient_id=None):
    """Get all conditions, filtered by patient ID if provided"""
    if patient_id:
        return PatientCondition.objects.filter(patient_id=patient_id)
    return PatientCondition.objects.all()

def get_condition(condition_id):
    """Get a specific condition by ID"""
    return get_object_or_404(PatientCondition, id=condition_id)

def create_condition(condition_data):
    """Create a new patient condition"""
    try:
        condition = PatientCondition.objects.create(**condition_data)
        logger.info(f"Created condition for patient: {condition.patient_id}")
        return condition
    except Exception as e:
        logger.error(f"Error creating condition: {str(e)}")
        raise

def update_condition(condition_id, condition_data):
    """Update a patient condition"""
    condition = get_object_or_404(PatientCondition, id=condition_id)
    
    for key, value in condition_data.items():
        setattr(condition, key, value)
    condition.save()
    
    logger.info(f"Updated condition: {condition_id}")
    return condition

def delete_condition(condition_id):
    """Delete a patient condition"""
    condition = get_object_or_404(PatientCondition, id=condition_id)
    condition.delete()
    logger.info(f"Deleted condition: {condition_id}")
    return True

# Patient Medication operations
def get_all_medications(patient_id=None):
    """Get all medications, filtered by patient ID if provided"""
    if patient_id:
        return PatientMedication.objects.filter(patient_id=patient_id)
    return PatientMedication.objects.all()

def get_medication(medication_id):
    """Get a specific medication by ID"""
    return get_object_or_404(PatientMedication, id=medication_id)

def create_medication(medication_data):
    """Create a new patient medication"""
    try:
        medication = PatientMedication.objects.create(**medication_data)
        logger.info(f"Created medication for patient: {medication.patient_id}")
        return medication
    except Exception as e:
        logger.error(f"Error creating medication: {str(e)}")
        raise

def update_medication(medication_id, medication_data):
    """Update a patient medication"""
    medication = get_object_or_404(PatientMedication, id=medication_id)
    
    for key, value in medication_data.items():
        setattr(medication, key, value)
    medication.save()
    
    logger.info(f"Updated medication: {medication_id}")
    return medication

def delete_medication(medication_id):
    """Delete a patient medication"""
    medication = get_object_or_404(PatientMedication, id=medication_id)
    medication.delete()
    logger.info(f"Deleted medication: {medication_id}")
    return True

# Medication Refill Request operations
def get_all_refill_requests(patient_id=None, medication_id=None):
    """Get all refill requests, filtered by patient ID or medication ID if provided"""
    queryset = MedicationRefillRequest.objects.all()
    
    if patient_id:
        queryset = queryset.filter(medication__patient_id=patient_id)
    if medication_id:
        queryset = queryset.filter(medication_id=medication_id)
        
    return queryset

def get_refill_request(request_id):
    """Get a specific refill request by ID"""
    return get_object_or_404(MedicationRefillRequest, id=request_id)

def create_refill_request(refill_data):
    """Create a new medication refill request"""
    try:
        refill_request = MedicationRefillRequest.objects.create(**refill_data)
        logger.info(f"Created refill request for medication: {refill_request.medication_id}")
        return refill_request
    except Exception as e:
        logger.error(f"Error creating refill request: {str(e)}")
        raise

def update_refill_request(request_id, refill_data):
    """Update a medication refill request"""
    refill_request = get_object_or_404(MedicationRefillRequest, id=request_id)
    
    for key, value in refill_data.items():
        setattr(refill_request, key, value)
    refill_request.save()
    
    logger.info(f"Updated refill request: {request_id}")
    return refill_request

def delete_refill_request(request_id):
    """Delete a medication refill request"""
    refill_request = get_object_or_404(MedicationRefillRequest, id=request_id)
    refill_request.delete()
    logger.info(f"Deleted refill request: {request_id}")
    return True

# Vital Signs operations
def get_all_vitals(patient_id=None):
    """Get all vital signs, filtered by patient ID if provided"""
    if patient_id:
        return VitalSigns.objects.filter(patient_id=patient_id)
    return VitalSigns.objects.all()

def get_vitals(vitals_id):
    """Get a specific vital signs record by ID"""
    return get_object_or_404(VitalSigns, id=vitals_id)

def create_vitals(vitals_data):
    """Create a new vital signs record"""
    try:
        vitals = VitalSigns.objects.create(**vitals_data)
        logger.info(f"Created vitals for patient: {vitals.patient_id}")
        return vitals
    except Exception as e:
        logger.error(f"Error creating vitals: {str(e)}")
        raise

def update_vitals(vitals_id, vitals_data):
    """Update a vital signs record"""
    vitals = get_object_or_404(VitalSigns, id=vitals_id)
    
    for key, value in vitals_data.items():
        setattr(vitals, key, value)
    vitals.save()
    
    logger.info(f"Updated vitals: {vitals_id}")
    return vitals

def delete_vitals(vitals_id):
    """Delete a vital signs record"""
    vitals = get_object_or_404(VitalSigns, id=vitals_id)
    vitals.delete()
    logger.info(f"Deleted vitals: {vitals_id}")
    return True

# Lab Result operations
def get_all_lab_results(patient_id=None):
    """Get all lab results, filtered by patient ID if provided"""
    if patient_id:
        return LabResult.objects.filter(patient_id=patient_id)
    return LabResult.objects.all()

def get_lab_result(result_id):
    """Get a specific lab result by ID"""
    return get_object_or_404(LabResult, id=result_id)

def create_lab_result(result_data):
    """Create a new lab result"""
    try:
        lab_result = LabResult.objects.create(**result_data)
        logger.info(f"Created lab result for patient: {lab_result.patient_id}")
        return lab_result
    except Exception as e:
        logger.error(f"Error creating lab result: {str(e)}")
        raise

def update_lab_result(result_id, result_data):
    """Update a lab result"""
    lab_result = get_object_or_404(LabResult, id=result_id)
    
    for key, value in result_data.items():
        setattr(lab_result, key, value)
    lab_result.save()
    
    logger.info(f"Updated lab result: {result_id}")
    return lab_result

def delete_lab_result(result_id):
    """Delete a lab result"""
    lab_result = get_object_or_404(LabResult, id=result_id)
    lab_result.delete()
    logger.info(f"Deleted lab result: {result_id}")
    return True

# Medical Document operations
def get_all_documents(patient_id=None):
    """Get all medical documents, filtered by patient ID if provided"""
    if patient_id:
        return MedicalDocument.objects.filter(patient_id=patient_id)
    return MedicalDocument.objects.all()

def get_document(document_id):
    """Get a specific medical document by ID"""
    return get_object_or_404(MedicalDocument, id=document_id)

def create_document(document_data, document_file=None):
    """Create a new medical document"""
    try:
        document = MedicalDocument.objects.create(**document_data)
        
        if document_file:
            document.file = document_file
            document.save()
            
        logger.info(f"Created document for patient: {document.patient_id}")
        return document
    except Exception as e:
        logger.error(f"Error creating document: {str(e)}")
        raise

def update_document(document_id, document_data, document_file=None):
    """Update a medical document"""
    document = get_object_or_404(MedicalDocument, id=document_id)
    
    for key, value in document_data.items():
        setattr(document, key, value)
    
    if document_file:
        document.file = document_file
        
    document.save()
    
    logger.info(f"Updated document: {document_id}")
    return document

def delete_document(document_id):
    """Delete a medical document"""
    document = get_object_or_404(MedicalDocument, id=document_id)
    document.delete()
    logger.info(f"Deleted document: {document_id}")
    return True

# Clinical Encounter operations
def get_all_encounters(patient_id=None, provider_id=None):
    """Get all clinical encounters, filtered by patient ID or provider ID if provided"""
    queryset = ClinicalEncounter.objects.all()
    
    if patient_id:
        queryset = queryset.filter(patient_id=patient_id)
    if provider_id:
        queryset = queryset.filter(provider_id=provider_id)
        
    return queryset

def get_encounter(encounter_id):
    """Get a specific clinical encounter by ID"""
    return get_object_or_404(ClinicalEncounter, id=encounter_id)

def create_encounter(encounter_data):
    """Create a new clinical encounter"""
    try:
        encounter = ClinicalEncounter.objects.create(**encounter_data)
        logger.info(f"Created encounter for patient: {encounter.patient_id}")
        return encounter
    except Exception as e:
        logger.error(f"Error creating encounter: {str(e)}")
        raise

def update_encounter(encounter_id, encounter_data):
    """Update a clinical encounter"""
    encounter = get_object_or_404(ClinicalEncounter, id=encounter_id)
    
    for key, value in encounter_data.items():
        setattr(encounter, key, value)
    encounter.save()
    
    logger.info(f"Updated encounter: {encounter_id}")
    return encounter

def delete_encounter(encounter_id):
    """Delete a clinical encounter"""
    encounter = get_object_or_404(ClinicalEncounter, id=encounter_id)
    encounter.delete()
    logger.info(f"Deleted encounter: {encounter_id}")
    return True
