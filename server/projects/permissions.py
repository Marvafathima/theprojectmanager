from rest_framework import permissions
from .models import ProjectMember, Project, Task

class IsProjectMemberOrAdmin(permissions.BasePermission):
    """
    Permission for creating, viewing, and deleting projects.
    """

    def has_permission(self, request, view):
        # Allow creation only to managers (is_staff) or admins (is_superuser)
        if view.action == 'create' and (request.user.is_staff or request.user.is_superuser):
            return True
        
        # Allow viewing projects to authenticated users who are project members
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow delete operations only to managers and admins
        if view.action == 'destroy':
            if request.user.is_staff and not request.user.is_superuser:
                project_id = view.kwargs.get('project_pk')  # Assuming project_pk is passed in the URL
                if project_id:
                    return ProjectMember.objects.filter(
                        project__id=project_id,
                        user=request.user,
                        role='manager'
                    ).exists()
                

            if request.user.is_superuser:
                return True

        # Allow admins to access any project
        if request.user.is_staff and request.user.is_superuser:
            return True

        # Check if user is a member of the project
        if isinstance(obj, Project):
            return ProjectMember.objects.filter(project=obj, user=request.user).exists()
        
        return False
# class IsProjectMemberOrAdmin(permissions.BasePermission):
#     def has_permission(self, request, view):
#         # Allow create operations only to admins or managers associated with a project
#         if request.user.is_superuser:
#             return True

#         if request.user.is_staff:
#             # Check if the user is a manager of this specific project (for create operations)
#             project_id = view.kwargs.get('project_pk')  # Assuming project_pk is passed in the URL
#             if project_id:
#                 return ProjectMember.objects.filter(
#                     project__id=project_id,
#                     user=request.user,
#                     role='manager'
#                 ).exists()
        
#         return False

#     def has_object_permission(self, request, view, obj):
#         # Always allow admins
#         if request.user.is_superuser:
#             return True

#         # Allow project managers or members only if they are associated with this specific project
#         if isinstance(obj, Project):
#             return ProjectMember.objects.filter(
#                 project=obj, 
#                 user=request.user
#             ).exists()

#         # For tasks, check project membership
#         if isinstance(obj, Task):
#             return ProjectMember.objects.filter(
#                 project=obj.project, 
#                 user=request.user
#             ).exists()

#         return False
class IsTaskOwnerOrProjectMember(permissions.BasePermission):
    """
    Permission for viewing, updating, and deleting tasks.
    """

    def has_permission(self, request, view):
        # Allow task creation to managers (is_staff) and admins (is_superuser)
        if view.action == 'create' and (request.user.is_staff or request.user.is_superuser):
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow delete operations only to managers and admins
        if view.action == 'destroy' and (request.user.is_staff or request.user.is_superuser):
            return True

        # Allow update operations to task owner, assigned user, manager, or admin
        if view.action in ['update', 'partial_update']:
            if request.user.is_staff or request.user.is_superuser:
                return True
            if obj.created_by == request.user or obj.assigned_to == request.user:
                return True

        # Allow viewing tasks to project members
        if view.action == 'retrieve' or view.action == 'list':
            return ProjectMember.objects.filter(project=obj.project, user=request.user).exists()
        
        return False


# from rest_framework import permissions
# from .models import ProjectMember, Project, Task

# class IsProjectMemberOrAdmin(permissions.BasePermission):
#     def has_permission(self, request, view):
#         # Allow create operations to admins or project members
#         if request.user.is_staff or request.user.is_superuser:
#             return True
        
#         return False  # allowing only managers or admin to create a project

#     def has_object_permission(self, request, view, obj):
#         # Always allow admins
#         if request.user.is_staff or request.user.is_superuser:
#             return True
        
#         # Check if user is a member of the project
#         if isinstance(obj, Project):
#             return ProjectMember.objects.filter(
#                 project=obj, 
#                 user=request.user
#             ).exists()
        
#         # For tasks, check project membership
#         if isinstance(obj, Task):
#             return ProjectMember.objects.filter(
#                 project=obj.project, 
#                 user=request.user
#             ).exists()
        
#         return False

# class IsTaskOwnerOrProjectMember(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         # Always allow admins
#         if request.user.is_staff or request.user.is_superuser:
#             return True
        
#         # Allow if user created the task
#         if obj.created_by == request.user:
#             return True
        
#         # Allow if task is assigned to the user
#         if obj.assigned_to == request.user:
#             return True
        
#         # Check project membership
#         return ProjectMember.objects.filter(
#             project=obj.project, 
#             user=request.user
#         ).exists()