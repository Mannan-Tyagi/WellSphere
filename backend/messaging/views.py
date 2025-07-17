"""
Views for the messaging app
"""

from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
import logging

from .serializers import MessageThreadSerializer, MessageSerializer
from .permissions import IsThreadParticipant
from . import services

logger = logging.getLogger('django')


class MessageThreadViewSet(viewsets.ModelViewSet):
    """
    ViewSet for message threads
    """
    serializer_class = MessageThreadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return services.get_user_threads(self.request.user.id)
    
    def get_object(self):
        thread = services.get_thread(self.kwargs['pk'])
        self.check_object_permissions(self.request, thread)
        return thread
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            recipient_ids = serializer.validated_data.pop('recipients', [])
            subject = serializer.validated_data.get('subject', None)
            
            thread = services.create_thread(request.user.id, recipient_ids, subject)
            return Response(self.get_serializer(thread).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='messages')
    def messages(self, request, pk=None):
        """Get messages in a thread"""
        thread = self.get_object()
        
        limit = request.query_params.get('limit', None)
        offset = request.query_params.get('offset', None)
        
        if limit:
            limit = int(limit)
        if offset:
            offset = int(offset)
        
        messages = services.get_thread_messages(thread.id, limit, offset)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='messages')
    def create_message(self, request, pk=None):
        """Create a message in a thread"""
        thread = self.get_object()
        
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            content = serializer.validated_data.get('content')
            attachments = request.FILES.getlist('attachments', None)
            
            message = services.create_message(thread.id, request.user.id, content, attachments)
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'], url_path='read')
    def mark_read(self, request, pk=None):
        """Mark all messages in a thread as read"""
        thread = self.get_object()
        
        services.mark_thread_read(thread.id, request.user.id)
        return Response({'status': 'thread marked as read'})


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for individual messages
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsThreadParticipant]
    http_method_names = ['get', 'put']  # Only allow GET and PUT
    
    def get_object(self):
        return services.get_message(self.kwargs['pk'])
    
    @action(detail=True, methods=['put'], url_path='read')
    def mark_read(self, request, pk=None):
        """Mark a message as read"""
        message = self.get_object()
        
        services.mark_message_read(message.id, request.user.id)
        return Response({'status': 'message marked as read'})


class UnreadCountView(generics.RetrieveAPIView):
    """
    View to get unread message count
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        unread_count = services.get_unread_count(request.user.id)
        return Response({'unread_count': unread_count})
