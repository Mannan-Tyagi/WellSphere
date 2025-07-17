"""
Database operations for the appointments app
"""
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from django.conf import settings
import logging
from datetime import timedelta

from .models import Appointment, AppointmentReminder
from users.models import DoctorProfile, PatientProfile, User

logger = logging.getLogger('django')

# Appointment operations
def get_all_appointments(patient_id=None, doctor_id=None, start_date=None, end_date=None, status=None):
    """Get all appointments, with optional filtering"""
    queryset = Appointment.objects.all()
    
    if patient_id:
        queryset = queryset.filter(patient_id=patient_id)
    if doctor_id:
        queryset = queryset.filter(doctor_id=doctor_id)
    if start_date:
        queryset = queryset.filter(start_datetime__gte=start_date)
    if end_date:
        queryset = queryset.filter(end_datetime__lte=end_date)
    if status:
        queryset = queryset.filter(status=status)
        
    return queryset

def get_appointment(appointment_id):
    """Get a specific appointment by ID"""
    return get_object_or_404(Appointment, id=appointment_id)

def create_appointment(appointment_data):
    """Create a new appointment"""
    try:
        with transaction.atomic():
            # Create the appointment
            appointment = Appointment.objects.create(**appointment_data)
            
            # Create automatic reminders
            _create_appointment_reminders(appointment)
            
            logger.info(f"Created appointment for patient: {appointment.patient_id} with doctor: {appointment.doctor_id}")
            return appointment
    except Exception as e:
        logger.error(f"Error creating appointment: {str(e)}")
        raise

def update_appointment(appointment_id, appointment_data):
    """Update an appointment"""
    try:
        with transaction.atomic():
            appointment = get_object_or_404(Appointment, id=appointment_id)
            
            # Check if datetime is being changed
            datetime_changed = False
            if ('start_datetime' in appointment_data and appointment_data['start_datetime'] != appointment.start_datetime) or \
               ('end_datetime' in appointment_data and appointment_data['end_datetime'] != appointment.end_datetime):
                datetime_changed = True
            
            # Update appointment fields
            for key, value in appointment_data.items():
                setattr(appointment, key, value)
            appointment.save()
            
            # If the appointment time changed, update reminders
            if datetime_changed:
                # Delete existing reminders
                AppointmentReminder.objects.filter(appointment=appointment).delete()
                # Create new reminders
                _create_appointment_reminders(appointment)
            
            logger.info(f"Updated appointment: {appointment_id}")
            return appointment
    except Exception as e:
        logger.error(f"Error updating appointment: {str(e)}")
        raise

def delete_appointment(appointment_id):
    """Delete an appointment"""
    try:
        with transaction.atomic():
            appointment = get_object_or_404(Appointment, id=appointment_id)
            
            # Delete associated reminders
            AppointmentReminder.objects.filter(appointment=appointment).delete()
            
            # Delete the appointment
            appointment.delete()
            
            logger.info(f"Deleted appointment: {appointment_id}")
            return True
    except Exception as e:
        logger.error(f"Error deleting appointment: {str(e)}")
        raise

def update_appointment_status(appointment_id, status, status_note=None):
    """Update the status of an appointment"""
    try:
        appointment = get_object_or_404(Appointment, id=appointment_id)
        appointment.status = status
        
        if status_note:
            appointment.status_note = status_note
            
        appointment.save()
        logger.info(f"Updated status of appointment {appointment_id} to {status}")
        return appointment
    except Exception as e:
        logger.error(f"Error updating appointment status: {str(e)}")
        raise

def check_availability(doctor_id, start_datetime, end_datetime):
    """Check if a doctor is available for a given time slot"""
    # Check if there are any overlapping appointments
    existing_appointments = Appointment.objects.filter(
        doctor_id=doctor_id,
        start_datetime__lt=end_datetime,
        end_datetime__gt=start_datetime,
        status__in=['scheduled', 'confirmed']
    ).count()
    
    if existing_appointments > 0:
        return False
    
    # Check if doctor has availability for this time slot
    doctor = get_object_or_404(DoctorProfile, id=doctor_id)
    
    # Get day of week (0 = Monday, 6 = Sunday)
    day_of_week = start_datetime.weekday()
    
    # Get corresponding availability
    from users.models import DoctorAvailability
    availability = DoctorAvailability.objects.filter(
        doctor=doctor,
        day_of_week=day_of_week,
        is_available=True,
        start_time__lte=start_datetime.time(),
        end_time__gte=end_datetime.time()
    ).exists()
    
    if not availability:
        return False
    
    # Check if doctor has time off during this period
    from users.models import DoctorTimeOff
    time_off = DoctorTimeOff.objects.filter(
        doctor=doctor,
        start_datetime__lte=end_datetime,
        end_datetime__gte=start_datetime
    ).exists()
    
    if time_off:
        return False
    
    # If we got here, the doctor is available
    return True

def get_doctor_available_slots(doctor_id, date):
    """Get available appointment slots for a doctor on a specific date"""
    # This would need to be implemented based on your specific business rules
    # For example, you might want to check the doctor's availability for the day,
    # then return 15-minute or 30-minute slots that are not already booked
    pass

# Appointment Reminder operations
def _create_appointment_reminders(appointment):
    """Create automatic reminders for an appointment"""
    # Example: create reminders 1 day and 1 hour before
    AppointmentReminder.objects.create(
        appointment=appointment,
        scheduled_time=appointment.start_datetime - timedelta(days=1),
        reminder_type='email',
        sent=False
    )
    
    AppointmentReminder.objects.create(
        appointment=appointment,
        scheduled_time=appointment.start_datetime - timedelta(hours=1),
        reminder_type='sms',
        sent=False
    )

def get_due_reminders():
    """Get reminders that are due to be sent"""
    now = timezone.now()
    return AppointmentReminder.objects.filter(
        scheduled_time__lte=now,
        sent=False
    )

def mark_reminder_sent(reminder_id):
    """Mark a reminder as sent"""
    reminder = get_object_or_404(AppointmentReminder, id=reminder_id)
    reminder.sent = True
    reminder.sent_time = timezone.now()
    reminder.save()
    return reminder
