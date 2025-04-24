"""
WebSocket consumers for real-time messaging
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Conversation, ConversationParticipant, Message, MessageDeliveryStatus

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for chat messages.
    """
    async def connect(self):
        self.user = self.scope["user"]
        
        # Anonymous users cannot connect
        if self.user.is_anonymous:
            await self.close()
            return
        
        # Get the conversation ID from the URL route
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"
        
        # Check if the user is a participant in the conversation
        if not await self.is_conversation_participant():
            await self.close()
            return
        
        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send user joined message
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user_join",
                "user": self.user.get_full_name(),
                "user_id": str(self.user.id),
                "timestamp": timezone.now().isoformat(),
            }
        )
    
    async def disconnect(self, close_code):
        # Leave the room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
            # Send user left message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_leave",
                    "user": self.user.get_full_name(),
                    "user_id": str(self.user.id),
                    "timestamp": timezone.now().isoformat(),
                }
            )
    
    async def receive(self, text_data):
        """
        Handle messages from WebSocket.
        """
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type", "message")
        
        if message_type == "message":
            content = text_data_json.get("content")
            message_id = await self.save_message(content)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message_id": str(message_id),
                    "user": self.user.get_full_name(),
                    "user_id": str(self.user.id),
                    "content": content,
                    "timestamp": timezone.now().isoformat(),
                }
            )
        elif message_type == "typing":
            # User is typing
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_typing",
                    "user": self.user.get_full_name(),
                    "user_id": str(self.user.id),
                    "timestamp": timezone.now().isoformat(),
                }
            )
        elif message_type == "read_receipt":
            message_id = text_data_json.get("message_id")
            await self.mark_as_read(message_id)
            
            # Send read receipt to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "read_receipt",
                    "user": self.user.get_full_name(),
                    "user_id": str(self.user.id),
                    "message_id": message_id,
                    "timestamp": timezone.now().isoformat(),
                }
            )
    
    async def chat_message(self, event):
        """
        Send message to WebSocket.
        """
        await self.send(text_data=json.dumps({
            "type": "message",
            "message_id": event["message_id"],
            "user": event["user"],
            "user_id": event["user_id"],
            "content": event["content"],
            "timestamp": event["timestamp"],
        }))
    
    async def user_typing(self, event):
        """
        Send typing notification to WebSocket.
        """
        await self.send(text_data=json.dumps({
            "type": "typing",
            "user": event["user"],
            "user_id": event["user_id"],
            "timestamp": event["timestamp"],
        }))
    
    async def read_receipt(self, event):
        """
        Send read receipt to WebSocket.
        """
        await self.send(text_data=json.dumps({
            "type": "read_receipt",
            "user": event["user"],
            "user_id": event["user_id"],
            "message_id": event["message_id"],
            "timestamp": event["timestamp"],
        }))
    
    async def user_join(self, event):
        """
        Send user joined notification to WebSocket.
        """
        await self.send(text_data=json.dumps({
            "type": "user_join",
            "user": event["user"],
            "user_id": event["user_id"],
            "timestamp": event["timestamp"],
        }))
    
    async def user_leave(self, event):
        """
        Send user left notification to WebSocket.
        """
        await self.send(text_data=json.dumps({
            "type": "user_leave",
            "user": event["user"],
            "user_id": event["user_id"],
            "timestamp": event["timestamp"],
        }))
    
    @database_sync_to_async
    def is_conversation_participant(self):
        """
        Check if the user is a participant in the conversation.
        """
        try:
            return ConversationParticipant.objects.filter(
                conversation_id=self.conversation_id,
                user=self.user,
                is_active=True
            ).exists()
        except Exception:
            return False
    
    @database_sync_to_async
    def save_message(self, content):
        """
        Save a new message to the database.
        """
        # Create and save the message
        message = Message.objects.create(
            conversation_id=self.conversation_id,
            sender=self.user,
            message_type=Message.MessageType.TEXT,
            content=content,
            sent_at=timezone.now()
        )
        
        # Update conversation timestamp
        conversation = Conversation.objects.get(id=self.conversation_id)
        conversation.updated_at = timezone.now()
        conversation.save()
        
        # Update sender's participant timestamp
        participant = ConversationParticipant.objects.get(
            conversation_id=self.conversation_id,
            user=self.user
        )
        participant.last_read_at = timezone.now()
        participant.save()
        
        # Create delivery statuses for all participants except the sender
        other_participants = ConversationParticipant.objects.filter(
            conversation_id=self.conversation_id,
            is_active=True
        ).exclude(user=self.user)
        
        for participant in other_participants:
            MessageDeliveryStatus.objects.create(
                message=message,
                recipient=participant.user,
                status=MessageDeliveryStatus.Status.SENT
            )
        
        return message.id
    
    @database_sync_to_async
    def mark_as_read(self, message_id):
        """
        Mark a message as read by the current user.
        """
        try:
            delivery_status = MessageDeliveryStatus.objects.get(
                message_id=message_id,
                recipient=self.user
            )
            delivery_status.status = MessageDeliveryStatus.Status.READ
            delivery_status.read_at = timezone.now()
            delivery_status.save()
            
            # Also update participant last read timestamp
            participant = ConversationParticipant.objects.get(
                conversation_id=self.conversation_id,
                user=self.user
            )
            participant.last_read_at = timezone.now()
            participant.save()
            
            return True
        except Exception:
            return False


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time notifications.
    """
    async def connect(self):
        self.user = self.scope["user"]
        
        # Anonymous users cannot connect
        if self.user.is_anonymous:
            await self.close()
            return
        
        # Each user has their own notification group
        self.room_group_name = f"notifications_{self.user.id}"
        
        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave the room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """
        Handle messages from WebSocket (acknowledgments, etc.).
        """
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type")
        
        if message_type == "notification_read":
            notification_id = text_data_json.get("notification_id")
            await self.mark_notification_read(notification_id)
    
    async def notification(self, event):
        """
        Send notification to WebSocket.
        """
        await self.send(text_data=json.dumps({
            "type": "notification",
            "notification_id": event.get("notification_id"),
            "notification_type": event.get("notification_type"),
            "title": event.get("title"),
            "message": event.get("message"),
            "timestamp": event.get("timestamp"),
        }))
    
    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        """
        Mark a notification as read.
        """
        from .models import Notification
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=self.user,
                is_read=False
            )
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save()
            return True
        except Exception:
            return False
