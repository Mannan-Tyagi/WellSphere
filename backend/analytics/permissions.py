from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permission to only allow admins.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.role == 'admin')


class IsDoctor(permissions.BasePermission):
    """
    Permission to only allow doctors.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'
