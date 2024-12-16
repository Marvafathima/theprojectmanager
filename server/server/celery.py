# server/celery.py
import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Create Celery app
app = Celery('server')

# Configure Celery using Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Automatically discover and register tasks from installed apps
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)