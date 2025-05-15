"""
URL configuration for dodo_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.documentation import include_docs_urls

API_TITLE = 'Dodo Home Services API'
API_DESCRIPTION = 'API for Dodo Home Services Platform'

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Documentation
    path('docs/', include_docs_urls(title=API_TITLE, description=API_DESCRIPTION)),

    # Auth Service
    path('api/auth/', include('auth_service.auth_app.urls')),

    # User Service
    path('api/users/', include('user_service.user_app.urls')),

    # Roles
    path('api/roles/', include('roles.roles_app.urls')),

    # Core
    path('api/core/', include('core.core_app.urls')),

    # PWA and SEO
    path('', include('pwa_seo.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
