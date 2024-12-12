from rest_framework import serializers
from .models import Project, Task, ProjectMember
from django.contrib.auth.models import User
from userauthentication.models import CustomUser
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
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

class TaskSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), 
        source='project', 
        write_only=True
    )
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='assigned_to', 
        write_only=True,
        required=False,
        allow_null=True
    )
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'project', 'project_id',
            'assigned_to', 'assigned_to_id', 'status', 'priority', 
            'start_date', 'due_date', 'created_by', 
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'completed_at', 'created_by']

    def create(self, validated_data):
        # Set the creator of the task to the current user
        user = self.context['request'].user
        validated_data['created_by'] = user
        
        # Check if user is a member of the project
        project = validated_data['project']
        
        return Task.objects.create(**validated_data)