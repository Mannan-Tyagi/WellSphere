"""
URL Configuration for the messaging app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ConversationViewSet, MessageViewSet,
    NotificationViewSet, NotificationPreferenceViewSet
)

# Set up the router
router = DefaultRouter()
router.register(r'conversations', ConversationViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'preferences', NotificationPreferenceViewSet)

# URL patterns
urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
]
