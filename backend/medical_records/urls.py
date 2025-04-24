"""
URL Configuration for the medical_records app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientConditionViewSet, PatientMedicationViewSet,
    MedicationRefillRequestViewSet, VitalSignsViewSet,
    LabResultViewSet, MedicalDocumentViewSet,
    ClinicalEncounterViewSet, ClinicalEncounterVersionViewSet
)
from .views_family import (
    FamilyRelationshipViewSet, HealthRecordAccessViewSet, AccessLogViewSet
)

# Set up the router
router = DefaultRouter()
# Add explicit basename for all viewsets to avoid the error
router.register(r'conditions', PatientConditionViewSet, basename='patient-condition')
router.register(r'medications', PatientMedicationViewSet, basename='patient-medication')
router.register(r'refill-requests', MedicationRefillRequestViewSet, basename='medication-refill-request')
router.register(r'vitals', VitalSignsViewSet, basename='vital-signs')
router.register(r'family-relationships', FamilyRelationshipViewSet, basename='family-relationship')
router.register(r'access-grants', HealthRecordAccessViewSet, basename='health-record-access')
router.register(r'access-logs', AccessLogViewSet, basename='access-log')
router.register(r'lab-results', LabResultViewSet, basename='lab-result')
router.register(r'documents', MedicalDocumentViewSet, basename='medical-document')
router.register(r'encounters', ClinicalEncounterViewSet, basename='clinical-encounter')

# URL patterns
urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
]
