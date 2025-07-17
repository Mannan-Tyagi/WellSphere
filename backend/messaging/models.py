"""
Models for the messaging app
"""

import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User


class Conversation(models.Model):
    """
    Represents a messaging conversation (thread) between users.
    """
    class Type(models.TextChoices):
        ONE_TO_ONE = 'one_to_one', _('One-to-One')
        GROUP = 'group', _('Group')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.ONE_TO_ONE
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_conversations'
    )
    is_encrypted = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['type']),
        ]

    def __str__(self):
        if self.title:
            return self.title
        participants = self.participants.all()
        if participants.count() > 0:
            participant_names = ", ".join([participant.user.get_full_name() for participant in participants[:3]])
            if participants.count() > 3:
                participant_names += f" and {participants.count() - 3} others"
            return participant_names
        return f"Conversation {self.id}"


class ConversationParticipant(models.Model):
    """
    Represents a participant in a conversation.
    """
    class Role(models.TextChoices):
        OWNER = 'owner', _('Owner')
        ADMIN = 'admin', _('Admin')
        MEMBER = 'member', _('Member')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='participants'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations'
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    last_read_at = models.DateTimeField(blank=True, null=True)
    muted_until = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('conversation', 'user')
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['conversation']),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} in {self.conversation}"


class Message(models.Model):
    """
    Represents a message in a conversation.
    """
    class MessageType(models.TextChoices):
        TEXT = 'text', _('Text')
        IMAGE = 'image', _('Image')
        DOCUMENT = 'document', _('Document')
        VIDEO = 'video', _('Video')
        AUDIO = 'audio', _('Audio')
        SYSTEM = 'system', _('System')
        APPOINTMENT = 'appointment', _('Appointment')
        PRESCRIPTION = 'prescription', _('Prescription')

    class Priority(models.TextChoices):
        NORMAL = 'normal', _('Normal')
        URGENT = 'urgent', _('Urgent')
        CRITICAL = 'critical', _('Critical')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    message_type = models.CharField(
        max_length=20,
        choices=MessageType.choices,
        default=MessageType.TEXT
    )
    content = models.TextField(blank=True, null=True)
    media_url = models.CharField(max_length=255, blank=True, null=True)
    media_type = models.CharField(max_length=50, blank=True, null=True)
    media_size = models.IntegerField(blank=True, null=True)
    is_encrypted = models.BooleanField(default=True)
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.NORMAL
    )
    replied_to_message = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replies'
    )
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    sent_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['conversation']),
            models.Index(fields=['sender']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"Message from {self.sender.get_full_name()} in {self.conversation}"


class MessageDeliveryStatus(models.Model):
    """
    Represents the delivery status of a message to a recipient.
    """
    class Status(models.TextChoices):
        SENT = 'sent', _('Sent')
        DELIVERED = 'delivered', _('Delivered')
        READ = 'read', _('Read')
        FAILED = 'failed', _('Failed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='delivery_statuses'
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='message_delivery_statuses'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SENT
    )
    delivered_at = models.DateTimeField(blank=True, null=True)
    read_at = models.DateTimeField(blank=True, null=True)
    error_message = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('message', 'recipient')
        indexes = [
            models.Index(fields=['message']),
            models.Index(fields=['recipient']),
        ]

    def __str__(self):
        return f"Message to {self.recipient.get_full_name()} - {self.get_status_display()}"


class MessageAttachment(models.Model):
    """
    Represents a file attachment to a message.
    """
    class StorageProvider(models.TextChoices):
        LOCAL = 'local', _('Local Storage')
        S3 = 's3', _('Amazon S3')
        AZURE = 'azure', _('Azure Blob Storage')
        GCP = 'gcp', _('Google Cloud Storage')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    file_size = models.IntegerField()
    file_path = models.CharField(max_length=255)
    storage_provider = models.CharField(
        max_length=20,
        choices=StorageProvider.choices,
        default=StorageProvider.LOCAL
    )
    is_encrypted = models.BooleanField(default=True)
    thumbnail_path = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['message']),
        ]

    def __str__(self):
        return f"Attachment {self.file_name} for message {self.message.id}"


class Notification(models.Model):
    """
    Represents a notification sent to a user.
    """
    class Type(models.TextChoices):
        MESSAGE = 'message', _('Message')
        APPOINTMENT = 'appointment', _('Appointment')
        REMINDER = 'reminder', _('Reminder')
        LAB_RESULT = 'lab_result', _('Lab Result')
        PRESCRIPTION = 'prescription', _('Prescription')
        SYSTEM = 'system', _('System')
        TASK = 'task', _('Task')

    class Priority(models.TextChoices):
        LOW = 'low', _('Low')
        NORMAL = 'normal', _('Normal')
        HIGH = 'high', _('High')
        URGENT = 'urgent', _('Urgent')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(
        max_length=20,
        choices=Type.choices
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    action_url = models.CharField(max_length=255, blank=True, null=True)
    related_item_id = models.CharField(max_length=36, blank=True, null=True)
    related_item_type = models.CharField(max_length=50, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.NORMAL
    )
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['is_read']),
            models.Index(fields=['type']),
            models.Index(fields=['related_item_type', 'related_item_id']),
        ]

    def __str__(self):
        return f"Notification for {self.user.get_full_name()}: {self.title}"


class NotificationPreference(models.Model):
    """
    Represents a user's notification preferences.
    """
    class NotificationType(models.TextChoices):
        MESSAGE = 'message', _('Message')
        APPOINTMENT = 'appointment', _('Appointment')
        REMINDER = 'reminder', _('Reminder')
        LAB_RESULT = 'lab_result', _('Lab Result')
        PRESCRIPTION = 'prescription', _('Prescription')
        SYSTEM = 'system', _('System')
        TASK = 'task', _('Task')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices
    )
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    in_app_enabled = models.BooleanField(default=True)
    quiet_hours_start = models.TimeField(blank=True, null=True)
    quiet_hours_end = models.TimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'notification_type')

    def __str__(self):
        return f"{self.user.get_full_name()}'s preferences for {self.get_notification_type_display()}"
