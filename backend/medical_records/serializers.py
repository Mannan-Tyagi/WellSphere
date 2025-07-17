"""
Serializers for the medical_records app
"""

from rest_framework import serializers
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User, PatientProfile, DoctorProfile
from users.serializers import UserSerializer, PatientProfileSerializer, DoctorProfileSerializer
from .models import (
    PatientCondition, PatientMedication, MedicationRefillRequest,
    VitalSigns, LabResult, MedicalDocument, 
    ClinicalEncounter, ClinicalEncounterVersion
)
from .models_family import (
    FamilyRelationship, HealthRecordAccess, AccessLog
)


class PatientConditionSerializer(serializers.ModelSerializer):
    """
    Serializer for patient conditions.
    """
    diagnosed_by_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    severity_display = serializers.SerializerMethodField()
    
    class Meta:
        model = PatientCondition
        fields = [
            'id', 'patient', 'condition_name', 'icd_10_code',
            'diagnosed_date', 'diagnosed_by', 'diagnosed_by_name',
            'status', 'status_display', 'resolved_date',
            'notes', 'is_chronic', 'severity', 'severity_display',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'diagnosed_by_name', 'status_display', 
                           'severity_display', 'created_at', 'updated_at']
    
    def get_diagnosed_by_name(self, obj):
        if obj.diagnosed_by:
            return obj.diagnosed_by.user.get_full_name()
        return None
    
    def get_status_display(self, obj):
        return obj.get_status_display()
    
    def get_severity_display(self, obj):
        return obj.get_severity_display()


class PatientMedicationSerializer(serializers.ModelSerializer):
    """
    Serializer for patient medications.
    """
    prescribed_by_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = PatientMedication
        fields = [
            'id', 'patient', 'medication_name', 'generic_name',
            'prescribed_by', 'prescribed_by_name', 'prescribed_date',
            'start_date', 'end_date', 'dosage', 'frequency', 'route',
            'reason', 'instruction', 'status', 'status_display',
            'pharmacy_notes', 'refills_authorized', 'refills_remaining',
            'is_controlled_substance', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'prescribed_by_name', 'status_display', 
                           'created_at', 'updated_at']
    
    def get_prescribed_by_name(self, obj):
        if obj.prescribed_by:
            return obj.prescribed_by.user.get_full_name()
        return None
    
    def get_status_display(self, obj):
        return obj.get_status_display()


class MedicationRefillRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for medication refill requests.
    """
    medication_name = serializers.SerializerMethodField()
    requested_by_name = serializers.SerializerMethodField()
    response_by_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicationRefillRequest
        fields = [
            'id', 'medication', 'medication_name', 'requested_by', 
            'requested_by_name', 'requested_date', 'status', 'status_display',
            'response_by', 'response_by_name', 'response_date', 'notes',
            'pharmacy_processed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'medication_name', 'requested_by_name', 
                           'response_by_name', 'status_display', 
                           'created_at', 'updated_at']
    
    def get_medication_name(self, obj):
        return obj.medication.medication_name
    
    def get_requested_by_name(self, obj):
        return obj.requested_by.get_full_name()
    
    def get_response_by_name(self, obj):
        if obj.response_by:
            return obj.response_by.get_full_name()
        return None
    
    def get_status_display(self, obj):
        return obj.get_status_display()


class VitalSignsSerializer(serializers.ModelSerializer):
    """
    Serializer for vital signs.
    """
    patient_name = serializers.SerializerMethodField()
    recorded_by_name = serializers.SerializerMethodField()
    appointment_display = serializers.SerializerMethodField()
    blood_pressure = serializers.SerializerMethodField()
    
    class Meta:
        model = VitalSigns
        fields = [
            'id', 'patient', 'patient_name', 'appointment', 'appointment_display',
            'recorded_by', 'recorded_by_name', 'recorded_at', 'temperature',
            'heart_rate', 'respiratory_rate', 'blood_pressure_systolic',
            'blood_pressure_diastolic', 'blood_pressure', 'oxygen_saturation',
            'pain_level', 'height_cm', 'weight_kg', 'bmi', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_name', 'recorded_by_name', 
                           'appointment_display', 'blood_pressure', 'bmi',
                           'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_recorded_by_name(self, obj):
        return obj.recorded_by.get_full_name()
    
    def get_appointment_display(self, obj):
        if obj.appointment:
            return f"{obj.appointment.appointment_type.name} - {obj.appointment.start_time.strftime('%Y-%m-%d %H:%M')}"
        return None
    
    def get_blood_pressure(self, obj):
        if obj.blood_pressure_systolic and obj.blood_pressure_diastolic:
            return f"{obj.blood_pressure_systolic}/{obj.blood_pressure_diastolic}"
        return None


class LabResultSerializer(serializers.ModelSerializer):
    """
    Serializer for lab results.
    """
    patient_name = serializers.SerializerMethodField()
    ordered_by_name = serializers.SerializerMethodField()
    reviewed_by_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    abnormal_flag_display = serializers.SerializerMethodField()
    
    class Meta:
        model = LabResult
        fields = [
            'id', 'patient', 'patient_name', 'ordered_by', 'ordered_by_name',
            'reviewed_by', 'reviewed_by_name', 'order_date', 'result_date',
            'lab_name', 'test_name', 'test_code', 'test_category',
            'result_value', 'reference_range', 'unit', 'abnormal_flag',
            'abnormal_flag_display', 'status', 'status_display', 'notes',
            'is_public_to_patient', 'viewed_by_patient', 'viewed_by_patient_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_name', 'ordered_by_name', 
                           'reviewed_by_name', 'status_display', 
                           'abnormal_flag_display', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_ordered_by_name(self, obj):
        return obj.ordered_by.get_full_name()
    
    def get_reviewed_by_name(self, obj):
        if obj.reviewed_by:
            return obj.reviewed_by.get_full_name()
        return None
    
    def get_status_display(self, obj):
        return obj.get_status_display()
    
    def get_abnormal_flag_display(self, obj):
        if obj.abnormal_flag:
            return obj.get_abnormal_flag_display()
        return None


class MedicalDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for medical documents.
    """
    patient_name = serializers.SerializerMethodField()
    uploaded_by_name = serializers.SerializerMethodField()
    appointment_display = serializers.SerializerMethodField()
    document_type_display = serializers.SerializerMethodField()
    storage_provider_display = serializers.SerializerMethodField()
    file_size_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalDocument
        fields = [
            'id', 'patient', 'patient_name', 'uploaded_by', 'uploaded_by_name',
            'appointment', 'appointment_display', 'document_type', 'document_type_display',
            'title', 'description', 'file_path', 'file_type', 'file_size', 'file_size_display',
            'storage_provider', 'storage_provider_display', 'is_encrypted', 'ocr_processed',
            'ocr_text', 'is_public_to_patient', 'viewed_by_patient', 'viewed_by_patient_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_name', 'uploaded_by_name', 
                           'appointment_display', 'document_type_display',
                           'storage_provider_display', 'file_size_display',
                           'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.get_full_name()
    
    def get_appointment_display(self, obj):
        if obj.appointment:
            return f"{obj.appointment.appointment_type.name} - {obj.appointment.start_time.strftime('%Y-%m-%d %H:%M')}"
        return None
    
    def get_document_type_display(self, obj):
        return obj.get_document_type_display()
    
    def get_storage_provider_display(self, obj):
        return obj.get_storage_provider_display()
    
    def get_file_size_display(self, obj):
        if obj.file_size:
            # Convert bytes to KB, MB as appropriate
            if obj.file_size < 1024:
                return f"{obj.file_size} bytes"
            elif obj.file_size < 1024 * 1024:
                return f"{obj.file_size / 1024:.2f} KB"
            else:
                return f"{obj.file_size / (1024 * 1024):.2f} MB"
        return None


class ClinicalEncounterSerializer(serializers.ModelSerializer):
    """
    Serializer for clinical encounters.
    """
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    appointment_display = serializers.SerializerMethodField()
    encounter_type_display = serializers.SerializerMethodField()
    finalized_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ClinicalEncounter
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'appointment', 'appointment_display', 'encounter_date',
            'encounter_type', 'encounter_type_display', 'chief_complaint',
            'subjective', 'objective', 'assessment', 'plan', 'diagnoses',
            'billing_code', 'billing_level', 'is_finalized', 'finalized_at',
            'finalized_by', 'finalized_by_name', 'is_public_to_patient',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_name', 'doctor_name', 
                           'appointment_display', 'encounter_type_display',
                           'finalized_by_name', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name()
    
    def get_appointment_display(self, obj):
        if obj.appointment:
            return f"{obj.appointment.appointment_type.name} - {obj.appointment.start_time.strftime('%Y-%m-%d %H:%M')}"
        return None
    
    def get_encounter_type_display(self, obj):
        return obj.get_encounter_type_display()
    
    def get_finalized_by_name(self, obj):
        if obj.finalized_by:
            return obj.finalized_by.get_full_name()
        return None


class ClinicalEncounterVersionSerializer(serializers.ModelSerializer):
    """
    Serializer for clinical encounter versions.
    """
    modified_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ClinicalEncounterVersion
        fields = [
            'id', 'encounter', 'version_number', 'modified_by',
            'modified_by_name', 'modified_at', 'content_json', 'change_reason'
        ]
        read_only_fields = ['id', 'modified_by_name']
    
    def get_modified_by_name(self, obj):
        return obj.modified_by.get_full_name()


class FamilyRelationshipSerializer(serializers.ModelSerializer):
    """
    Serializer for family relationships.
    """
    patient_name = serializers.SerializerMethodField()
    related_patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = FamilyRelationship
        fields = [
            'id', 'patient', 'patient_name', 'related_patient',
            'related_patient_name', 'relationship_type', 'is_emergency_contact',
            'has_proxy_access', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_name', 'related_patient_name', 
                           'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_related_patient_name(self, obj):
        return obj.related_patient.user.get_full_name()


class HealthRecordAccessSerializer(serializers.ModelSerializer):
    """
    Serializer for health record access.
    """
    patient_name = serializers.SerializerMethodField()
    granted_to_user_name = serializers.SerializerMethodField()
    granted_by_name = serializers.SerializerMethodField()
    revoked_by_name = serializers.SerializerMethodField()
    access_type_display = serializers.SerializerMethodField()
    access_level_display = serializers.SerializerMethodField()
    
    class Meta:
        model = HealthRecordAccess
        fields = [
            'id', 'patient', 'patient_name', 'granted_to_user', 'granted_to_user_name',
            'access_type', 'access_type_display', 'access_level', 'access_level_display',
            'accessible_data', 'granted_at', 'expires_at', 'granted_by', 'granted_by_name',
            'is_active', 'revoked_at', 'revoked_by', 'revoked_by_name',
            'revocation_reason', 'notes', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_name', 'granted_to_user_name', 
                           'granted_by_name', 'revoked_by_name',
                           'access_type_display', 'access_level_display', 'updated_at']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_granted_to_user_name(self, obj):
        return obj.granted_to_user.get_full_name()
    
    def get_granted_by_name(self, obj):
        if obj.granted_by:
            return obj.granted_by.get_full_name()
        return None
    
    def get_revoked_by_name(self, obj):
        if obj.revoked_by:
            return obj.revoked_by.get_full_name()
        return None
    
    def get_access_type_display(self, obj):
        return obj.get_access_type_display()
    
    def get_access_level_display(self, obj):
        return obj.get_access_level_display()


class AccessLogSerializer(serializers.ModelSerializer):
    """
    Serializer for access logs.
    """
    patient_name = serializers.SerializerMethodField()
    accessed_by_name = serializers.SerializerMethodField()
    access_reason_display = serializers.SerializerMethodField()
    
    class Meta:
        model = AccessLog
        fields = [
            'id', 'patient', 'patient_name', 'accessed_by', 'accessed_by_name',
            'access_time', 'access_reason', 'access_reason_display',
            'reason_note', 'data_accessed', 'ip_address', 'user_agent'
        ]
        read_only_fields = ['id', 'patient_name', 'accessed_by_name', 
                           'access_reason_display']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_accessed_by_name(self, obj):
        return obj.accessed_by.get_full_name()
    
    def get_access_reason_display(self, obj):
        return obj.get_access_reason_display()