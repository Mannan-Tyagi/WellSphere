from rest_framework import permissions

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
