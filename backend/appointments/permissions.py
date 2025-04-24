from rest_framework import permissions

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
