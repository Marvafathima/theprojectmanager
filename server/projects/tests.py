from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta

from .models import Project, Task, ProjectMember
User=get_user_model()
class ProjectAndTaskPermissionTests(TestCase):
    def setUp(self):
        """
        Setup method to create test users, projects, and project members
        """
        # Create test users with different roles
        self.superuser = User.objects.create_superuser(
            username='admin', 
            email='admin@example.com', 
            password='adminpass'
        )
        self.staff_user = User.objects.create_user(
            username='staff', 
            email='staff@example.com', 
            password='staffpass',
            is_staff=True
        )
        self.regular_user = User.objects.create_user(
            username='user', 
            email='user@example.com', 
            password='userpass'
        )
        self.another_user = User.objects.create_user(
            username='another', 
            email='another@example.com', 
            password='anotherpass'
        )

        # Create API clients for each user
        self.superuser_client = APIClient()
        self.superuser_client.force_authenticate(user=self.superuser)

        self.staff_client = APIClient()
        self.staff_client.force_authenticate(user=self.staff_user)

        self.regular_client = APIClient()
        self.regular_client.force_authenticate(user=self.regular_user)

        self.another_client = APIClient()
        self.another_client.force_authenticate(user=self.another_user)

        # Create a test project
        self.project = Project.objects.create(
            title='Test Project',
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30)
        )

        # Add project members
        ProjectMember.objects.create(
            project=self.project,
            user=self.staff_user,
            role='manager'
        )
        ProjectMember.objects.create(
            project=self.project,
            user=self.regular_user,
            role='member'
        )

    def test_project_creation_permissions(self):
        """
        Test project creation permissions
        """
        project_data = {
            'title': 'New Project',
            'start_date': timezone.now().date(),
            'end_date': timezone.now().date() + timedelta(days=30)
        }

        # Superuser project creation
        response = self.superuser_client.post('/projects/', project_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Staff user project creation
        response = self.staff_client.post('/projects/', project_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Regular user project creation (should be forbidden)
        response = self.regular_client.post('/projects/', project_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_task_creation_permissions(self):
        """
        Test task creation permissions and validations
        """
        task_data = {
            'project_id': self.project.id,
            'title': 'Test Task',
            'description': 'Task description',
            'start_date': self.project.start_date,
            'due_date': self.project.end_date,
            'priority': 'medium'
        }

        # Superuser task creation
        response = self.superuser_client.post('/tasks/', task_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Staff member in project task creation
        response = self.staff_client.post('/tasks/', task_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Project member task creation
        response = self.regular_client.post('/tasks/', task_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User not in project task creation
        response = self.another_client.post('/tasks/', task_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_task_date_validation(self):
        """
        Test task date validations
        """
        # Invalid start date (before project start)
        invalid_start_task = {
            'project_id': self.project.id,
            'title': 'Invalid Start Date Task',
            'start_date': self.project.start_date - timedelta(days=1),
            'due_date': self.project.end_date,
        }
        response = self.staff_client.post('/tasks/', invalid_start_task)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start_date', str(response.data))

        # Invalid due date (after project end)
        invalid_due_task = {
            'project_id': self.project.id,
            'title': 'Invalid Due Date Task',
            'start_date': self.project.start_date,
            'due_date': self.project.end_date + timedelta(days=1),
        }
        response = self.staff_client.post('/tasks/', invalid_due_task)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('due_date', str(response.data))

    def test_task_update_permissions(self):
        """
        Test task update permissions
        """
        # Create a task first
        task_data = {
            'project_id': self.project.id,
            'title': 'Original Task',
            'start_date': self.project.start_date,
            'due_date': self.project.end_date,
        }
        response = self.staff_client.post('/tasks/', task_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        task_id = response.data['id']

        # Prepare update data
        update_data = {'title': 'Updated Task'}

        # Superuser can update task
        response = self.superuser_client.patch(f'/tasks/{task_id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Project manager can update task
        response = self.staff_client.patch(f'/tasks/{task_id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Regular project member cannot update task
        response = self.regular_client.patch(f'/tasks/{task_id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_task_assignment_constraints(self):
        """
        Test constraints on task assignment
        """
        # Create first high-priority task
        first_task_data = {
            'project_id': self.project.id,
            'title': 'First High Priority Task',
            'start_date': self.project.start_date,
            'due_date': self.project.end_date,
            'priority': 'high',
            'assigned_to_id': self.regular_user.id
        }
        response = self.staff_client.post('/tasks/', first_task_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Try to create another high-priority task for same user with same due date
        second_task_data = {
            'project_id': self.project.id,
            'title': 'Second High Priority Task',
            'start_date': self.project.start_date,
            'due_date': self.project.end_date,
            'priority': 'high',
            'assigned_to_id': self.regular_user.id
        }
        response = self.staff_client.post('/tasks/', second_task_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_my_tasks_view(self):
        """
        Test MyTasksViewSet functionality
        """
        # Create a task assigned to regular user
        task_data = {
            'project_id': self.project.id,
            'title': 'My Task',
            'start_date': self.project.start_date,
            'due_date': self.project.end_date,
            'assigned_to_id': self.regular_user.id
        }
        self.staff_client.post('/tasks/', task_data)

        # Verify the user can see their assigned tasks
        response = self.regular_client.get('/mytasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that the task is in the response
        self.assertTrue(len(response.data) > 0)

    def test_unauthorized_access_to_tasks(self):
        """
        Test that users cannot access tasks they are not involved with
        """
        # Create a task in the project
        task_data = {
            'project_id': self.project.id,
            'title': 'Restricted Task',
            'start_date': self.project.start_date,
            'due_date': self.project.end_date,
            'assigned_to_id': self.regular_user.id
        }
        response = self.staff_client.post('/tasks/', task_data)
        task_id = response.data['id']

        # Another user tries to access the task
        response = self.another_client.get(f'/tasks/{task_id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)# from django.test import TestCase

