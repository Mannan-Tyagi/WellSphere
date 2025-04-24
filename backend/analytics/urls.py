"""
URL Configuration for the analytics app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardMetricViewSet, MetricValueViewSet,
    AIInsightViewSet, ReportTemplateViewSet, ReportViewSet
)

# Set up the router
router = DefaultRouter()
router.register(r'metrics', DashboardMetricViewSet)
router.register(r'values', MetricValueViewSet)
router.register(r'insights', AIInsightViewSet)
router.register(r'templates', ReportTemplateViewSet)
router.register(r'reports', ReportViewSet)

# URL patterns
urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
]
