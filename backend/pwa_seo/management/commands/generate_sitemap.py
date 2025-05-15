from django.core.management.base import BaseCommand
from django.utils import timezone
from pwa_seo.models import Sitemap


class Command(BaseCommand):
    help = 'Generate sitemap entries for the website'

    def handle(self, *args, **options):
        # Clear existing entries
        Sitemap.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Cleared existing sitemap entries'))
        
        # Create base URLs
        base_urls = [
            # Home page
            {'url': 'https://dodoservices.com/', 'priority': 1.0, 'changefreq': 'daily'},
            
            # Authentication pages
            {'url': 'https://dodoservices.com/login', 'priority': 0.8, 'changefreq': 'monthly'},
            {'url': 'https://dodoservices.com/register', 'priority': 0.8, 'changefreq': 'monthly'},
            
            # Service category pages
            {'url': 'https://dodoservices.com/services/cleaning', 'priority': 0.9, 'changefreq': 'weekly'},
            {'url': 'https://dodoservices.com/services/plumbing', 'priority': 0.9, 'changefreq': 'weekly'},
            {'url': 'https://dodoservices.com/services/electrical', 'priority': 0.9, 'changefreq': 'weekly'},
            
            # Information pages
            {'url': 'https://dodoservices.com/about', 'priority': 0.6, 'changefreq': 'monthly'},
            {'url': 'https://dodoservices.com/contact', 'priority': 0.6, 'changefreq': 'monthly'},
            {'url': 'https://dodoservices.com/faq', 'priority': 0.6, 'changefreq': 'monthly'},
            {'url': 'https://dodoservices.com/terms', 'priority': 0.5, 'changefreq': 'monthly'},
            {'url': 'https://dodoservices.com/privacy', 'priority': 0.5, 'changefreq': 'monthly'},
            
            # Blog pages
            {'url': 'https://dodoservices.com/blog', 'priority': 0.8, 'changefreq': 'weekly'},
            {'url': 'https://dodoservices.com/blog/home-cleaning-tips', 'priority': 0.7, 'changefreq': 'monthly'},
            {'url': 'https://dodoservices.com/blog/plumbing-maintenance', 'priority': 0.7, 'changefreq': 'monthly'},
        ]
        
        # Create sitemap entries
        for url_data in base_urls:
            Sitemap.objects.create(
                url=url_data['url'],
                priority=url_data['priority'],
                changefreq=url_data['changefreq'],
                last_modified=timezone.now()
            )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(base_urls)} sitemap entries'))
