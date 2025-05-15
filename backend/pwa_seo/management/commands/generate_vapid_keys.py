from django.core.management.base import BaseCommand
from pywebpush import webpush, WebPushException


class Command(BaseCommand):
    help = 'Generate VAPID keys for web push notifications'

    def handle(self, *args, **options):
        try:
            from pywebpush import webpush, WebPushException, Vapid
            
            vapid = Vapid()
            vapid_key = vapid.generate_keys()
            
            self.stdout.write(self.style.SUCCESS('VAPID keys generated successfully'))
            self.stdout.write(self.style.SUCCESS(f'VAPID_PUBLIC_KEY={vapid_key.public_key}'))
            self.stdout.write(self.style.SUCCESS(f'VAPID_PRIVATE_KEY={vapid_key.private_key}'))
            self.stdout.write(self.style.WARNING('Add these keys to your .env file'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error generating VAPID keys: {str(e)}'))
