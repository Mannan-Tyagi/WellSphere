"""
Database operations for the analytics app
"""
from django.db import connection
from django.utils import timezone
from datetime import timedelta
import logging
from django.db.models import Count, Avg, Sum, F, Q
from django.core.cache import cache

from users.models import User, PatientProfile, DoctorProfile
from medical_records.models import PatientCondition, LabResult, PatientMedication
from appointments.models import Appointment
from billing.models import Invoice, Payment

logger = logging.getLogger('django')

# Constants for cache keys with namespace
CACHE_KEY_PREFIX = 'analytics_'
CACHE_TIMEOUT = 60 * 60  # 1 hour

# Demographics analysis
def get_patient_demographics(cache_timeout=CACHE_TIMEOUT):
    """Get patient demographics statistics"""
    cache_key = f"{CACHE_KEY_PREFIX}patient_demographics"
    cached_result = cache.get(cache_key)
    
    if cached_result:
        return cached_result
    
    try:
        # Get users with patient role
        patients = User.objects.filter(role='patient')
        
        # Get age distribution
        now = timezone.now()
        age_ranges = {
            '0-17': Q(date_of_birth__gt=now - timedelta(days=365.25*18)),
            '18-34': Q(date_of_birth__lte=now - timedelta(days=365.25*18), 
                       date_of_birth__gt=now - timedelta(days=365.25*35)),
            '35-50': Q(date_of_birth__lte=now - timedelta(days=365.25*35), 
                       date_of_birth__gt=now - timedelta(days=365.25*51)),
            '51-65': Q(date_of_birth__lte=now - timedelta(days=365.25*51), 
                       date_of_birth__gt=now - timedelta(days=365.25*66)),
            '65+': Q(date_of_birth__lte=now - timedelta(days=365.25*66))
        }
        
        age_distribution = {}
        for age_range, query in age_ranges.items():
            age_distribution[age_range] = patients.filter(query).count()
        
        # Get gender distribution
        gender_distribution = dict(patients.values_list('gender').annotate(count=Count('id')))
        
        # Get location distribution (by state)
        location_distribution = dict(patients.values_list('state').annotate(count=Count('id')))
        
        result = {
            'total_patients': patients.count(),
            'age_distribution': age_distribution,
            'gender_distribution': gender_distribution,
            'location_distribution': location_distribution
        }
        
        # Cache the result
        cache.set(cache_key, result, cache_timeout)
        
        return result
    except Exception as e:
        logger.error(f"Error getting patient demographics: {str(e)}")
        return None

# Appointments analytics
def get_appointments_summary(start_date=None, end_date=None, doctor_id=None, cache_timeout=CACHE_TIMEOUT):
    """Get appointments summary statistics"""
    # Create cache key based on parameters
    params = f"{start_date}_{end_date}_{doctor_id}"
    cache_key = f"{CACHE_KEY_PREFIX}appointments_summary_{params}"
    cached_result = cache.get(cache_key)
    
    if cached_result:
        return cached_result
    
    try:
        # Filter appointments
        appointments = Appointment.objects.all()
        
        if start_date:
            appointments = appointments.filter(start_datetime__gte=start_date)
        if end_date:
            appointments = appointments.filter(end_datetime__lte=end_date)
        if doctor_id:
            appointments = appointments.filter(doctor_id=doctor_id)
        
        # Get appointment counts by status
        status_counts = dict(appointments.values_list('status').annotate(count=Count('id')))
        
        # Get appointment counts by type
        type_counts = dict(appointments.values_list('appointment_type').annotate(count=Count('id')))
        
        # Get appointment distribution by day of week
        day_of_week_distribution = {}
        for i in range(7):
            day_count = appointments.filter(start_datetime__week_day=(i % 7) + 1).count()
            day_of_week_distribution[i] = day_count
        
        # Get no-show rate
        total_completed = appointments.filter(status__in=['completed', 'no-show']).count()
        no_shows = appointments.filter(status='no-show').count()
        no_show_rate = (no_shows / total_completed) * 100 if total_completed > 0 else 0
        
        result = {
            'total_appointments': appointments.count(),
            'status_distribution': status_counts,
            'type_distribution': type_counts,
            'day_of_week_distribution': day_of_week_distribution,
            'no_show_rate': no_show_rate
        }
        
        # Cache the result
        cache.set(cache_key, result, cache_timeout)
        
        return result
    except Exception as e:
        logger.error(f"Error getting appointments summary: {str(e)}")
        return None

