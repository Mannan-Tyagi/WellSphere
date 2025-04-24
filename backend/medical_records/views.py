"""
Views for the medical records app
"""

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
import logging

from .serializers import (
    PatientConditionSerializer,
    PatientMedicationSerializer,
    MedicationRefillRequestSerializer,
    VitalSignsSerializer,
    LabResultSerializer,
    MedicalDocumentSerializer,
    ClinicalEncounterSerializer
)
from .permissions import IsPatientOrProvider, IsProvider
from . import services

logger = logging.getLogger('django')


class PatientConditionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for patient conditions
    """
    serializer_class = PatientConditionSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProvider]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        return services.get_all_conditions(patient_id)
    
    def get_object(self):
        return services.get_condition(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            condition = services.create_condition(serializer.validated_data)
            return Response(self.get_serializer(condition).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            condition = services.update_condition(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(condition).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_condition(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class PatientMedicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for patient medications
    """
    serializer_class = PatientMedicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProvider]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        return services.get_all_medications(patient_id)
    
    def get_object(self):
        return services.get_medication(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            medication = services.create_medication(serializer.validated_data)
            return Response(self.get_serializer(medication).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            medication = services.update_medication(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(medication).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_medication(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class MedicationRefillRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for medication refill requests
    """
    serializer_class = MedicationRefillRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProvider]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        medication_id = self.request.query_params.get('medication', None)
        return services.get_all_refill_requests(patient_id, medication_id)
    
    def get_object(self):
        return services.get_refill_request(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            refill_request = services.create_refill_request(serializer.validated_data)
            return Response(self.get_serializer(refill_request).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            refill_request = services.update_refill_request(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(refill_request).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_refill_request(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class VitalSignsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for vital signs
    """
    serializer_class = VitalSignsSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProvider]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        return services.get_all_vitals(patient_id)
    
    def get_object(self):
        return services.get_vitals(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            vitals = services.create_vitals(serializer.validated_data)
            return Response(self.get_serializer(vitals).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            vitals = services.update_vitals(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(vitals).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_vitals(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class LabResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for lab results
    """
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProvider]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        return services.get_all_lab_results(patient_id)
    
    def get_object(self):
        return services.get_lab_result(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            lab_result = services.create_lab_result(serializer.validated_data)
            return Response(self.get_serializer(lab_result).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            lab_result = services.update_lab_result(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(lab_result).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_lab_result(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class MedicalDocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for medical documents
    """
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProvider]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        return services.get_all_documents(patient_id)
    
    def get_object(self):
        return services.get_document(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            document_file = request.FILES.get('file', None)
            document = services.create_document(serializer.validated_data, document_file)
            return Response(self.get_serializer(document).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            document_file = request.FILES.get('file', None)
            document = services.update_document(
                self.kwargs['pk'], serializer.validated_data, document_file
            )
            return Response(self.get_serializer(document).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_document(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClinicalEncounterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for clinical encounters
    """
    serializer_class = ClinicalEncounterSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProvider]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        provider_id = self.request.query_params.get('provider', None)
        return services.get_all_encounters(patient_id, provider_id)
    
    def get_object(self):
        return services.get_encounter(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            encounter = services.create_encounter(serializer.validated_data)
            return Response(self.get_serializer(encounter).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            encounter = services.update_encounter(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(encounter).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_encounter(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)
