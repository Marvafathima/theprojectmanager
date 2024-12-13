from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # Match the frontend pagination
    page_size_query_param = 'page_size'
    max_page_size = 100