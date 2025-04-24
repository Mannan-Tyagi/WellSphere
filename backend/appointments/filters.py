"""
Custom filters for the appointments app
"""

import django_filters
from django.db.models import Q
from django.utils import timezone
from .models import Appointment


class AppointmentFilter(django_filters.FilterSet):
    """
    Filter for appointments with additional filtering options.
    """
    patient_id = django_filters.UUIDFilter(field_name='patient__id')
    doctor_id = django_filters.UUIDFilter(field_name='doctor__id')
    patient_name = django_filters.CharFilter(method='filter_by_patient_name')
    doctor_name = django_filters.CharFilter(method='filter_by_doctor_name')
    start_date = django_filters.DateFilter(field_name='start_time', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='start_time', lookup_expr='lte')
    time_frame = django_filters.ChoiceFilter(
        choices=[
            ('past', 'Past'),
            ('upcoming', 'Upcoming'),
            ('today', 'Today'),
            ('week', 'This Week'),
            ('month', 'This Month'),
        ],
        method='filter_by_time_frame'
    )
    status = django_filters.MultipleChoiceFilter(
        choices=Appointment.Status.choices
    )
    location_type = django_filters.MultipleChoiceFilter(
        choices=Appointment.LocationType.choices
    )
    
    class Meta:
        model = Appointment
        fields = [
            'patient_id', 'doctor_id', 'appointment_type', 'status', 
            'location_type', 'start_date', 'end_date', 'time_frame',
            'follow_up_required', 'is_recurring'
        ]
    
    def filter_by_patient_name(self, queryset, name, value):
        """Filter appointments by patient name."""
        return queryset.filter(
            Q(patient__user__first_name__icontains=value) | 
            Q(patient__user__last_name__icontains=value)
        )
    
    def filter_by_doctor_name(self, queryset, name, value):
        """Filter appointments by doctor name."""
        return queryset.filter(
            Q(doctor__user__first_name__icontains=value) | 
            Q(doctor__user__last_name__icontains=value)
        )
    
    def filter_by_time_frame(self, queryset, name, value):
        """Filter appointments by predefined time frames."""
        now = timezone.now()
        
        if value == 'past':
            return queryset.filter(end_time__lt=now)
        elif value == 'upcoming':
            return queryset.filter(start_time__gt=now)
        elif value == 'today':
            today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            today_end = today_start.replace(hour=23, minute=59, second=59)
            return queryset.filter(start_time__range=(today_start, today_end))
        elif value == 'week':
            # Get start and end of current week (assuming week starts on Monday)
            import datetime
            today = now.date()
            start_of_week = today - datetime.timedelta(days=today.weekday())
            end_of_week = start_of_week + datetime.timedelta(days=6)
            return queryset.filter(
                start_time__date__gte=start_of_week,
                start_time__date__lte=end_of_week
            )
        elif value == 'month':
            # Get start and end of current month
            start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if now.month == 12:
                end_of_month = start_of_month.replace(year=now.year+1, month=1) - datetime.timedelta(days=1)
            else:
                end_of_month = start_of_month.replace(month=now.month+1) - datetime.timedelta(days=1)
            end_of_month = end_of_month.replace(hour=23, minute=59, second=59)
            return queryset.filter(start_time__range=(start_of_month, end_of_month))
        
        return queryset
