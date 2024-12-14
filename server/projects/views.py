from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from django.core.exceptions import ValidationError
from .models import Project, Task,ProjectMember
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
                Q(tasks__assigned_to=self.request.user) | 
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
        task=serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print("create task data",request.data)
        # Validate data
        if serializer.is_valid():
            # Save new task and return response
            task=serializer.save(created_by=self.request.user)
            # self.perform_create(serializer)
            assigned_to = task.assigned_to
            project = task.project

            if assigned_to and project:
                ProjectMember.objects.get_or_create(
                    project=project,
                    user=assigned_to,
                    defaults={'role': 'member'}
                )
                print("project member created")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # If validation fails
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors  # This provides the detailed validation errors
        }, status=status.HTTP_400_BAD_REQUEST)
   
    def update(self, request, *args, **kwargs):
        task = self.get_object()
        old_assigned_to = task.assigned_to
        project = task.project

        # Deserialize the request data
        serializer = self.get_serializer(task, data=request.data, partial=True)

        if serializer.is_valid():
            # Save the updated task
            updated_task = serializer.save()
            new_assigned_to = updated_task.assigned_to

            # Handle reassignment: if the assigned user changed
            if old_assigned_to != new_assigned_to:
                # Remove old assigned user from ProjectMember if they have no other tasks
                if old_assigned_to:
                    has_other_tasks = Task.objects.filter(project=project, assigned_to=old_assigned_to).exists()
                    if not has_other_tasks:
                        ProjectMember.objects.filter(project=project, user=old_assigned_to).delete()
                        print(f"Removed {old_assigned_to.username} from project '{project.title}'")

                # Add new assigned user to ProjectMember
                if new_assigned_to:
                    ProjectMember.objects.get_or_create(
                        project=project,
                        user=new_assigned_to,
                        defaults={'role': 'member'}
                    )
                    print(f"Added {new_assigned_to.username} to project '{project.title}'")

            return Response(serializer.data)

        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        assigned_to = task.assigned_to
        project = task.project

        # Delete the task
        response = super().destroy(request, *args, **kwargs)

        # Check if the user has any other tasks in the project
        if assigned_to and project:
            has_other_tasks = Task.objects.filter(project=project, assigned_to=assigned_to).exists()
            if not has_other_tasks:
                ProjectMember.objects.filter(project=project, user=assigned_to).delete()
                print(f"Removed {assigned_to.username} from project '{project.title}'")

        return response
