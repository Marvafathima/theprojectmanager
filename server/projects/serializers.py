from rest_framework import serializers
from .models import Project, Task, ProjectMember
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
User=get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, including basic user information.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_pic']  # Fields to include in the serialized output


class GetTaskSerializer(serializers.ModelSerializer):
    """
    Serializer for the Task model, focusing on task status.
    """
    class Meta:
        model = Task
        fields = ["status"]  # Only the task status is included


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model. Handles project details, members, and associated tasks.
    """
    created_by = UserSerializer(read_only=True)  # The user who created the project (read-only)
    members = serializers.SerializerMethodField()  # Custom field to fetch project members
    tasks = GetTaskSerializer(many=True, read_only=True)  # Related tasks for the project (read-only)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date', 
            'status', 'created_by', 'created_at', 'updated_at', 'members', 'tasks'
        ]  # Fields to include in the serialized output

    def get_members(self, obj):
        """
        Retrieve the members of the project, including their roles.
        """
        members = ProjectMember.objects.filter(project=obj)  # Query all members of the project
        return [
            {
                'user_id': member.user.id,  # Member's user ID
                'username': member.user.username,  # Member's username
                'role': member.role  # Member's role in the project
            } for member in members
        ]

    def create(self, validated_data):
        """
        Override the default create method to:
        - Assign the creator of the project to the current user.
        - Automatically add the creator as an owner in the project members.
        """
        user = self.context['request'].user  # Get the current user from the request context
        validated_data['created_by'] = user  # Set the creator of the project
        
        # Create the project with the validated data
        project = Project.objects.create(**validated_data)

        # Automatically add the project creator as an owner in the members table
        ProjectMember.objects.create(
            project=project,  # Link to the created project
            user=user,  # The user creating the project
            role='owner'  # Assign the role of 'owner'
        )

        return project

class TaskSerializer(serializers.ModelSerializer):
    # Define read-only fields for user and project serializers
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)

    # Write-only field for assigning a user by their ID
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source='assigned_to',
        queryset=User.objects.all(),
        required=False,  # Assignment is optional
        allow_null=True,  # Can be left unassigned
        write_only=True  # This field is for input only
    )

    # Write-only field for assigning a project by its ID
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        source='project',
        queryset=Project.objects.all(),
        write_only=True  # This field is for input only
    )

    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {
            'completed_at': {'read_only': True}  # The completion date cannot be modified manually
        }

    def validate(self, data):
        """
        Perform custom validation for the Task model. This includes checks for:
        - Start date constraints
        - Due date constraints
        - Task assignment within project date limits
        - Unique constraints on assigned tasks per user
        """
        today = timezone.now().date()  # Get the current date

        # Ensure the start date is not in the past
        start_date = data.get('start_date', None)
        if start_date and start_date < today:
            raise serializers.ValidationError({
                'start_date': 'Start date cannot be in the past.'
            })

        # Ensure the due date is after the start date
        due_date = data.get('due_date', None)
        if start_date and due_date and due_date <= start_date:
            raise serializers.ValidationError({
                'due_date': 'Due date must be after the start date.'
            })

        # Check if the task dates fall within the project's start and end dates
        project = data.get('project', None)
        if project:
            # Validate the start date against the project's timeline
            if start_date and (start_date < project.start_date or start_date > project.end_date):
                raise serializers.ValidationError({
                    'start_date': f'Start date must be between {project.start_date} and {project.end_date}.'
                })

            # Validate the due date against the project's timeline
            if due_date and (due_date < project.start_date or due_date > project.end_date):
                raise serializers.ValidationError({
                    'due_date': f'Due date must be between {project.start_date} and {project.end_date}.'
                })

        # Determine the ID of the current task being updated (if applicable)
        task_id = self.instance.id if self.instance else None

        # Validate assignment constraints for the assigned user
        assigned_to = data.get('assigned_to', None)
        if assigned_to:
            # Ensure the user is not already assigned to another task in the same project
            existing_project_tasks = Task.objects.filter(
                project=project,
                assigned_to=assigned_to
            ).exclude(id=task_id)  # Exclude the current task being updated

            if existing_project_tasks.exists():
                raise serializers.ValidationError({
                    'assigned_to': 'User is already assigned to a task in this project.'
                })

            # Prevent assigning the user another high-priority task with the same due date
            high_priority_tasks = Task.objects.filter(
                assigned_to=assigned_to,
                priority='high',
                due_date=due_date
            ).exclude(id=task_id)
            if high_priority_tasks.exists():
                raise serializers.ValidationError({
                    'assigned_to': 'User cannot be assigned another high-priority task with the same deadline.'
                })

        # Return the validated data
        return data
