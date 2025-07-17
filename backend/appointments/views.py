"""
Views for the appointments app
"""

from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta
import logging

from .serializers import AppointmentSerializer, AppointmentStatusUpdateSerializer
from .permissions import IsPatientOrProviderOrStaff
from . import services

logger = logging.getLogger('django')


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for appointments
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProviderOrStaff]
    
    def get_queryset(self):
        # Get filter parameters
        patient_id = self.request.query_params.get('patient', None)
        doctor_id = self.request.query_params.get('doctor', None)
        status = self.request.query_params.get('status', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        return services.get_all_appointments(
            patient_id=patient_id, 
            doctor_id=doctor_id,
            status=status,
            start_date=start_date,
            end_date=end_date
        )
    
    def get_object(self):
        return services.get_appointment(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            appointment = services.create_appointment(serializer.validated_data)
            return Response(self.get_serializer(appointment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            appointment = services.update_appointment(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(appointment).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_appointment(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['put'], url_path='status')
    def update_status(self, request, pk=None):
        """Update appointment status"""
        appointment = self.get_object()
        serializer = AppointmentStatusUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            status_data = serializer.validated_data['status']
            status_note = serializer.validated_data.get('status_note', None)
            
            appointment = services.update_appointment_status(
                appointment.id, status_data, status_note
            )
            
            return Response(self.get_serializer(appointment).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='availability')
    def check_availability(self, request):
        """Check availability for a doctor"""
        doctor_id = request.query_params.get('doctor', None)
        start_datetime = request.query_params.get('start_datetime', None)
        end_datetime = request.query_params.get('end_datetime', None)
        
        if not doctor_id or not start_datetime or not end_datetime:
            return Response({
                'detail': 'doctor, start_datetime, and end_datetime are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        is_available = services.check_availability(doctor_id, start_datetime, end_datetime)
        return Response({'is_available': is_available})
