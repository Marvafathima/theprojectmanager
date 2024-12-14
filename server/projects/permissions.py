
from rest_framework import permissions
from .models import ProjectMember, Project

class IsProjectMemberOrAdmin(permissions.BasePermission):
    """
    Refined permission for projects with stricter creation rules.
    """
    def has_permission(self, request, view):
        # Only allow creation to managers (is_staff) or admins (is_superuser)
        if view.action == 'create':
            return request.user.is_staff or request.user.is_superuser
        
        # Allow viewing projects to authenticated users
        # This ensures all authenticated users can view projects
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # For destroy action
        if view.action == 'destroy':
            # Superusers can always destroy
            if request.user.is_superuser:
                return True
            
            # Managers can destroy projects they have manager role in
            if request.user.is_staff and not request.user.is_superuser:
                return ProjectMember.objects.filter(
                    project=obj,
                    user=request.user,
                    role__in=['owner', 'admin', 'manager']
                ).exists()
        
        # Superusers have full access
        if request.user.is_staff and request.user.is_superuser:
            return True
        
        # Check if user is a member of the project for other actions
        if isinstance(obj, Project):
            return ProjectMember.objects.filter(project=obj, user=request.user).exists()
        
        return False

class IsTaskOwnerOrProjectMember(permissions.BasePermission):
    """
    Refined permission for tasks with stricter creation and modification rules.
    """
    def has_permission(self, request, view):
        # Only allow task creation to managers (is_staff) or admins (is_superuser)
        if view.action == 'create':
            return request.user.is_staff or request.user.is_superuser
        
        # Allow all authenticated users to view tasks
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Destroy action - only for staff and superusers
        if view.action == 'destroy':
            return request.user.is_staff or request.user.is_superuser
        
        # Update actions - more restricted
        if view.action in ['update', 'partial_update']:
            # Superusers and staff can always update
            if request.user.is_staff or request.user.is_superuser:
                return True
            
            # Task owner or assigned user can update
            if obj.created_by == request.user or obj.assigned_to == request.user:
                return True
            
            # Project managers can update
            return ProjectMember.objects.filter(
                project=obj.project,
                user=request.user,
                role__in=['owner', 'admin', 'manager']
            ).exists()
        
        # Retrieve and list actions - more permissive
        if view.action in ['retrieve', 'list']:
            # Superusers can always view
            if request.user.is_staff and request.user.is_superuser:
                return True
            
            # Check if user is a project member
            return ProjectMember.objects.filter(
                project=obj.project, 
                user=request.user
            ).exists()
        
        return False

