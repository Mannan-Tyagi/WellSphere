"""
Database operations for the messaging app
"""
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth import get_user_model
import logging

from .models import MessageThread, Message, MessageAttachment

User = get_user_model()
logger = logging.getLogger('django')

# Message Thread operations
def get_user_threads(user_id):
    """Get all message threads for a user"""
    user = get_object_or_404(User, id=user_id)
    return MessageThread.objects.filter(participants=user).order_by('-updated_at')

def get_thread(thread_id):
    """Get a specific message thread by ID"""
    return get_object_or_404(MessageThread, id=thread_id)

def create_thread(creator_id, recipient_ids, subject=None):
    """Create a new message thread"""
    try:
        with transaction.atomic():
            # Create the thread
            thread = MessageThread.objects.create(
                subject=subject,
                created_by_id=creator_id
            )
            
            # Add creator and recipients as participants
            creator = get_object_or_404(User, id=creator_id)
            thread.participants.add(creator)
            
            for recipient_id in recipient_ids:
                recipient = get_object_or_404(User, id=recipient_id)
                thread.participants.add(recipient)
            
            logger.info(f"Created thread: {thread.id} by user: {creator_id}")
            return thread
    except Exception as e:
        logger.error(f"Error creating thread: {str(e)}")
        raise

def add_participant(thread_id, user_id):
    """Add a participant to a thread"""
    thread = get_object_or_404(MessageThread, id=thread_id)
    user = get_object_or_404(User, id=user_id)
    
    thread.participants.add(user)
    logger.info(f"Added user {user_id} to thread {thread_id}")
    return thread

def remove_participant(thread_id, user_id):
    """Remove a participant from a thread"""
    thread = get_object_or_404(MessageThread, id=thread_id)
    user = get_object_or_404(User, id=user_id)
    
    thread.participants.remove(user)
    logger.info(f"Removed user {user_id} from thread {thread_id}")
    return thread

# Message operations
def get_thread_messages(thread_id, limit=None, offset=None):
    """Get messages for a thread"""
    thread = get_object_or_404(MessageThread, id=thread_id)
    queryset = Message.objects.filter(thread=thread).order_by('created_at')
    
    if offset is not None:
        queryset = queryset[offset:]
    if limit is not None:
        queryset = queryset[:limit]
        
    return queryset

def get_message(message_id):
    """Get a specific message by ID"""
    return get_object_or_404(Message, id=message_id)

def create_message(thread_id, sender_id, content, attachments=None):
    """Create a new message"""
    try:
        with transaction.atomic():
            thread = get_object_or_404(MessageThread, id=thread_id)
            sender = get_object_or_404(User, id=sender_id)
            
            # Create the message
            message = Message.objects.create(
                thread=thread,
                sender=sender,
                content=content
            )
            
            # Update thread timestamp
            thread.updated_at = timezone.now()
            thread.save()
            
            # Handle attachments if any
            if attachments:
                for attachment in attachments:
                    MessageAttachment.objects.create(
                        message=message,
                        file=attachment
                    )
            
            logger.info(f"Created message: {message.id} in thread: {thread_id}")
            return message
    except Exception as e:
        logger.error(f"Error creating message: {str(e)}")
        raise

def mark_message_read(message_id, user_id):
    """Mark a message as read by a user"""
    message = get_object_or_404(Message, id=message_id)
    user = get_object_or_404(User, id=user_id)
    
    message.read_by.add(user)
    logger.info(f"Marked message {message_id} as read by user {user_id}")
    return message

def mark_thread_read(thread_id, user_id):
    """Mark all messages in a thread as read by a user"""
    thread = get_object_or_404(MessageThread, id=thread_id)
    user = get_object_or_404(User, id=user_id)
    
    messages = Message.objects.filter(thread=thread).exclude(read_by=user)
    
    for message in messages:
        message.read_by.add(user)
    
    logger.info(f"Marked all messages in thread {thread_id} as read by user {user_id}")
    return True

def get_unread_count(user_id):
    """Get the count of unread messages for a user"""
    user = get_object_or_404(User, id=user_id)
    
    # Get threads the user is a participant in
    threads = MessageThread.objects.filter(participants=user)
    
    # Count messages in those threads that aren't read by the user and weren't sent by the user
    unread_count = Message.objects.filter(
        thread__in=threads
    ).exclude(
        Q(read_by=user) | Q(sender=user)
    ).count()
    
    return unread_count
