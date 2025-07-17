"""
Views for the billing app
"""

from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
import logging

from .serializers import (
    InvoiceSerializer, 
    PaymentSerializer, 
    PaymentMethodSerializer, 
    InsuranceClaimSerializer,
    InsuranceProviderSerializer
)
from .permissions import IsPatientOrProviderOrAdmin, IsOwner
from . import services

logger = logging.getLogger('django')


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for invoices
    """
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProviderOrAdmin]
    
    def get_queryset(self):
        # Get filter parameters
        patient_id = self.request.query_params.get('patient', None)
        provider_id = self.request.query_params.get('provider', None)
        status = self.request.query_params.get('status', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        return services.get_all_invoices(
            patient_id=patient_id, 
            provider_id=provider_id,
            status=status,
            start_date=start_date,
            end_date=end_date
        )
    
    def get_object(self):
        return services.get_invoice(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            invoice_data = serializer.validated_data.copy()
            items_data = invoice_data.pop('items', [])
            
            invoice = services.create_invoice(invoice_data, items_data)
            return Response(self.get_serializer(invoice).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
            if serializer.is_valid():
                invoice = services.update_invoice(self.kwargs['pk'], serializer.validated_data)
                return Response(self.get_serializer(invoice).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='pay')
    def pay_invoice(self, request, pk=None):
        """Process payment for an invoice"""
        invoice = self.get_object()
        
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                payment = services.process_payment(invoice.id, serializer.validated_data)
                return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='void')
    def void_invoice(self, request, pk=None):
        """Void an invoice"""
        invoice = self.get_object()
        
        reason = request.data.get('reason', None)
        try:
            invoice = services.void_invoice(invoice.id, reason)
            return Response(self.get_serializer(invoice).data)
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """
    ViewSet for payment methods
    """
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return services.get_user_payment_methods(self.request.user.id)
    
    def get_object(self):
        return services.get_payment_method(self.kwargs['pk'], self.request.user.id)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Set the user to the current user
            payment_data = serializer.validated_data.copy()
            payment_data['user'] = request.user
            
            payment_method = services.create_payment_method(payment_data)
            return Response(self.get_serializer(payment_method).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            payment_method = services.update_payment_method(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(payment_method).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        services.delete_payment_method(self.kwargs['pk'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class InsuranceClaimViewSet(viewsets.ModelViewSet):
    """
    ViewSet for insurance claims
    """
    serializer_class = InsuranceClaimSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatientOrProviderOrAdmin]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient', None)
        provider_id = self.request.query_params.get('provider', None)
        status = self.request.query_params.get('status', None)
        
        return services.get_all_claims(
            patient_id=patient_id,
            provider_id=provider_id,
            status=status
        )
    
    def get_object(self):
        return services.get_claim(self.kwargs['pk'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            claim = services.create_claim(serializer.validated_data)
            return Response(self.get_serializer(claim).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            claim = services.update_claim(self.kwargs['pk'], serializer.validated_data)
            return Response(self.get_serializer(claim).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='response')
    def process_response(self, request, pk=None):
        """Process insurance response"""
        claim = self.get_object()
        
        try:
            claim = services.process_claim_response(claim.id, request.data)
            return Response(self.get_serializer(claim).data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
