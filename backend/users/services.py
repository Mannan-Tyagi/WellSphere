"""
Database operations for the users app
"""
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db import transaction, IntegrityError
from rest_framework.exceptions import ValidationError
import uuid
import logging

from .models import DoctorProfile, PatientProfile, StaffProfile, DoctorAvailability, DoctorTimeOff

User = get_user_model()
logger = logging.getLogger('django')

# User operations
def create_user(user_data):
    """Create a new user"""
    try:
        # Extract password from data
        password = user_data.pop('password')
        
        # Check if email already exists
        email = user_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError({"email": "User with this email already exists."})
        
        # Log what we're about to do
        logger.info(f"Creating new user with email: {email}")
        
        # Create user instance without using transaction initially to isolate issues
        user = User.objects.create_user(**user_data)
        user.set_password(password)
        user.save()
        
        # Log successful user creation
        logger.info(f"Successfully created user with ID: {user.id}, email: {email}")
        
        # Create corresponding profile based on role
        role = user_data.get('role')
        try:
            if role == 'doctor':
                logger.info(f"Creating doctor profile for user: {user.id}")
                DoctorProfile.objects.create(user=user)
            elif role == 'patient':
                logger.info(f"Creating patient profile for user: {user.id}")
                PatientProfile.objects.create(user=user)
            elif role == 'staff':
                logger.info(f"Creating staff profile for user: {user.id}")
                StaffProfile.objects.create(user=user)
            logger.info(f"Successfully created {role} profile for user: {user.id}")
        except IntegrityError as e:
            # Profile creation failed, but user was created
            logger.error(f"Profile creation failed, but user was created: {str(e)}")
            # Don't raise an exception here, we'll return the user anyway
        
        return user
    except ValidationError as e:
        logger.error(f"Validation error creating user: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise ValidationError({"detail": f"Error creating user: {str(e)}"})

def get_user_by_id(user_id):
    """Get user by ID"""
    return get_object_or_404(User, id=user_id)

def get_user_by_email(email):
    """Get user by email"""
    return get_object_or_404(User, email=email)

def update_user(user, user_data):
    """Update user information"""
    try:
        for key, value in user_data.items():
            setattr(user, key, value)
        user.save()
        logger.info(f"Updated user: {user.email}")
        return user
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        raise

def change_password(user, current_password, new_password):
    """Change user password"""
    if not user.check_password(current_password):
        raise ValidationError({"current_password": "Current password is incorrect"})
    
    user.set_password(new_password)
    user.save()
    logger.info(f"Password changed for user: {user.email}")
    return True

# Doctor profile operations
def get_all_doctors():
    """Get all doctor profiles"""
    return DoctorProfile.objects.select_related('user').all()

def get_doctor_profile(doctor_id):
    """Get doctor profile by ID"""
    return get_object_or_404(DoctorProfile, id=doctor_id)

def update_doctor_profile(doctor_profile, profile_data):
    """Update doctor profile"""
    try:
        for key, value in profile_data.items():
            setattr(doctor_profile, key, value)
        doctor_profile.save()
        logger.info(f"Updated doctor profile: {doctor_profile.id}")
        return doctor_profile
    except Exception as e:
        logger.error(f"Error updating doctor profile: {str(e)}")
        raise

# Doctor availability operations
def get_doctor_availabilities(doctor_id):
    """Get all availabilities for a doctor"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    return DoctorAvailability.objects.filter(doctor=doctor)

def create_doctor_availability(doctor_id, availability_data):
    """Create a new doctor availability"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    availability = DoctorAvailability.objects.create(doctor=doctor, **availability_data)
    logger.info(f"Created availability for doctor: {doctor_id}")
    return availability

def update_doctor_availability(doctor_id, availability_id, availability_data):
    """Update a doctor availability"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    availability = get_object_or_404(DoctorAvailability, id=availability_id, doctor=doctor)
    
    for key, value in availability_data.items():
        setattr(availability, key, value)
    availability.save()
    
    logger.info(f"Updated availability {availability_id} for doctor: {doctor_id}")
    return availability

def delete_doctor_availability(doctor_id, availability_id):
    """Delete a doctor availability"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    availability = get_object_or_404(DoctorAvailability, id=availability_id, doctor=doctor)
    availability.delete()
    logger.info(f"Deleted availability {availability_id} for doctor: {doctor_id}")
    return True

# Doctor time off operations
def get_doctor_time_offs(doctor_id):
    """Get all time offs for a doctor"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    return DoctorTimeOff.objects.filter(doctor=doctor)

def create_doctor_time_off(doctor_id, time_off_data):
    """Create a new doctor time off"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    time_off = DoctorTimeOff.objects.create(doctor=doctor, **time_off_data)
    logger.info(f"Created time off for doctor: {doctor_id}")
    return time_off

def update_doctor_time_off(doctor_id, time_off_id, time_off_data):
    """Update a doctor time off"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    time_off = get_object_or_404(DoctorTimeOff, id=time_off_id, doctor=doctor)
    
    for key, value in time_off_data.items():
        setattr(time_off, key, value)
    time_off.save()
    
    logger.info(f"Updated time off {time_off_id} for doctor: {doctor_id}")
    return time_off

def delete_doctor_time_off(doctor_id, time_off_id):
    """Delete a doctor time off"""
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    time_off = get_object_or_404(DoctorTimeOff, id=time_off_id, doctor=doctor)
    time_off.delete()
    logger.info(f"Deleted time off {time_off_id} for doctor: {doctor_id}")
    return True

# Patient profile operations
def get_all_patients():
    """Get all patient profiles"""
    return PatientProfile.objects.select_related('user').all()

def get_patient_profile(patient_id):
    """Get patient profile by ID"""
    return get_object_or_404(PatientProfile, id=patient_id)

def update_patient_profile(patient_profile, profile_data):
    """Update patient profile"""
    try:
        for key, value in profile_data.items():
            setattr(patient_profile, key, value)
        patient_profile.save()
        logger.info(f"Updated patient profile: {patient_profile.id}")
        return patient_profile
    except Exception as e:
        logger.error(f"Error updating patient profile: {str(e)}")
        raise

# Staff profile operations
def get_all_staff():
    """Get all staff profiles"""
    return StaffProfile.objects.select_related('user').all()

def get_staff_profile(staff_id):
    """Get staff profile by ID"""
    return get_object_or_404(StaffProfile, id=staff_id)

def update_staff_profile(staff_profile, profile_data):
    """Update staff profile"""
    try:
        for key, value in profile_data.items():
            setattr(staff_profile, key, value)
        staff_profile.save()
        logger.info(f"Updated staff profile: {staff_profile.id}")
        return staff_profile
    except Exception as e:
        logger.error(f"Error updating staff profile: {str(e)}")
        raise
