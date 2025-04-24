"""
URL Configuration for the appointments app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AppointmentTypeViewSet, AppointmentViewSet,
    AppointmentNoteViewSet, AppointmentReminderViewSet,
    RecurringAppointmentPatternViewSet
)

# Set up the router
router = DefaultRouter()
router.register(r'types', AppointmentTypeViewSet)
router.register(r'', AppointmentViewSet)
router.register(r'recurring-patterns', RecurringAppointmentPatternViewSet)

# URL patterns
urlpatterns = [
    # Appointment notes
    path('<uuid:appointment_id>/notes/', AppointmentNoteViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='appointment-notes-list'),
    path('<uuid:appointment_id>/notes/<uuid:pk>/', AppointmentNoteViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='appointment-notes-detail'),
    
    # Appointment reminders
    path('<uuid:appointment_id>/reminders/', AppointmentReminderViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='appointment-reminders-list'),
    path('<uuid:appointment_id>/reminders/<uuid:pk>/', AppointmentReminderViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='appointment-reminders-detail'),
    
    # Include the router URLs
    path('', include(router.urls)),
]
