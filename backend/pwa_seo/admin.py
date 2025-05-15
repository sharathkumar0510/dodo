from django.contrib import admin
from .models import PushSubscription, OfflineAction, SEOMetadata, Sitemap


@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'endpoint_truncated', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__email', 'user__mobile', 'endpoint')
    readonly_fields = ('created_at', 'updated_at')

    def endpoint_truncated(self, obj):
        return obj.endpoint[:50] + '...' if len(obj.endpoint) > 50 else obj.endpoint

    endpoint_truncated.short_description = 'Endpoint'


@admin.register(OfflineAction)
class OfflineActionAdmin(admin.ModelAdmin):
    list_display = ('user', 'action_type', 'resource_type', 'resource_id', 'created_at', 'synced', 'synced_at')
    list_filter = ('action_type', 'resource_type', 'synced', 'created_at', 'synced_at')
    search_fields = ('user__email', 'user__mobile', 'resource_type', 'resource_id')
    readonly_fields = ('created_at', 'synced_at')


@admin.register(SEOMetadata)
class SEOMetadataAdmin(admin.ModelAdmin):
    list_display = ('page_type', 'page_identifier', 'title', 'created_at', 'updated_at')
    list_filter = ('page_type', 'created_at', 'updated_at')
    search_fields = ('page_type', 'page_identifier', 'title', 'description', 'keywords')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('page_type', 'page_identifier', 'title', 'description', 'keywords', 'canonical_url')
        }),
        ('Open Graph', {
            'fields': ('og_title', 'og_description', 'og_image')
        }),
        ('Twitter', {
            'fields': ('twitter_title', 'twitter_description', 'twitter_image')
        }),
        ('Structured Data', {
            'fields': ('structured_data',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Sitemap)
class SitemapAdmin(admin.ModelAdmin):
    list_display = ('url', 'priority', 'changefreq', 'last_modified')
    list_filter = ('priority', 'changefreq', 'last_modified')
    search_fields = ('url',)
    readonly_fields = ('last_modified',)
