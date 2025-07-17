"""
URL patterns for the users app.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet,
    PasswordChangeView,
    DoctorProfileViewSet,
    PatientProfileViewSet,
    StaffProfileViewSet,
    DoctorAvailabilityViewSet,
    DoctorTimeOffViewSet,
    CustomTokenObtainPairView
)

router = DefaultRouter()
router.register(r'doctors', DoctorProfileViewSet, basename='doctor')
router.register(r'patients', PatientProfileViewSet, basename='patient')
router.register(r'staff', StaffProfileViewSet, basename='staff')

urlpatterns = [
    # Authentication
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User management
    path('register/', UserViewSet.as_view({'post': 'create'}), name='user_register'),
    path('me/', UserViewSet.as_view({
        'get': 'me',
        'put': 'me',
        'patch': 'me'
    }), name='user_me'),
    path('password/change/', PasswordChangeView.as_view(), name='password_change'),
    
    # Doctor availability & time off
    path('doctors/<uuid:doctor_id>/availabilities/', 
         DoctorAvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='doctor_availability_list'),
    path('doctors/<uuid:doctor_id>/availabilities/<uuid:pk>/', 
         DoctorAvailabilityViewSet.as_view({'put': 'update', 'delete': 'destroy'}), 
         name='doctor_availability_detail'),
    path('doctors/<uuid:doctor_id>/time-off/', 
         DoctorTimeOffViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='doctor_time_off_list'),
    path('doctors/<uuid:doctor_id>/time-off/<uuid:pk>/', 
         DoctorTimeOffViewSet.as_view({'put': 'update', 'delete': 'destroy'}), 
         name='doctor_time_off_detail'),
]

# Include router URLs
urlpatterns += router.urls
