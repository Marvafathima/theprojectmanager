from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer
from .permissions import IsProjectMemberOrAdmin, IsTaskOwnerOrProjectMember

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectMemberOrAdmin]

    def get_queryset(self):
        # Admins see all projects
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Project.objects.all()
        
        # Regular users see projects they are members of or created
        return Project.objects.filter(
            Q(members__user=self.request.user) | 
            Q(created_by=self.request.user)
        ).distinct()

    def list(self, request):
        # Optional filtering
        queryset = self.get_queryset()
        
        # Filter by status
        status = request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
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
