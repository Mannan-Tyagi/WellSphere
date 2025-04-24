"""
Custom exception handling for the WellSphere API
"""

import logging
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied, ValidationError
from django.http import Http404
from django.db.utils import IntegrityError

logger = logging.getLogger('django')


class ServiceUnavailableException(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = 'Service temporarily unavailable, please try again later.'


class PaymentRequiredException(APIException):
    status_code = status.HTTP_402_PAYMENT_REQUIRED
    default_detail = 'Payment is required to access this resource.'


class BusinessLogicException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'A business logic error occurred.'


def wellsphere_exception_handler(exc, context):
    """
    Custom exception handler for WellSphere API that provides
    more detailed error responses and logging.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # If response is None, there was an unhandled exception
    if response is None:
        if isinstance(exc, ValidationError):
            # Django's built-in ValidationError
            if hasattr(exc, 'message_dict'):
                detail = exc.message_dict
            else:
                detail = {'detail': list(exc.messages)}
            response = Response(detail, status=status.HTTP_400_BAD_REQUEST)
            
        elif isinstance(exc, Http404):
            response = Response(
                {'detail': 'Resource not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        elif isinstance(exc, PermissionDenied):
            response = Response(
                {'detail': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        elif isinstance(exc, IntegrityError):
            response = Response(
                {'detail': 'Database integrity error. This may be due to duplicate records.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        else:
            # Log the unhandled exception
            logger.error(f"Unhandled exception: {exc}", exc_info=True)
            response = Response(
                {'detail': 'An unexpected error occurred.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Add additional information to the response
    if response is not None:
        if 'request' in context:
            request = context['request']
            # Add request identifier if available
            if hasattr(request, 'request_id'):
                response.data['request_id'] = request.request_id
        
        # Add error code for frontend handling
        if 'detail' in response.data:
            response.data['error_code'] = get_error_code(exc)
    
    return response


def get_error_code(exc):
    """
    Map exceptions to specific error codes that frontend can use
    for handling different error scenarios.
    """
    error_code_map = {
        'ValidationError': 'VALIDATION_ERROR',
        'AuthenticationFailed': 'AUTHENTICATION_FAILED',
        'NotAuthenticated': 'NOT_AUTHENTICATED',
        'PermissionDenied': 'PERMISSION_DENIED',
        'NotFound': 'NOT_FOUND',
        'MethodNotAllowed': 'METHOD_NOT_ALLOWED',
        'Throttled': 'THROTTLED',
        'IntegrityError': 'INTEGRITY_ERROR',
        'ServiceUnavailableException': 'SERVICE_UNAVAILABLE',
        'PaymentRequiredException': 'PAYMENT_REQUIRED',
        'BusinessLogicException': 'BUSINESS_LOGIC_ERROR',
    }
    
    exc_name = exc.__class__.__name__
    return error_code_map.get(exc_name, 'UNKNOWN_ERROR')
