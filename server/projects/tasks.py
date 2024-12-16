from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import Task

@shared_task
def check_and_send_deadline_reminders():
    # Get tasks due tomorrow
    tomorrow = timezone.now().date() + timedelta(days=1)
    upcoming_tasks = Task.objects.filter(
        deadline__date=tomorrow,
        status__ne='completed'
    )
    
    for task in upcoming_tasks:
        send_deadline_reminder.delay(task.id)

@shared_task
def send_deadline_reminder(task_id):
    task = Task.objects.get(id=task_id)
    
    send_mail(
        subject=f'Upcoming Deadline: {task.title}',
        message=f'''
        Dear {task.assigned_to.username},
        
        This is a reminder that the task "{task.title}" is due tomorrow ({task.due_date.date()}).
        
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