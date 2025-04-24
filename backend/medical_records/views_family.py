"""
Views for family relationships and health record sharing
"""

from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from users.models import User, PatientProfile
from users.permissions import IsPatient, IsPrimaryDoctorOrPatient, HasPatientAccessPermission
from .models_family import FamilyRelationship, HealthRecordAccess, AccessLog
from .serializers import (
    FamilyRelationshipSerializer, HealthRecordAccessSerializer, AccessLogSerializer
)


class FamilyRelationshipViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing family relationships.
    """
    serializer_class = FamilyRelationshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['patient', 'related_patient', 'is_emergency_contact', 'has_proxy_access']
    search_fields = ['relationship_type', 'notes']
    
    def get_queryset(self):
        """
        Filter relationships based on the user's role:
        - Patients can see their own family relationships
        - Doctors can see relationships of their patients
        - Staff can see all relationships
        """
        user = self.request.user
        
        if user.is_admin or user.is_staff_member:
            return FamilyRelationship.objects.all()
        
        if user.is_doctor:
            try:
                doctor_profile = user.doctor_profile
                # Get patients where user is the primary doctor
                patient_ids = PatientProfile.objects.filter(primary_doctor=doctor_profile).values_list('id', flat=True)
                return FamilyRelationship.objects.filter(
                    Q(patient__id__in=patient_ids) | Q(related_patient__id__in=patient_ids)
                )
            except Exception:
                return FamilyRelationship.objects.none()
        
        if user.is_patient:
            try:
                patient_profile = user.patient_profile
                return FamilyRelationship.objects.filter(
                    Q(patient=patient_profile) | Q(related_patient=patient_profile)
                )
            except Exception:
                return FamilyRelationship.objects.none()
        
        return FamilyRelationship.objects.none()
    
    def perform_create(self, serializer):
        # Create bidirectional relationship if needed
        relationship = serializer.save()
        
        # This should be customized based on your application's needs
        # For example, if A is parent of B, B should be child of A
        reciprocal_mapping = {
            'parent': 'child',
            'child': 'parent',
            'spouse': 'spouse',
            'sibling': 'sibling',
            'grandparent': 'grandchild',
            'grandchild': 'grandparent',
            'guardian': 'dependent',
            'dependent': 'guardian',
        }
        
        # Check if a reciprocal relationship should be created
        rel_type = relationship.relationship_type.lower()
        if rel_type in reciprocal_mapping:
            # Check if the reciprocal relationship already exists
            exists = FamilyRelationship.objects.filter(
                patient=relationship.related_patient,
                related_patient=relationship.patient
            ).exists()
            
            if not exists:
                # Create the reciprocal relationship
                FamilyRelationship.objects.create(
                    patient=relationship.related_patient,
                    related_patient=relationship.patient,
                    relationship_type=reciprocal_mapping[rel_type],
                    is_emergency_contact=relationship.is_emergency_contact,
                    has_proxy_access=relationship.has_proxy_access,
                    notes=relationship.notes
                )


class HealthRecordAccessViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing health record access.
    """
    serializer_class = HealthRecordAccessSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['patient', 'granted_to_user', 'access_type', 'access_level', 'is_active']
    search_fields = ['notes', 'revocation_reason']
    
    def get_queryset(self):
        """
        Filter access records based on the user's role:
        - Patients can see who has access to their records and which records they have access to
        - Doctors can see access to their patients' records
        - Staff can see all access records
        """
        user = self.request.user
        
        if user.is_admin or user.is_staff_member:
            return HealthRecordAccess.objects.all()
        
        if user.is_doctor:
            try:
                doctor_profile = user.doctor_profile
                # Get patients where user is the primary doctor
                patient_ids = PatientProfile.objects.filter(primary_doctor=doctor_profile).values_list('id', flat=True)
                return HealthRecordAccess.objects.filter(patient__id__in=patient_ids)
            except Exception:
                # Get records where doctor has been granted access
                return HealthRecordAccess.objects.filter(granted_to_user=user)
        
        if user.is_patient:
            try:
                patient_profile = user.patient_profile
                # Get access to their own records or records they've been granted access to
                return HealthRecordAccess.objects.filter(
                    Q(patient=patient_profile) | Q(granted_to_user=user)
                )
            except Exception:
                return HealthRecordAccess.objects.filter(granted_to_user=user)
        
        return HealthRecordAccess.objects.none()
    
    def perform_create(self, serializer):
        # Record who granted access
        serializer.save(granted_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """
        Revoke access to health records.
        """
        access = self.get_object()
        
        # Check if access is already revoked
        if not access.is_active:
            return Response(
                {'detail': 'Access has already been revoked.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get revocation reason from request data
        reason = request.data.get('revocation_reason', '')
        
        # Revoke access
        access.is_active = False
        access.revoked_at = timezone.now()
        access.revoked_by = request.user
        access.revocation_reason = reason
        access.save()
        
        # Return the updated access record
        serializer = self.get_serializer(access)
        return Response(serializer.data)


class AccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing access logs. Read-only for security purposes.
    """
    serializer_class = AccessLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['patient', 'accessed_by', 'access_reason']
    search_fields = ['reason_note', 'ip_address']
    
    def get_queryset(self):
        """
        Filter access logs based on the user's role:
        - Patients can see who accessed their records
        - Doctors can see logs for their patients
        - Staff can see all logs
        """
        user = self.request.user
        
        if user.is_admin or user.is_staff_member:
            return AccessLog.objects.all()
        
        if user.is_doctor:
            try:
                doctor_profile = user.doctor_profile
                # Get patients where user is the primary doctor
                patient_ids = PatientProfile.objects.filter(primary_doctor=doctor_profile).values_list('id', flat=True)
                return AccessLog.objects.filter(
                    Q(patient__id__in=patient_ids) | Q(accessed_by=user)
                )
            except Exception:
                return AccessLog.objects.filter(accessed_by=user)
        
        if user.is_patient:
            try:
                patient_profile = user.patient_profile
                return AccessLog.objects.filter(
                    Q(patient=patient_profile) | Q(accessed_by=user)
                )
            except Exception:
                return AccessLog.objects.filter(accessed_by=user)
        
        return AccessLog.objects.none()
