"""
URL patterns for the WellSphere project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Only enable working endpoints for now
    path('users/', include('users.urls')),
    
    # Comment out other routes until they're fixed
    # path('medical-records/', include('medical_records.urls')),
    # path('appointments/', include('appointments.urls')),
    # path('messaging/', include('messaging.urls')),
    # path('analytics/', include('analytics.urls')),
    # path('billing/', include('billing.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
