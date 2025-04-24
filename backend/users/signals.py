"""
Signal handlers for the users app.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import DoctorProfile, PatientProfile, StaffProfile

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Create appropriate profile when a User is created.
    """
    if not created:
        return
        
    # Create profile based on user role
    if instance.role == User.Role.DOCTOR and not hasattr(instance, 'doctor_profile'):
        DoctorProfile.objects.create(user=instance)
    elif instance.role == User.Role.PATIENT and not hasattr(instance, 'patient_profile'):
        PatientProfile.objects.create(user=instance)
    elif instance.role == User.Role.STAFF and not hasattr(instance, 'staff_profile'):
        StaffProfile.objects.create(user=instance)
