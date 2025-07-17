"""
Serializers for User-related models
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .models import DoctorProfile, PatientProfile, StaffProfile, DoctorAvailability, DoctorTimeOff
from .validators import validate_phone_number, validate_date_of_birth

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login',
            'phone', 'profile_image', 'date_of_birth', 'gender',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country',
            'role', 'email_verified', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'email_verified', 'is_active']
        extra_kwargs = {
            'phone': {'validators': [validate_phone_number]},
            'date_of_birth': {'validators': [validate_date_of_birth]},
        }


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'role', 'phone', 'date_of_birth', 'gender'
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'validators': [validate_phone_number]},
            'date_of_birth': {'validators': [validate_date_of_birth]},
        }
        
    def validate(self, data):
        # Validate that passwords match
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": _("Passwords don't match.")})
        return data
        
    def create(self, validated_data):
        # Remove password_confirm from the data
        validated_data.pop('password_confirm')
        
        # Create a new user with the validated data
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
            
        return user


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    current_password = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )
    new_password_confirm = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )

    def validate(self, data):
        # Check that new passwords match
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password_confirm": _("New passwords don't match.")
            })
            
        # Check that current password is correct
        user = self.context['request'].user
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({
                "current_password": _("Current password is incorrect.")
            })
            
        return data


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    """
    Serializer for doctor's availability.
    """
    class Meta:
        model = DoctorAvailability
        fields = [
            'id', 'day_of_week', 'start_time', 'end_time', 'is_available'
        ]


class DoctorTimeOffSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor's time off.
    """
    class Meta:
        model = DoctorTimeOff
        fields = [
            'id', 'start_datetime', 'end_datetime', 'reason'
        ]


class DoctorProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor's profile.
    """
    user = UserSerializer(read_only=True)
    availabilities = DoctorAvailabilitySerializer(many=True, read_only=True)
    time_off = DoctorTimeOffSerializer(many=True, read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user', 'license_number', 'specialty', 'sub_specialty',
            'education', 'biography', 'years_of_experience', 'professional_statement',
            'accepting_new_patients', 'languages_spoken', 'hospital_affiliations',
            'board_certifications', 'availabilities', 'time_off',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class DoctorProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a doctor's profile.
    """
    class Meta:
        model = DoctorProfile
        fields = [
            'license_number', 'specialty', 'sub_specialty',
            'education', 'biography', 'years_of_experience', 'professional_statement',
            'accepting_new_patients', 'languages_spoken', 'hospital_affiliations',
            'board_certifications'
        ]


class PatientProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for patient's profile.
    """
    user = UserSerializer(read_only=True)
    primary_doctor = DoctorProfileSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = [
            'id', 'user', 'mrn', 'primary_doctor', 'blood_type',
            'height_cm', 'weight_kg', 'allergies', 'preferred_pharmacy',
            'emergency_contact_name', 'emergency_contact_relationship',
            'emergency_contact_phone', 'insurance_provider',
            'insurance_policy_number', 'insurance_group_number',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'mrn', 'created_at', 'updated_at']


class PatientProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a patient's profile.
    """
    primary_doctor_id = serializers.UUIDField(
        write_only=True, required=False, allow_null=True
    )
    
    class Meta:
        model = PatientProfile
        fields = [
            'primary_doctor_id', 'blood_type', 'height_cm', 'weight_kg',
            'allergies', 'preferred_pharmacy', 'emergency_contact_name',
            'emergency_contact_relationship', 'emergency_contact_phone',
            'insurance_provider', 'insurance_policy_number', 'insurance_group_number'
        ]
        
    def update(self, instance, validated_data):
        # Handle primary doctor update with ID
        if 'primary_doctor_id' in validated_data:
            doctor_id = validated_data.pop('primary_doctor_id')
            if doctor_id:
                try:
                    doctor = DoctorProfile.objects.get(id=doctor_id)
                    instance.primary_doctor = doctor
                except DoctorProfile.DoesNotExist:
                    raise serializers.ValidationError({"primary_doctor_id": _("Doctor not found.")})
            else:
                instance.primary_doctor = None
        
        # Update the rest of the fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class StaffProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for staff's profile.
    """
    user = UserSerializer(read_only=True)
    supervisor = serializers.SerializerMethodField()
    
    class Meta:
        model = StaffProfile
        fields = [
            'id', 'user', 'staff_type', 'department', 'position',
            'supervisor', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_supervisor(self, obj):
        if obj.supervisor:
            return {
                'id': obj.supervisor.id,
                'name': obj.supervisor.user.get_full_name(),
                'position': obj.supervisor.position
            }
        return None


class StaffProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a staff's profile.
    """
    supervisor_id = serializers.UUIDField(
        write_only=True, required=False, allow_null=True
    )
    
    class Meta:
        model = StaffProfile
        fields = [
            'staff_type', 'department', 'position', 'supervisor_id'
        ]
        
    def update(self, instance, validated_data):
        # Handle supervisor update with ID
        if 'supervisor_id' in validated_data:
            supervisor_id = validated_data.pop('supervisor_id')
            if supervisor_id:
                try:
                    supervisor = StaffProfile.objects.get(id=supervisor_id)
                    # Prevent circular supervision
                    if supervisor.id == instance.id:
                        raise serializers.ValidationError({
                            "supervisor_id": _("Staff member cannot supervise themselves.")
                        })
                    instance.supervisor = supervisor
                except StaffProfile.DoesNotExist:
                    raise serializers.ValidationError({
                        "supervisor_id": _("Staff member not found.")
                    })
            else:
                instance.supervisor = None
        
        # Update the rest of the fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance