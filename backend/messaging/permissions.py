from rest_framework import permissions

class IsThreadParticipant(permissions.BasePermission):
    """
    Permission to only allow participants of a message thread.
    """
    def has_object_permission(self, request, view, obj):
        # For threads
        if hasattr(obj, 'participants'):
            return request.user in obj.participants.all()
            
        # For messages
        if hasattr(obj, 'thread'):
            return request.user in obj.thread.participants.all()
            
        return False
