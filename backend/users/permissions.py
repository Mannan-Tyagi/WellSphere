"""
Custom permissions for WellSphere API
"""

from rest_framework import permissions
from .models import User


class IsDoctor(permissions.BasePermission):
    """
    Permission to only allow doctors to access the view.
    """
    message = 'This action is only available to healthcare providers.'

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_doctor


class IsPatient(permissions.BasePermission):
    """
    Permission to only allow patients to access the view.
    """
    message = 'This action is only available to patients.'

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_patient


class IsStaff(permissions.BasePermission):
    """
    Permission to only allow staff members to access the view.
    """
    message = 'This action is only available to staff members.'

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff_member


class IsAdmin(permissions.BasePermission):
    """
    Permission to only allow admin users to access the view.
    """
    message = 'This action is only available to administrators.'

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or staff to edit it.
    """
    message = 'You must be the owner of this object or a staff member.'

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow if user is the owner or staff/admin
        is_owner = obj.user == request.user if hasattr(obj, 'user') else obj == request.user
        return is_owner or request.user.is_staff or request.user.is_admin


class IsPatientOrDoctor(permissions.BasePermission):
    """
    Permission to allow access only to patients or doctors.
    """
    message = 'This action is only available to patients or healthcare providers.'

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_patient or request.user.is_doctor
        )


class IsPrimaryDoctorOrPatient(permissions.BasePermission):
    """
    Object-level permission to only allow primary doctor or the patient to see details.
    """
    message = 'You must be the primary doctor or the patient.'

    def has_object_permission(self, request, view, obj):
        # Determine if the user is the primary doctor or the patient
        if hasattr(obj, 'patient'):
            is_patient = obj.patient.user == request.user
            is_primary_doctor = request.user.is_doctor and obj.patient.primary_doctor and obj.patient.primary_doctor.user == request.user
            return is_patient or is_primary_doctor
        elif hasattr(obj, 'user'):
            is_patient = obj.user == request.user
            is_primary_doctor = request.user.is_doctor and obj.primary_doctor and obj.primary_doctor.user == request.user
            return is_patient or is_primary_doctor
        return False


class HasPatientAccessPermission(permissions.BasePermission):
    """
    Permission to check if a doctor has been granted access to a patient's data.
    Used for referrals, consultations, family-shared records, etc.
    """
    message = 'You have not been granted access to this patient\'s medical information.'

    def has_object_permission(self, request, view, obj):
        # Staff and admins always have access
        if request.user.is_staff or request.user.is_admin:
            return True
            
        # If the user is the patient, they have access
        if hasattr(obj, 'patient'):
            if obj.patient.user == request.user:
                return True
        elif hasattr(obj, 'user'):
            if obj.user == request.user:
                return True
                
        # If the user is a doctor, check access permissions
        if request.user.is_doctor:
            try:
                doctor_profile = request.user.doctor_profile
                
                # Check if user is the primary doctor
                if hasattr(obj, 'patient') and obj.patient.primary_doctor == doctor_profile:
                    return True
                elif hasattr(obj, 'primary_doctor') and obj.primary_doctor == doctor_profile:
                    return True
                    
                # In a real implementation, check additional access grants:
                # - Check for referrals
                # - Check for shared records
                # - Check for emergency access
                # - Check for consultation access
                
                # For now, return False as these checks would need patient_access_control models
                return False
                
            except Exception:
                return False
                
        return False


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission to only allow owners of an object or admins to view or edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow administrators
        if request.user.is_staff or request.user.role == 'admin':
            return True
            
        # Check if the object has a user field directly
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        # Otherwise, assume the object is the user
        return obj == request.user


class IsDoctorOwnerOrAdmin(permissions.BasePermission):
    """
    Permission to only allow doctor owners of an object or admins to view or edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow administrators
        if request.user.is_staff or request.user.role == 'admin':
            return True
            
        # Check if user is a doctor
        if request.user.role != 'doctor':
            return False
            
        # Check if the object has a doctor field directly
        if hasattr(obj, 'doctor'):
            # Check if the doctor is the user's doctor profile
            if hasattr(request.user, 'doctor_profile'):
                return obj.doctor == request.user.doctor_profile
            return False
            
        # If the object is a doctor profile
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        return False


class IsPatientOrProvider(permissions.BasePermission):
    """
    Permission to only allow the patient or their provider to access their data.
    """
    def has_object_permission(self, request, view, obj):
        # Admins and staff can access anything
        if request.user.is_staff or request.user.role == 'admin':
            return True
            
        # Get the patient from the object
        patient = None
        if hasattr(obj, 'patient'):
            patient = obj.patient
        
        # If user is the patient
        if hasattr(request.user, 'patient_profile') and patient == request.user.patient_profile:
            return True
            
        # If user is the provider
        if hasattr(obj, 'provider') and hasattr(request.user, 'doctor_profile'):
            return obj.provider == request.user.doctor_profile
            
        # If user is a doctor and they're the patient's primary doctor
        if (request.user.role == 'doctor' and hasattr(request.user, 'doctor_profile') 
                and patient and patient.primary_doctor == request.user.doctor_profile):
            return True
            
        return False


class IsProvider(permissions.BasePermission):
    """
    Permission to only allow providers (doctors and staff).
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['doctor', 'staff', 'admin']


class IsPatientOrProviderOrStaff(permissions.BasePermission):
    """
    Permission to allow patients to access their own data, or providers to access their patients' data,
    or staff to access any data.
    """
    def has_object_permission(self, request, view, obj):
        # Admins and staff can access anything
        if request.user.is_staff or request.user.role in ['admin', 'staff']:
            return True
            
        # Get the patient from the object
        patient = None
        if hasattr(obj, 'patient'):
            patient = obj.patient
            
        # If user is the patient
        if hasattr(request.user, 'patient_profile') and patient == request.user.patient_profile:
            return True
            
        # If user is the provider
        if hasattr(obj, 'doctor') and hasattr(request.user, 'doctor_profile'):
            return obj.doctor == request.user.doctor_profile
            
        return False


class IsPatientOrProviderOrAdmin(permissions.BasePermission):
    """
    Permission to allow patients to access their own data, or providers to access their patients' data,
    or admins to access any data.
    """
    def has_object_permission(self, request, view, obj):
        # Similar to IsPatientOrProviderOrStaff but only for admins, not all staff
        if request.user.is_staff or request.user.role == 'admin':
            return True
            
        # Get the patient from the object
        patient = None
        if hasattr(obj, 'patient'):
            patient = obj.patient
            
        # If user is the patient
        if hasattr(request.user, 'patient_profile') and patient == request.user.patient_profile:
            return True
            
        # If user is the provider
        if hasattr(obj, 'provider') and hasattr(request.user, 'doctor_profile'):
            return obj.provider == request.user.doctor_profile
            
        return False


class IsOwner(permissions.BasePermission):
    """
    Permission to only allow owners of an object.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        return False


class IsThreadParticipant(permissions.BasePermission):
    """
    Permission to only allow participants of a message thread.
    """
    def has_object_permission(self, request, view, obj):
        # For threads
        if hasattr(obj, 'participants'):
            return request.user in obj.participants.all()
            
        # For messages
        if hasattr(obj, 'thread'):
            return request.user in obj.thread.participants.all()
            
        return False
