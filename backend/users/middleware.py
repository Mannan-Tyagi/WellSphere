"""
Middleware for security and audit logging in WellSphere
"""

import uuid
import logging
import json
import time
from django.utils import timezone
from django.conf import settings
from .models import User

# Setup audit logger
audit_logger = logging.getLogger('wellsphere.audit')


class AuditLogMiddleware:
    """
    Middleware to log all API access for HIPAA compliance
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Generate a unique ID for this request
        request_id = str(uuid.uuid4())
        request.request_id = request_id
        
        # Start timer for request duration
        start_time = time.time()
        
        # Collect request details before processing
        self.log_request(request)
        
        # Process the request
        response = self.get_response(request)
        
        # Calculate request duration
        duration = time.time() - start_time
        
        # Log the response details
        self.log_response(request, response, duration)
        
        return response

    def log_request(self, request):
        """Log details of the incoming request"""
        # Only log API requests
        if not request.path.startswith('/api/'):
            return
        
        user_id = None
        user_role = None
        username = None
        
        # Get authenticated user information if available
        if hasattr(request, 'user') and request.user.is_authenticated:
            user_id = str(request.user.id)
            user_role = request.user.role
            username = request.user.email
        
        # Build the log data
        log_data = {
            'timestamp': timezone.now().isoformat(),
            'request_id': request.request_id,
            'method': request.method,
            'path': request.path,
            'query_params': dict(request.GET),
            'remote_addr': self.get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'user_id': user_id,
            'user_role': user_role,
            'username': username,
        }
        
        # Log the request
        audit_logger.info(f"API Request: {json.dumps(log_data)}")

    def log_response(self, request, response, duration):
        """Log details of the outgoing response"""
        # Only log API requests
        if not request.path.startswith('/api/'):
            return
            
        # Build the log data
        log_data = {
            'timestamp': timezone.now().isoformat(),
            'request_id': request.request_id,
            'status_code': response.status_code,
            'duration': f"{duration:.3f}s",
            'content_length': len(response.content) if hasattr(response, 'content') else 0,
        }
        
        # Check for PHI access in specific endpoints
        if self.contains_phi(request.path):
            log_data['phi_access'] = True
            
            # If authenticated, log this access to the database
            if hasattr(request, 'user') and request.user.is_authenticated:
                # This would be implemented in a real system with a database model
                # for tracking PHI access more comprehensively
                pass
        
        # Log the response
        audit_logger.info(f"API Response: {json.dumps(log_data)}")

    def get_client_ip(self, request):
        """Extract the client IP address from request headers or REMOTE_ADDR"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # X-Forwarded-For header is a comma-separated list of IPs
            # where the leftmost is the original client IP
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def contains_phi(self, path):
        """
        Determine if the requested path likely includes Protected Health Information (PHI)
        based on endpoint patterns
        """
        phi_endpoints = [
            '/api/v1/medical-records/',
            '/api/v1/patients/',
            '/api/v1/appointments/',
            '/api/v1/messaging/',
        ]
        
        for endpoint in phi_endpoints:
            if path.startswith(endpoint):
                return True
                
        return False