# Conditions analytics
def get_conditions_summary(cache_timeout=CACHE_TIMEOUT):
    """Get medical conditions summary statistics"""
    cache_key = f"{CACHE_KEY_PREFIX}conditions_summary"
    cached_result = cache.get(cache_key)
    
    if cached_result:
        return cached_result
    
    try:
        # Get top conditions
        top_conditions = PatientCondition.objects.values('condition_name').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Get chronic vs acute distribution
        chronic_count = PatientCondition.objects.filter(is_chronic=True).count()
        acute_count = PatientCondition.objects.filter(is_chronic=False).count()
        
        # Get severity distribution
        severity_distribution = dict(
            PatientCondition.objects.values_list('severity').annotate(count=Count('id'))
        )
        
        result = {
            'total_conditions': PatientCondition.objects.count(),
            'top_conditions': list(top_conditions),
            'chronic_acute_distribution': {
                'chronic': chronic_count,
                'acute': acute_count
            },
            'severity_distribution': severity_distribution
        }
        
        # Cache the result
        cache.set(cache_key, result, cache_timeout)
        
        return result
    except Exception as e:
        logger.error(f"Error getting conditions summary: {str(e)}")
        return None

# Revenue analytics
def get_revenue_summary(start_date=None, end_date=None, doctor_id=None, cache_timeout=CACHE_TIMEOUT):
    """Get revenue summary statistics"""
    # Create cache key based on parameters
    params = f"{start_date}_{end_date}_{doctor_id}"
    cache_key = f"{CACHE_KEY_PREFIX}revenue_summary_{params}"
    cached_result = cache.get(cache_key)
    
    if cached_result:
        return cached_result
    
    try:
        # Filter invoices
        invoices = Invoice.objects.all()
        
        if start_date:
            invoices = invoices.filter(date__gte=start_date)
        if end_date:
            invoices = invoices.filter(date__lte=end_date)
        if doctor_id:
            invoices = invoices.filter(provider_id=doctor_id)
        
        # Get total billed amount
        total_billed = invoices.aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Get total paid amount
        total_paid = Payment.objects.filter(invoice__in=invoices).aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Get revenue by service type
        revenue_by_service = dict(
            invoices.values_list('service_type').annotate(total=Sum('total_amount'))
        )
        
        # Calculate collection rate
        collection_rate = (total_paid / total_billed) * 100 if total_billed > 0 else 0
        
        # Get average invoice amount
        avg_invoice = invoices.aggregate(avg=Avg('total_amount'))['avg'] or 0
        
        result = {
            'total_invoices': invoices.count(),
            'total_billed': total_billed,
            'total_paid': total_paid,
            'collection_rate': collection_rate,
            'average_invoice': avg_invoice,
            'revenue_by_service': revenue_by_service
        }
        
        # Cache the result
        cache.set(cache_key, result, cache_timeout)
        
        return result
    except Exception as e:
        logger.error(f"Error getting revenue summary: {str(e)}")
        return None

# Performance analytics
def get_provider_performance(start_date=None, end_date=None, doctor_id=None, cache_timeout=CACHE_TIMEOUT):
    """Get provider performance statistics"""
    # Create cache key based on parameters
    params = f"{start_date}_{end_date}_{doctor_id}"
    cache_key = f"{CACHE_KEY_PREFIX}provider_performance_{params}"
    cached_result = cache.get(cache_key)
    
    if cached_result:
        return cached_result
    
    try:
        # Filter appointments
        appointments = Appointment.objects.all()
        
        if start_date:
            appointments = appointments.filter(start_datetime__gte=start_date)
        if end_date:
            appointments = appointments.filter(end_datetime__lte=end_date)
        if doctor_id:
            appointments = appointments.filter(doctor_id=doctor_id)
        
        # Group by doctor
        doctor_stats = appointments.values('doctor').annotate(
            total_appointments=Count('id'),
            completed_appointments=Count('id', filter=Q(status='completed')),
            no_shows=Count('id', filter=Q(status='no-show'))
        )
        
        # Enhance with doctor information
        for stat in doctor_stats:
            doctor = DoctorProfile.objects.select_related('user').get(id=stat['doctor'])
            stat['doctor_name'] = f"{doctor.user.first_name} {doctor.user.last_name}"
            stat['specialty'] = doctor.specialty
            stat['completion_rate'] = (stat['completed_appointments'] / stat['total_appointments']) * 100 if stat['total_appointments'] > 0 else 0
            
        result = {
            'provider_stats': list(doctor_stats)
        }
        
        # Cache the result
        cache.set(cache_key, result, cache_timeout)
        
        return result
    except Exception as e:
        logger.error(f"Error getting provider performance: {str(e)}")
        return None

# Raw SQL query for custom analytics
def execute_custom_analytics_query(query, params=None):
    """Execute a custom SQL query for analytics"""
    try:
        with connection.cursor() as cursor:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            return results
    except Exception as e:
        logger.error(f"Error executing custom analytics query: {str(e)}")
        return None

# Invalidate cache
def invalidate_analytics_cache():
    """Invalidate all analytics cache keys"""
    cache.delete_pattern(f"{CACHE_KEY_PREFIX}*")
    return True
