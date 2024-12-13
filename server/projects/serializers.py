from rest_framework import serializers
from .models import Project, Task, ProjectMember
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
User=get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email' , 'profile_pic']

class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date', 
            'status', 'created_by', 'created_at', 'updated_at', 'members'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_members(self, obj):
        members = ProjectMember.objects.filter(project=obj)
        return [
            {
                'user_id': member.user.id, 
                'username': member.user.username, 
                'role': member.role
            } for member in members
        ]

    def create(self, validated_data):
        # Set the creator of the project to the current user
        user = self.context['request'].user
        validated_data['created_by'] = user
        project = Project.objects.create(**validated_data)
        
        # Automatically add project creator as owner
        ProjectMember.objects.create(
            project=project, 
            user=user, 
            role='owner'
        )
        
        return project

# class TaskSerializer(serializers.ModelSerializer):
#     project = ProjectSerializer(read_only=True)
#     project_id = serializers.PrimaryKeyRelatedField(
#         queryset=Project.objects.all(), 
#         source='project', 
#         write_only=True
#     )
#     assigned_to = UserSerializer(read_only=True)
#     assigned_to_id = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.all(), 
#         source='assigned_to', 
#         write_only=True,
#         required=False,
#         allow_null=True
#     )
#     created_by = UserSerializer(read_only=True)

#     class Meta:
#         model = Task
#         fields = [
#             'id', 'title', 'description', 'project', 'project_id',
#             'assigned_to', 'assigned_to_id', 'status', 'priority', 
#             'start_date', 'due_date', 'created_by', 
#             'created_at', 'updated_at', 'completed_at'
#         ]
#         read_only_fields = ['created_at', 'updated_at', 'completed_at', 'created_by']

#     def create(self, validated_data):
#         # Set the creator of the task to the current user
#         user = self.context['request'].user
#         validated_data['created_by'] = user
        
#         # Check if user is a member of the project
#         project = validated_data['project']
        
#         return Task.objects.create(**validated_data)
    
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {
            'completed_at': {'read_only': True}
        }

    def validate(self, data):
        # Current date
        today = timezone.now().date()

        # Check start date is not in the past
        start_date = data.get('start_date', None)
        if start_date and start_date < today:
            raise serializers.ValidationError({
                'start_date': 'Start date cannot be in the past.'
            })

        # Check due date is after start date
        due_date = data.get('due_date', None)
        if start_date and due_date and due_date <= start_date:
            raise serializers.ValidationError({
                'due_date': 'Due date must be after start date.'
            })

        # Check project date constraints
        project = data.get('project', None)
        if project:
            # Ensure task dates are within project dates
            if start_date and (start_date < project.start_date or start_date > project.end_date):
                raise serializers.ValidationError({
                    'start_date': f'Start date must be between {project.start_date} and {project.end_date}'
                })
            
            if due_date and (due_date < project.start_date or due_date > project.end_date):
                raise serializers.ValidationError({
                    'due_date': f'Due date must be between {project.start_date} and {project.end_date}'
                })

        # Check assigned user constraints
        assigned_to = data.get('assigned_to', None)
        if assigned_to:
            # Check if user already has a task in this project
            existing_project_tasks = Task.objects.filter(
                project=project, 
                assigned_to=assigned_to
            )
            if existing_project_tasks.exists():
                raise serializers.ValidationError({
                    'assigned_to': 'User is already assigned to a task in this project.'
                })

            # Check high priority task constraints
            high_priority_tasks = Task.objects.filter(
                assigned_to=assigned_to,
                priority='high',
                due_date=due_date
            )
            if high_priority_tasks.exists():
                raise serializers.ValidationError({
                    'assigned_to': 'User cannot be assigned another high priority task with the same deadline.'
                })

        return data