# from rest_framework import permissions
# from .models import ProjectMember, Project, Task

# class IsProjectMemberOrAdmin(permissions.BasePermission):
#     """
#     Permission for creating, viewing, and deleting projects.
#     """

#     def has_permission(self, request, view):
        
#         # Allow creation only to managers (is_staff) or admins (is_superuser)
#         if view.action == 'create' and (request.user.is_staff or request.user.is_superuser):
            
#             return True
        
#         # Allow viewing projects to authenticated users who are project members
#         return request.user.is_authenticated

#     def has_object_permission(self, request, view, obj):
#         # Allow delete operations only to managers and admins
#         if view.action == 'destroy':
#             if request.user.is_staff and not request.user.is_superuser:
#                 project_id = view.kwargs.get('project_pk')  # Assuming project_pk is passed in the URL
#                 if project_id:
#                     return ProjectMember.objects.filter(
#                         project__id=project_id,
#                         user=request.user,
#                         role='manager'
#                     ).exists()
                

#             if request.user.is_superuser:
#                 return True

#         # Allow admins to access any project
#         if request.user.is_staff and request.user.is_superuser:
#             return True

#         # Check if user is a member of the project
#         if isinstance(obj, Project):
#             return ProjectMember.objects.filter(project=obj, user=request.user).exists()
        
#         return False

# class IsTaskOwnerOrProjectMember(permissions.BasePermission):
#     """
#     Permission for viewing, updating, and deleting tasks.
#     """

#     def has_permission(self, request, view):
#         # Allow task creation to managers (is_staff) and admins (is_superuser)
#         if view.action == 'create' and (request.user.is_staff or request.user.is_superuser):
#             return True

#         return request.user.is_authenticated

#     def has_object_permission(self, request, view, obj):
#         # Allow delete operations only to managers and admins
#         if view.action == 'destroy' and (request.user.is_staff or request.user.is_superuser):
#             return True

#         # Allow update operations to task owner, assigned user, manager, or admin
#         if view.action in ['update', 'partial_update']:
#             if request.user.is_staff or request.user.is_superuser:
#                 return True
#             if obj.created_by == request.user or obj.assigned_to == request.user:
#                 return True

#         # Allow viewing tasks to project members
#         if view.action == 'retrieve' or view.action == 'list':
#             if request.user.is_staff and request.user.is_superuser:
#                 return True
#             return ProjectMember.objects.filter(project=obj.project, user=request.user).exists()
        
#         return False
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

