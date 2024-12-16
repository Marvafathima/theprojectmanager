from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import django
from django.contrib.auth import get_user_model
from .models import Task

import logging
logger = logging.getLogger(__name__)

@shared_task
def check_and_send_deadline_reminders():
    try:
    # Get tasks due tomorrow
        now=timezone.now()
        tomorrow = timezone.now().date() + timedelta(days=1)
        logger.info(f"Checking for tasks due between {now} and {tomorrow}")
        
    
        upcoming_tasks = Task.objects.filter(
            due_date__lte=tomorrow,
            due_date__gte=now,
            # status__ne='completed'
        )
       
        logger.info(f"Found {upcoming_tasks.count()} tasks approaching deadline")
        
        for task in upcoming_tasks:
            send_deadline_reminder.delay(task.id)
    except Exception as e:
        # Log any errors
        print(f"Reminder task failed: {e}")
        return f"Task failed: {e}"


@shared_task
def send_deadline_reminder(task_id):
    task = Task.objects.get(id=task_id)
    
    send_mail(
        subject=f'Upcoming Deadline: {task.title}',
        message=f'''
        Dear {task.assigned_to.username},
        
        This is a reminder that the task "{task.title}" is due tomorrow ({task.due_date}).
        
        Task Details:
        - Title: {task.title}
        - Description: {task.description}
        - Deadline: {task.due_date}
        
        Please ensure you complete the task on time.
        
        Best regards,
        Project Management System
        ''',
        from_email='marvafathima62@gmail.com',
        recipient_list=[task.assigned_to.email],
        fail_silently=False,
    )