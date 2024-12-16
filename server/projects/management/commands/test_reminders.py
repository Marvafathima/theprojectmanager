# projects/management/commands/test_reminders.py
from django.core.management.base import BaseCommand
from django.conf import settings
import django
import os

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from projects.tasks import check_and_send_deadline_reminders

class Command(BaseCommand):
    help = 'Manually test deadline reminders'

    def handle(self, *args, **options):
        # Manually trigger the reminder check
        check_and_send_deadline_reminders()
        self.stdout.write(self.style.SUCCESS('Deadline reminder check completed'))