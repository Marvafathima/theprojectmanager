from django.db import models

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()
class Project(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='planned'
    )
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        related_name='created_projects',
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
      

class Task(models.Model):
    STATUS_CHOICES = [
        ('to-do', 'To Do'),
        ('in-progress', 'In Progress'),
        ('done', 'Done'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='tasks'
    )
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        related_name='assigned_tasks',
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='to-do'
    )
    priority = models.CharField(
        max_length=20, 
        choices=PRIORITY_CHOICES, 
        default='medium'
    )
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        related_name='created_tasks',
        null=True
    )
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Automatically set completed_at when status is 'done'
        if self.status == 'done' and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status != 'done':
            self.completed_at = None
        
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class ProjectMember(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Administrator'),
        ('member', 'Member'),
        ('viewer', 'Viewer'),
    ]

    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='members'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='project_memberships'
    )
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='member'
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.project.title} ({self.role})"
