"""
Views for the analytics app
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from datetime import timedelta
import logging

from .permissions import IsAdmin, IsDoctor
from . import services

logger = logging.getLogger('django')


class PatientDemographicsView(generics.RetrieveAPIView):
    """
    View to get patient demographics statistics
    """
    permission_classes = [permissions.IsAuthenticated, IsDoctor]
    
    def get(self, request, *args, **kwargs):
        # Get cache timeout parameter (default to 1 hour)
        cache_timeout = int(request.query_params.get('cache_timeout', 3600))
        
        demographics = services.get_patient_demographics(cache_timeout)
        if demographics:
            return Response(demographics)
        return Response(
            {'detail': 'Failed to retrieve patient demographics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class AppointmentsSummaryView(generics.RetrieveAPIView):
    """
    View to get appointments summary statistics
    """
    permission_classes = [permissions.IsAuthenticated, IsDoctor]
    
    def get(self, request, *args, **kwargs):
        # Get filter parameters
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        doctor_id = request.query_params.get('doctor', None)
        cache_timeout = int(request.query_params.get('cache_timeout', 3600))
        
        # If doctor is not specified and user is a doctor, use their ID
        if not doctor_id and request.user.role == 'doctor':
            doctor_id = request.user.doctor_profile.id
        
        summary = services.get_appointments_summary(
            start_date, end_date, doctor_id, cache_timeout
        )
        
        if summary:
            return Response(summary)
        return Response(
            {'detail': 'Failed to retrieve appointments summary'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ConditionsSummaryView(generics.RetrieveAPIView):
    """
    View to get medical conditions summary statistics
    """
    permission_classes = [permissions.IsAuthenticated, IsDoctor]
    
    def get(self, request, *args, **kwargs):
        cache_timeout = int(request.query_params.get('cache_timeout', 3600))
        
        summary = services.get_conditions_summary(cache_timeout)
        if summary:
            return Response(summary)
        return Response(
            {'detail': 'Failed to retrieve conditions summary'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class RevenueSummaryView(generics.RetrieveAPIView):
    """
    View to get revenue summary statistics
    """
    permission_classes = [permissions.IsAuthenticated, IsDoctor | IsAdmin]
    
    def get(self, request, *args, **kwargs):
        # Get filter parameters
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        doctor_id = request.query_params.get('doctor', None)
        cache_timeout = int(request.query_params.get('cache_timeout', 3600))
        
        # If doctor is not specified and user is a doctor, use their ID
        if not doctor_id and request.user.role == 'doctor':
            doctor_id = request.user.doctor_profile.id
        
        summary = services.get_revenue_summary(
            start_date, end_date, doctor_id, cache_timeout
        )
        
        if summary:
            return Response(summary)
        return Response(
            {'detail': 'Failed to retrieve revenue summary'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def invalidate_cache(request):
    """
    Invalidate analytics cache
    """
    services.invalidate_analytics_cache()
    return Response({'status': 'cache invalidated'})