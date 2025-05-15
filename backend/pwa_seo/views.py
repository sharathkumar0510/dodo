from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_GET
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PushSubscription, OfflineAction, SEOMetadata, Sitemap
from .serializers import (
    PushSubscriptionSerializer, OfflineActionSerializer, SEOMetadataSerializer,
    SitemapSerializer, ManifestSerializer, ServiceWorkerSerializer, WebPushSerializer
)


class PushSubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing push subscriptions."""
    serializer_class = PushSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PushSubscription.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class OfflineActionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing offline actions."""
    serializer_class = OfflineActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OfflineAction.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def sync(self, request):
        """Sync all pending offline actions."""
        actions = OfflineAction.objects.filter(user=request.user, synced=False)

        # Process each action
        for action in actions:
            # Here you would implement the logic to process each action type
            # For example, if action.action_type == 'create' and action.resource_type == 'booking'
            # you would create a new booking using action.data

            # For now, we'll just mark them as synced
            action.synced = True
            action.synced_at = timezone.now()
            action.save()

        return Response({'status': 'success', 'synced_count': actions.count()})


class SEOMetadataViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for retrieving SEO metadata."""
    serializer_class = SEOMetadataSerializer
    queryset = SEOMetadata.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = SEOMetadata.objects.all()
        page_type = self.request.query_params.get('page_type', None)
        page_identifier = self.request.query_params.get('page_identifier', None)

        if page_type:
            queryset = queryset.filter(page_type=page_type)

        if page_identifier:
            queryset = queryset.filter(page_identifier=page_identifier)

        return queryset


class ManifestView(APIView):
    """View for generating the web app manifest."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, app_type=None):
        """Generate the manifest.json file."""
        if app_type not in ['customer', 'vendor', 'admin']:
            app_type = 'customer'  # Default to customer app

        # Base manifest data
        manifest_data = {
            'name': settings.PWA_APP_NAME,
            'short_name': f"Dodo {app_type.capitalize()}",
            'description': settings.PWA_APP_DESCRIPTION,
            'start_url': settings.PWA_APP_START_URL,
            'display': settings.PWA_APP_DISPLAY,
            'background_color': settings.PWA_APP_BACKGROUND_COLOR,
            'theme_color': settings.PWA_APP_THEME_COLOR,
            'orientation': settings.PWA_APP_ORIENTATION,
            'icons': settings.PWA_APP_ICONS,
            'scope': settings.PWA_APP_SCOPE,
            'dir': settings.PWA_APP_DIR,
            'lang': settings.PWA_APP_LANG,
        }

        # App-specific customizations
        if app_type == 'vendor':
            manifest_data['name'] = 'Dodo Services - Vendor Portal'
            manifest_data['short_name'] = 'Dodo Vendor'
        elif app_type == 'admin':
            manifest_data['name'] = 'Dodo Services - Admin Panel'
            manifest_data['short_name'] = 'Dodo Admin'

        serializer = ManifestSerializer(data=manifest_data)
        serializer.is_valid(raise_exception=True)

        return JsonResponse(serializer.data)


class ServiceWorkerView(APIView):
    """View for generating the service worker configuration."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, app_type=None):
        """Generate the service worker configuration."""
        if app_type not in ['customer', 'vendor', 'admin']:
            app_type = 'customer'  # Default to customer app

        # Base service worker data
        sw_data = {
            'cache_name': f'dodo-{app_type}-cache-v1',
            'urls_to_cache': [
                '/',
                '/offline',
                '/static/css/main.css',
                '/static/js/main.js',
                '/static/images/logo.png',
            ],
            'offline_page': '/offline',
            'cache_version': 1,
        }

        # App-specific customizations
        if app_type == 'customer':
            sw_data['urls_to_cache'].extend([
                '/services',
                '/blog',
                '/contact',
                '/about',
            ])
        elif app_type == 'vendor':
            sw_data['urls_to_cache'].extend([
                '/dashboard',
                '/bookings',
                '/services',
                '/earnings',
            ])
        elif app_type == 'admin':
            sw_data['urls_to_cache'].extend([
                '/dashboard',
                '/users',
                '/services',
                '/bookings',
            ])

        serializer = ServiceWorkerSerializer(data=sw_data)
        serializer.is_valid(raise_exception=True)

        return JsonResponse(serializer.data)


class WebPushConfigView(APIView):
    """View for retrieving web push configuration."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get the VAPID public key for web push."""
        data = {
            'public_key': settings.WEBPUSH_SETTINGS.get('VAPID_PUBLIC_KEY', '')
        }

        serializer = WebPushSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        return JsonResponse(serializer.data)


@require_GET
def robots_txt(request, app_type=None):
    """Generate robots.txt file."""
    if app_type not in ['customer', 'vendor', 'admin']:
        app_type = 'customer'  # Default to customer app

    lines = []

    if app_type == 'customer':
        lines = [
            "# Dodo Services Customer App Robots.txt",
            "# Last updated: " + timezone.now().strftime('%Y-%m-%d'),
            "",
            "# Allow all crawlers",
            "User-agent: *",
            "Allow: /",
            "Disallow: /api/",
            "Disallow: /account/",
            "Disallow: /login",
            "Disallow: /register",
            "Disallow: /offline",
            "Disallow: /_next/",
            "",
            "# Sitemap locations",
            "Sitemap: https://dodoservices.com/sitemap-index.xml",
            "Sitemap: https://dodoservices.com/sitemap.xml",
            "",
            "# Crawl delay for bots",
            "Crawl-delay: 10",
        ]
    else:
        # For vendor and admin apps, disallow all crawling
        lines = [
            f"# Dodo Services {app_type.capitalize()} App Robots.txt",
            "# Last updated: " + timezone.now().strftime('%Y-%m-%d'),
            "",
            "# Disallow all crawlers - This is a private portal",
            "User-agent: *",
            "Disallow: /",
        ]

    return HttpResponse("\n".join(lines), content_type="text/plain")


@require_GET
def sitemap_xml(request):
    """Generate sitemap.xml file."""
    entries = Sitemap.objects.all()

    xml_content = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
        '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"',
        '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"',
        '        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"',
        '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    ]

    for entry in entries:
        xml_content.extend([
            '  <url>',
            f'    <loc>{entry.url}</loc>',
            f'    <lastmod>{entry.last_modified.strftime("%Y-%m-%dT%H:%M:%S+00:00")}</lastmod>',
            f'    <changefreq>{entry.changefreq}</changefreq>',
            f'    <priority>{entry.priority}</priority>',
            '    <mobile:mobile/>',
            '  </url>',
        ])

    xml_content.append('</urlset>')

    return HttpResponse("\n".join(xml_content), content_type="application/xml")
