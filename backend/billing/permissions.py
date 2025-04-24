from rest_framework import permissions

class IsPatientOrProviderOrAdmin(permissions.BasePermission):
    """
    Permission to allow patients to access their own data, or providers to access their patients' data,
    or admins to access any data.
    """
    def has_object_permission(self, request, view, obj):
        # Admins can access anything
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
