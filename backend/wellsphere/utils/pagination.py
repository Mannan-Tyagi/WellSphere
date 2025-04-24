"""
Custom pagination classes for WellSphere
"""

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict


class MedicalRecordPagination(PageNumberPagination):
    """
    Customized pagination for medical records that might require larger page sizes
    but still controlled for performance.
    """
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('num_pages', self.page.paginator.num_pages),
            ('results', data)
        ]))


class SmallSetPagination(PageNumberPagination):
    """
    Pagination for smaller datasets like appointments or messages.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class LargeSetPagination(PageNumberPagination):
    """
    Pagination for large data exports, analytics, etc.
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200
