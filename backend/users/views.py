"""
Views for user authentication and profile management
"""

from rest_framework import status, generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
import logging

from .serializers import (
    UserSerializer, 
    UserRegisterSerializer, 
    PasswordChangeSerializer,
    DoctorProfileSerializer,
    PatientProfileSerializer,
    StaffProfileSerializer,
    DoctorAvailabilitySerializer,
    DoctorTimeOffSerializer
)
from .permissions import IsOwnerOrAdmin, IsDoctorOwnerOrAdmin
from . import services

User = get_user_model()
logger = logging.getLogger('django')


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain view that records last login and adds role information.
    """
    pass


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user registration and management
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        return self.request.user
    
    @action(methods=['get', 'put', 'patch'], detail=False, url_path='me')
    def me(self, request):
        user = request.user
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = services.update_user(user, serializer.validated_data)
            return Response(self.get_serializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_permissions(self):
        """
        Override to allow anyone to register
        """
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def create(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user_data = serializer.validated_data.copy()
                logger.info(f"Attempting to create user with email: {user_data.get('email')}")
                
                password = user_data.pop('password')
                password_confirm = user_data.pop('password_confirm', None)
                
                user_data['password'] = password
                user = services.create_user(user_data)
                
                logger.info(f"User created successfully with ID: {user.id}")
                
                # Return user ID in the response to confirm creation
                return Response({
                    "message": "User registered successfully",
                    "user_id": str(user.id)
                }, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                logger.error(f"ValidationError in create user view: {e.detail}")
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Unexpected error in create user view: {str(e)}")
                return Response(
                    {"detail": f"Error creating user: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(generics.GenericAPIView):
    """
    View for changing user password
    """
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            
            try:
                services.change_password(request.user, current_password, new_password)
                return Response({'detail': 'Password successfully changed.'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for doctor profile management
    """
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOwnerOrAdmin]
    
    def get_queryset(self):
        return services.get_all_doctors()
    
    def get_object(self):
        return services.get_doctor_profile(self.kwargs['pk'])
    
    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=kwargs.get('partial', False))
        
        if serializer.is_valid():
            profile = services.update_doctor_profile(profile, serializer.validated_data)
            return Response(self.get_serializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for doctor availability management
    """
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOwnerOrAdmin]
    
    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        return services.get_doctor_availabilities(doctor_id)
    
    def create(self, request, *args, **kwargs):
        doctor_id = self.kwargs.get('doctor_id')
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            availability = services.create_doctor_availability(doctor_id, serializer.validated_data)
            return Response(self.get_serializer(availability).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        doctor_id = self.kwargs.get('doctor_id')
        availability_id = self.kwargs.get('pk')
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            availability = services.update_doctor_availability(
                doctor_id, availability_id, serializer.validated_data
            )
            return Response(self.get_serializer(availability).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        doctor_id = self.kwargs.get('doctor_id')
        availability_id = self.kwargs.get('pk')
        
        services.delete_doctor_availability(doctor_id, availability_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class DoctorTimeOffViewSet(viewsets.ModelViewSet):
    """
    ViewSet for doctor time off management
    """
    serializer_class = DoctorTimeOffSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOwnerOrAdmin]
    
    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        return services.get_doctor_time_offs(doctor_id)
    
    def create(self, request, *args, **kwargs):
        doctor_id = self.kwargs.get('doctor_id')
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            time_off = services.create_doctor_time_off(doctor_id, serializer.validated_data)
            return Response(self.get_serializer(time_off).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        doctor_id = self.kwargs.get('doctor_id')
        time_off_id = self.kwargs.get('pk')
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            time_off = services.update_doctor_time_off(
                doctor_id, time_off_id, serializer.validated_data
            )
            return Response(self.get_serializer(time_off).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        doctor_id = self.kwargs.get('doctor_id')
        time_off_id = self.kwargs.get('pk')
        
        services.delete_doctor_time_off(doctor_id, time_off_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PatientProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for patient profile management
    """
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return services.get_all_patients()
    
    def get_object(self):
        return services.get_patient_profile(self.kwargs['pk'])
    
    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=kwargs.get('partial', False))
        
        if serializer.is_valid():
            profile = services.update_patient_profile(profile, serializer.validated_data)
            return Response(self.get_serializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StaffProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for staff profile management
    """
    serializer_class = StaffProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return services.get_all_staff()
    
    def get_object(self):
        return services.get_staff_profile(self.kwargs['pk'])
    
    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=kwargs.get('partial', False))
        
        if serializer.is_valid():
            profile = services.update_staff_profile(profile, serializer.validated_data)
            return Response(self.get_serializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
