"""
Serializers for the appointments app
"""

from rest_framework import serializers
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import DoctorProfile, PatientProfile
from users.serializers import DoctorProfileSerializer, PatientProfileSerializer
from .models import (
    AppointmentType, Appointment, RecurringAppointmentPattern,
    AppointmentNote, AppointmentReminder
)


class AppointmentTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for appointment types.
    """
    class Meta:
        model = AppointmentType
        fields = [
            'id', 'name', 'description', 'default_duration',
            'color', 'requires_approval', 'virtual_allowed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RecurringAppointmentPatternSerializer(serializers.ModelSerializer):
    """
    Serializer for recurring appointment patterns.
    """
    class Meta:
        model = RecurringAppointmentPattern
        fields = [
            'id', 'frequency', 'days_of_week', 'day_of_month',
            'interval_count', 'start_date', 'end_date',
            'end_after_occurrences', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for appointment notes.
    """
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AppointmentNote
        fields = [
            'id', 'appointment', 'author', 'author_name',
            'note_type', 'note_text', 'is_private',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'author_name']
    
    def get_author_name(self, obj):
        return obj.author.get_full_name()


class AppointmentReminderSerializer(serializers.ModelSerializer):
    """
    Serializer for appointment reminders.
    """
    class Meta:
        model = AppointmentReminder
        fields = [
            'id', 'appointment', 'reminder_type', 'reminder_time',
            'status', 'custom_message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing appointments.
    """
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    appointment_type_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    location_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'appointment_type', 'appointment_type_name', 
            'start_time', 'end_time', 'duration',
            'status', 'status_display', 'location_type', 'location_display',
            'purpose', 'is_recurring', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    
    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name()
    
    def get_appointment_type_name(self, obj):
        return obj.appointment_type.name
    
    def get_status_display(self, obj):
        return obj.get_status_display()
    
    def get_location_display(self, obj):
        return obj.get_location_type_display()


class AppointmentDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for appointments.
    """
    patient = PatientProfileSerializer(read_only=True)
    doctor = DoctorProfileSerializer(read_only=True)
    appointment_type = AppointmentTypeSerializer(read_only=True)
    recurring_pattern = RecurringAppointmentPatternSerializer(read_only=True)
    notes = serializers.SerializerMethodField()
    reminders = AppointmentReminderSerializer(many=True, read_only=True)
    cancelled_by_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'appointment_type',
            'start_time', 'end_time', 'duration', 'status',
            'cancellation_reason', 'cancelled_by', 'cancelled_by_name',
            'location_type', 'location_details', 'purpose',
            'preparation_instructions', 'follow_up_required',
            'follow_up_interval', 'is_recurring', 'recurring_pattern',
            'created_by', 'created_by_name', 'created_at', 'updated_at',
            'notes', 'reminders'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'cancelled_by_name', 'created_by_name']
    
    def get_notes(self, obj):
        # Only return non-private notes or notes authored by the current user
        user = self.context['request'].user
        notes = obj.notes.filter(is_private=False) | obj.notes.filter(author=user)
        return AppointmentNoteSerializer(notes, many=True).data
    
    def get_cancelled_by_name(self, obj):
        if obj.cancelled_by:
            return obj.cancelled_by.get_full_name()
        return None
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name()
        return None


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating appointments.
    """
    patient_id = serializers.UUIDField(write_only=True)
    doctor_id = serializers.UUIDField(write_only=True)
    appointment_type_id = serializers.UUIDField(write_only=True)
    recurring_pattern_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Appointment
        fields = [
            'patient_id', 'doctor_id', 'appointment_type_id',
            'start_time', 'end_time', 'duration', 'status',
            'location_type', 'location_details', 'purpose',
            'preparation_instructions', 'follow_up_required',
            'follow_up_interval', 'is_recurring', 'recurring_pattern_id',
        ]
    
    def validate(self, data):
        # Validate that start_time is before end_time
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError({
                "end_time": _("End time must be after start time.")
            })
        
        # Validate that appointment is not in the past
        if data['start_time'] < timezone.now():
            raise serializers.ValidationError({
                "start_time": _("Cannot schedule appointments in the past.")
            })
        
        # Validate that duration matches the time difference
        time_diff_minutes = (data['end_time'] - data['start_time']).total_seconds() / 60
        if data['duration'] != time_diff_minutes:
            raise serializers.ValidationError({
                "duration": _("Duration must match the time difference between start and end times.")
            })
        
        # Check that the doctor exists
        try:
            doctor = DoctorProfile.objects.get(id=data['doctor_id'])
        except DoctorProfile.DoesNotExist:
            raise serializers.ValidationError({
                "doctor_id": _("Doctor not found.")
            })
        
        # Check that the patient exists
        try:
            patient = PatientProfile.objects.get(id=data['patient_id'])
        except PatientProfile.DoesNotExist:
            raise serializers.ValidationError({
                "patient_id": _("Patient not found.")
            })
        
        # Check that the appointment type exists
        try:
            appointment_type = AppointmentType.objects.get(id=data['appointment_type_id'])
        except AppointmentType.DoesNotExist:
            raise serializers.ValidationError({
                "appointment_type_id": _("Appointment type not found.")
            })
        
        # Check for scheduling conflicts for the doctor
        doctor_conflicts = Appointment.objects.filter(
            doctor=doctor,
            status__in=[
                Appointment.Status.PENDING,
                Appointment.Status.CONFIRMED,
                Appointment.Status.CHECKED_IN,
                Appointment.Status.IN_PROGRESS
            ]
        ).filter(
            # Overlapping time ranges
            models.Q(
                start_time__lt=data['end_time'],
                end_time__gt=data['start_time']
            )
        )
        
        # Exclude current appointment if updating
        if self.instance:
            doctor_conflicts = doctor_conflicts.exclude(id=self.instance.id)
        
        if doctor_conflicts.exists():
            raise serializers.ValidationError({
                "doctor_id": _("Doctor has a scheduling conflict during this time.")
            })
        
        # Check for scheduling conflicts for the patient
        patient_conflicts = Appointment.objects.filter(
            patient=patient,
            status__in=[
                Appointment.Status.PENDING,
                Appointment.Status.CONFIRMED,
                Appointment.Status.CHECKED_IN,
                Appointment.Status.IN_PROGRESS
            ]
        ).filter(
            # Overlapping time ranges
            models.Q(
                start_time__lt=data['end_time'],
                end_time__gt=data['start_time']
            )
        )
        
        # Exclude current appointment if updating
        if self.instance:
            patient_conflicts = patient_conflicts.exclude(id=self.instance.id)
        
        if patient_conflicts.exists():
            raise serializers.ValidationError({
                "patient_id": _("Patient has a scheduling conflict during this time.")
            })
        
        # If is_recurring is True, a recurring pattern must be provided
        if data.get('is_recurring', False) and not data.get('recurring_pattern_id'):
            raise serializers.ValidationError({
                "recurring_pattern_id": _("A recurring pattern is required for recurring appointments.")
            })
        
        return data
    
    def create(self, validated_data):
        patient_id = validated_data.pop('patient_id')
        doctor_id = validated_data.pop('doctor_id')
        appointment_type_id = validated_data.pop('appointment_type_id')
        recurring_pattern_id = validated_data.pop('recurring_pattern_id', None)
        
        # Get the related objects
        patient = PatientProfile.objects.get(id=patient_id)
        doctor = DoctorProfile.objects.get(id=doctor_id)
        appointment_type = AppointmentType.objects.get(id=appointment_type_id)
        
        # Get the recurring pattern if provided
        recurring_pattern = None
        if recurring_pattern_id:
            recurring_pattern = RecurringAppointmentPattern.objects.get(id=recurring_pattern_id)
        
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        
        # Create the appointment
        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            appointment_type=appointment_type,
            recurring_pattern=recurring_pattern,
            **validated_data
        )
        
        return appointment


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating appointments.
    """
    class Meta:
        model = Appointment
        fields = [
            'start_time', 'end_time', 'duration', 'status',
            'location_type', 'location_details', 'purpose',
            'preparation_instructions', 'follow_up_required',
            'follow_up_interval'
        ]
    
    def validate(self, data):
        # If start_time or end_time is being updated, perform validation
        if 'start_time' in data or 'end_time' in data:
            start_time = data.get('start_time', self.instance.start_time)
            end_time = data.get('end_time', self.instance.end_time)
            
            # Validate that start_time is before end_time
            if start_time >= end_time:
                raise serializers.ValidationError({
                    "end_time": _("End time must be after start time.")
                })
            
            # Validate that appointment is not in the past
            if start_time < timezone.now():
                raise serializers.ValidationError({
                    "start_time": _("Cannot schedule appointments in the past.")
                })
            
            # Validate duration if provided
            if 'duration' in data:
                time_diff_minutes = (end_time - start_time).total_seconds() / 60
                if data['duration'] != time_diff_minutes:
                    raise serializers.ValidationError({
                        "duration": _("Duration must match the time difference between start and end times.")
                    })
            else:
                # Update duration based on new times
                data['duration'] = (end_time - start_time).total_seconds() / 60
            
            # Check for scheduling conflicts for the doctor
            doctor_conflicts = Appointment.objects.filter(
                doctor=self.instance.doctor,
                status__in=[
                    Appointment.Status.PENDING,
                    Appointment.Status.CONFIRMED,
                    Appointment.Status.CHECKED_IN,
                    Appointment.Status.IN_PROGRESS
                ]
            ).filter(
                # Overlapping time ranges
                models.Q(
                    start_time__lt=end_time,
                    end_time__gt=start_time
                )
            ).exclude(id=self.instance.id)
            
            if doctor_conflicts.exists():
                raise serializers.ValidationError({
                    "start_time": _("Doctor has a scheduling conflict during this time.")
                })
            
            # Check for scheduling conflicts for the patient
            patient_conflicts = Appointment.objects.filter(
                patient=self.instance.patient,
                status__in=[
                    Appointment.Status.PENDING,
                    Appointment.Status.CONFIRMED,
                    Appointment.Status.CHECKED_IN,
                    Appointment.Status.IN_PROGRESS
                ]
            ).filter(
                # Overlapping time ranges
                models.Q(
                    start_time__lt=end_time,
                    end_time__gt=start_time
                )
            ).exclude(id=self.instance.id)
            
            if patient_conflicts.exists():
                raise serializers.ValidationError({
                    "start_time": _("Patient has a scheduling conflict during this time.")
                })
        
        return data


class AppointmentCancellationSerializer(serializers.Serializer):
    """
    Serializer for cancelling appointments.
    """
    cancellation_reason = serializers.CharField(required=True)
    
    def validate(self, data):
        # Make sure the appointment can be cancelled
        appointment = self.context['appointment']
        
        if appointment.status == Appointment.Status.CANCELLED:
            raise serializers.ValidationError({
                "status": _("This appointment is already cancelled.")
            })
        
        if appointment.status == Appointment.Status.COMPLETED:
            raise serializers.ValidationError({
                "status": _("Cannot cancel a completed appointment.")
            })
        
        # Check cancellation timing policy
        # e.g., Can't cancel within 24 hours of appointment
        hours_until_appointment = (appointment.start_time - timezone.now()).total_seconds() / 3600
        min_cancellation_hours = 2  # Example policy
        
        if hours_until_appointment < min_cancellation_hours:
            raise serializers.ValidationError({
                "start_time": _(f"Appointments must be cancelled at least {min_cancellation_hours} hours in advance.")
            })
        
        return data
