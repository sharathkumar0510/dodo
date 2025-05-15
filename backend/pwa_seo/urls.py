from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PushSubscriptionViewSet, OfflineActionViewSet, SEOMetadataViewSet,
    ManifestView, ServiceWorkerView, WebPushConfigView,
    robots_txt, sitemap_xml
)
from .views_health import health_check

router = DefaultRouter()
router.register(r'push-subscriptions', PushSubscriptionViewSet, basename='push-subscription')
router.register(r'offline-actions', OfflineActionViewSet, basename='offline-action')
router.register(r'seo-metadata', SEOMetadataViewSet, basename='seo-metadata')

urlpatterns = [
    path('api/', include(router.urls)),

    # PWA endpoints
    path('manifest.json', ManifestView.as_view(), name='manifest'),
    path('<str:app_type>/manifest.json', ManifestView.as_view(), name='app-manifest'),
    path('sw-config.json', ServiceWorkerView.as_view(), name='service-worker-config'),
    path('<str:app_type>/sw-config.json', ServiceWorkerView.as_view(), name='app-service-worker-config'),
    path('webpush-config.json', WebPushConfigView.as_view(), name='webpush-config'),

    # SEO endpoints
    path('robots.txt', robots_txt, name='robots-txt'),
    path('<str:app_type>/robots.txt', robots_txt, name='app-robots-txt'),
    path('sitemap.xml', sitemap_xml, name='sitemap-xml'),

    # Health check endpoint
    path('api/health-check', health_check, name='health-check'),
]
