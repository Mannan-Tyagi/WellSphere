from rest_framework import serializers
from django.utils import timezone
from .models import (
    Message, MessageAttachment, MessageDeliveryStatus,
    Notification, NotificationPreference, ConversationParticipant
)
from .serializers import UserSerializer


class ConversationSerializer(serializers.ModelSerializer):
    """
    Serializer for conversations.
    """
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'name', 'type', 'type_display', 'last_message',
            'unread_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'type_display', 'last_message',
                           'unread_count', 'created_at', 'updated_at']
    
    def get_last_message(self, obj):
        """Get the last message in the conversation."""
        last_message = Message.objects.filter(
            conversation=obj,
            is_deleted=False
        ).order_by('-sent_at').first()
        
        if last_message:
            return {
                'id': last_message.id,
                'sender_name': last_message.sender.get_full_name(),
                'content': last_message.content if last_message.message_type == 'text' else f"[{last_message.get_message_type_display()}]",
                'sent_at': last_message.sent_at,
                'message_type': last_message.message_type
            }
        return None
    
    def get_unread_count(self, obj):
        """Get unread message count for the current user."""
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user
            participant = ConversationParticipant.objects.filter(
                conversation=obj,
                user=user
            ).first()
            
            if participant and participant.last_read_at:
                return Message.objects.filter(
                    conversation=obj,
                    sent_at__gt=participant.last_read_at,
                    sender__id__ne=user.id
                ).count()
            else:
                # If never read, count all messages except user's own
                return Message.objects.filter(
                    conversation=obj
                ).exclude(sender=user).count()
        return 0
    
    def get_type_display(self, obj):
        return obj.get_type_display()


class MessageAttachmentSerializer(serializers.ModelSerializer):
    """
    Serializer for message attachments.
    """
    storage_provider_display = serializers.SerializerMethodField()
    file_size_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MessageAttachment
        fields = [
            'id', 'message', 'file_name', 'file_type', 'file_size',
            'file_size_display', 'file_path', 'storage_provider',
            'storage_provider_display', 'is_encrypted', 'thumbnail_path',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'storage_provider_display', 
                           'file_size_display', 'created_at', 'updated_at']
    
    def get_storage_provider_display(self, obj):
        return obj.get_storage_provider_display()
    
    def get_file_size_display(self, obj):
        if obj.file_size:
            # Convert bytes to KB, MB as appropriate
            if obj.file_size < 1024:
                return f"{obj.file_size} bytes"
            elif obj.file_size < 1024 * 1024:
                return f"{obj.file_size / 1024:.2f} KB"
            else:
                return f"{obj.file_size / (1024 * 1024):.2f} MB"
        return None


class MessageDeliveryStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for message delivery status.
    """
    recipient_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MessageDeliveryStatus
        fields = [
            'id', 'message', 'recipient', 'recipient_name',
            'status', 'status_display', 'delivered_at', 'read_at',
            'error_message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'recipient_name', 'status_display',
                           'created_at', 'updated_at']
    
    def get_recipient_name(self, obj):
        return obj.recipient.get_full_name()
    
    def get_status_display(self, obj):
        return obj.get_status_display()


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for messages.
    """
    sender = UserSerializer(read_only=True)
    message_type_display = serializers.SerializerMethodField()
    priority_display = serializers.SerializerMethodField()
    attachments = MessageAttachmentSerializer(many=True, read_only=True)
    delivery_statuses = MessageDeliveryStatusSerializer(
        source='delivery_statuses', many=True, read_only=True
    )
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'message_type',
            'message_type_display', 'content', 'media_url', 'media_type',
            'media_size', 'is_encrypted', 'priority', 'priority_display',
            'replied_to_message', 'is_edited', 'edited_at', 'is_deleted',
            'deleted_at', 'sent_at', 'attachments', 'delivery_statuses',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sender', 'message_type_display', 
                           'priority_display', 'is_edited', 'edited_at',
                           'is_deleted', 'deleted_at', 'created_at', 'updated_at']
    
    def get_message_type_display(self, obj):
        return obj.get_message_type_display()
    
    def get_priority_display(self, obj):
        return obj.get_priority_display()
    
    def create(self, validated_data):
        """
        Create a message and create delivery statuses for all participants.
        """
        # Add the sender
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['sender'] = request.user
        
        # Set the sent time if not provided
        if 'sent_at' not in validated_data:
            validated_data['sent_at'] = timezone.now()
        
        # Create the message
        message = super().create(validated_data)
        
        # Create delivery statuses for all participants except the sender
        conversation = message.conversation
        participants = ConversationParticipant.objects.filter(
            conversation=conversation,
            is_active=True
        ).exclude(user=message.sender)
        
        for participant in participants:
            MessageDeliveryStatus.objects.create(
                message=message,
                recipient=participant.user,
                status=MessageDeliveryStatus.Status.SENT
            )
        
        return message


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for notifications.
    """
    user = UserSerializer(read_only=True)
    type_display = serializers.SerializerMethodField()
    priority_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'type_display', 'title', 'message',
            'action_url', 'related_item_id', 'related_item_type',
            'is_read', 'read_at', 'priority', 'priority_display',
            'expires_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'type_display', 'priority_display',
                           'created_at', 'updated_at']
    
    def get_type_display(self, obj):
        return obj.get_type_display()
    
    def get_priority_display(self, obj):
        return obj.get_priority_display()


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for notification preferences.
    """
    user = UserSerializer(read_only=True)
    notification_type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'notification_type', 'notification_type_display',
            'email_enabled', 'sms_enabled', 'push_enabled', 'in_app_enabled',
            'quiet_hours_start', 'quiet_hours_end', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'notification_type_display',
                           'created_at', 'updated_at']
    
    def get_notification_type_display(self, obj):
        return obj.get_notification_type_display()