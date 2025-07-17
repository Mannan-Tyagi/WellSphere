"""
Serializers for the analytics app
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from users.serializers import UserSerializer, DoctorProfileSerializer, PatientProfileSerializer
from .models import (
    DashboardMetric, MetricValue, AIInsight,
    ReportTemplate, Report
)


class DashboardMetricSerializer(serializers.ModelSerializer):
    """
    Serializer for dashboard metrics.
    """
    metric_type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = DashboardMetric
        fields = [
            'id', 'name', 'description', 'metric_type',
            'metric_type_display', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'metric_type_display', 'created_at', 'updated_at']
    
    def get_metric_type_display(self, obj):
        return obj.get_metric_type_display()


class MetricValueSerializer(serializers.ModelSerializer):
    """
    Serializer for metric values.
    """
    metric_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    time_scope_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MetricValue
        fields = [
            'id', 'metric', 'metric_name', 'value', 'timestamp',
            'time_scope', 'time_scope_display', 'doctor', 'doctor_name',
            'reference_id', 'reference_type', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'metric_name', 'doctor_name', 
                           'time_scope_display', 'created_at']
    
    def get_metric_name(self, obj):
        return obj.metric.name
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.user.get_full_name()
        return None
    
    def get_time_scope_display(self, obj):
        return obj.get_time_scope_display()


class AIInsightSerializer(serializers.ModelSerializer):
    """
    Serializer for AI insights.
    """
    doctor_name = serializers.SerializerMethodField()
    related_patient_name = serializers.SerializerMethodField()
    insight_type_display = serializers.SerializerMethodField()
    priority_display = serializers.SerializerMethodField()
    
    class Meta:
        model = AIInsight
        fields = [
            'id', 'doctor', 'doctor_name', 'title', 'description',
            'insight_type', 'insight_type_display', 'priority', 'priority_display',
            'confidence_score', 'action_taken', 'action_notes', 'action_taken_at',
            'related_patient', 'related_patient_name', 'reference_data',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'doctor_name', 'related_patient_name',
                           'insight_type_display', 'priority_display',
                           'created_at', 'updated_at']
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.user.get_full_name()
        return None
    
    def get_related_patient_name(self, obj):
        if obj.related_patient:
            return obj.related_patient.user.get_full_name()
        return None
    
    def get_insight_type_display(self, obj):
        return obj.get_insight_type_display()
    
    def get_priority_display(self, obj):
        return obj.get_priority_display()


class ReportTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for report templates.
    """
    metrics = DashboardMetricSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()
    scope_display = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportTemplate
        fields = [
            'id', 'name', 'description', 'scope', 'scope_display',
            'metrics', 'config', 'is_system', 'created_by',
            'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by_name', 'scope_display',
                           'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name()
        return None
    
    def get_scope_display(self, obj):
        return obj.get_scope_display()


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer for reports.
    """
    template_name = serializers.SerializerMethodField()
    generated_for_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id', 'title', 'template', 'template_name', 'parameters',
            'result', 'status', 'status_display', 'error_message',
            'file_path', 'file_type', 'file_size', 'generated_for',
            'generated_for_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'template_name', 'generated_for_name',
                           'status_display', 'created_at', 'updated_at']
    
    def get_template_name(self, obj):
        if obj.template:
            return obj.template.name
        return None
    
    def get_generated_for_name(self, obj):
        return obj.generated_for.get_full_name()
    
    def get_status_display(self, obj):
        return obj.get_status_display()
