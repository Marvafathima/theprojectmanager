from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from django.core.exceptions import ValidationError
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer
from .permissions import IsProjectMemberOrAdmin, IsTaskOwnerOrProjectMember
from .Pagination import StandardResultsSetPagination
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectMemberOrAdmin]
    pagination_class = StandardResultsSetPagination 
   
    def get_queryset(self):
        # Get the user_id from query parameters
        user_id = self.request.query_params.get('user_id')
        
        # Base queryset for admins
        if self.request.user.is_staff and self.request.user.is_superuser:
            queryset = Project.objects.all()
        else:
            # Regular users see projects they are members of or created
            queryset = Project.objects.filter(
                Q(members__user=self.request.user) | 
                Q(created_by=self.request.user)
            ).distinct()
        
        # Optional filtering by specific user
        if user_id:
            queryset = queryset.filter(
                Q(created_by_id=user_id) | 
                Q(members__user_id=user_id)
            ).distinct()
        
        # Optional status filtering
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset

    def list(self, request):
        queryset = self.get_queryset()
        
        # Pagination is now handled by the pagination_class
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['GET'])
    def tasks(self, request, pk=None):
        # Get tasks for a specific project
        project = self.get_object()
        tasks = project.tasks.all()
        
        # Optional filtering for tasks
        status = request.query_params.get('status')
        priority = request.query_params.get('priority')
        
        if status:
            tasks = tasks.filter(status=status)
        if priority:
            tasks = tasks.filter(priority=priority)
        
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    #to retrieve the latest two projects 
    @action(detail=False, methods=['GET'], url_path='latest')
    def latest(self, request):
        # Retrieve the latest two projects
        queryset = self.get_queryset().order_by('-created_at')[:2]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
# class TaskViewSet(viewsets.ModelViewSet):
#     serializer_class = TaskSerializer
#     permission_classes = [IsAuthenticated, IsTaskOwnerOrProjectMember]

#     def get_queryset(self):
#         # Admins see all tasks
#         if self.request.user.is_staff or self.request.user.is_superuser:
#             return Task.objects.all()
        
#         # Regular users see tasks they created, assigned to, or in projects they're members of
#         return Task.objects.filter(
#             Q(created_by=self.request.user) | 
#             Q(assigned_to=self.request.user) | 
#             Q(project__members__user=self.request.user)
#         ).distinct()

#     def list(self, request):
#         queryset = self.get_queryset()
        
#         # Filtering options
#         status = request.query_params.get('status')
#         priority = request.query_params.get('priority')
#         assigned_user = request.query_params.get('assigned_user')
        
#         if status:
#             queryset = queryset.filter(status=status)
#         if priority:
#             queryset = queryset.filter(priority=priority)
#         if assigned_user:
#             queryset = queryset.filter(assigned_to__username=assigned_user)
        
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsTaskOwnerOrProjectMember]

    def get_queryset(self):
        # Admins see all tasks
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Task.objects.all()
        
        # Regular users see tasks they created, assigned to, or in projects they're members of
        return Task.objects.filter(
            Q(created_by=self.request.user) | 
            Q(assigned_to=self.request.user) | 
            Q(project__members__user=self.request.user)
        ).distinct()

    def list(self, request):
        queryset = self.get_queryset()
        
        # Filtering options
        status = request.query_params.get('status')
        priority = request.query_params.get('priority')
        assigned_user = request.query_params.get('assigned_user')
        
        if status:
            queryset = queryset.filter(status=status)
        if priority:
            queryset = queryset.filter(priority=priority)
        if assigned_user:
            queryset = queryset.filter(assigned_to__username=assigned_user)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    def perform_create(self, serializer):
        # Automatically set the created_by field to the current user
        serializer.save(created_by=self.request.user)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # Validate data
        if serializer.is_valid():
            # Save new task and return response
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # If validation fails
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors  # This provides the detailed validation errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        task = self.get_object()  # Get task object based on primary key (id)
        serializer = self.get_serializer(task, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()  # Save the updated task
            return Response(serializer.data)  # Return the updated task data

        # If validation fails
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)