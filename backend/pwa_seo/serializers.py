from rest_framework import serializers
from .models import PushSubscription, OfflineAction, SEOMetadata, Sitemap


class PushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushSubscription
        fields = ['id', 'endpoint', 'p256dh', 'auth', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class OfflineActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfflineAction
        fields = ['id', 'action_type', 'resource_type', 'resource_id', 'data', 'created_at', 'synced', 'synced_at']
        read_only_fields = ['id', 'created_at', 'synced', 'synced_at']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class SEOMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOMetadata
        fields = [
            'id', 'page_type', 'page_identifier', 'title', 'description', 'keywords',
            'canonical_url', 'og_title', 'og_description', 'og_image',
            'twitter_title', 'twitter_description', 'twitter_image',
            'structured_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SitemapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sitemap
        fields = ['id', 'url', 'priority', 'changefreq', 'last_modified']
        read_only_fields = ['id', 'last_modified']


class ManifestSerializer(serializers.Serializer):
    """Serializer for generating the web app manifest."""
    name = serializers.CharField(max_length=255)
    short_name = serializers.CharField(max_length=255)
    description = serializers.CharField(max_length=500)
    start_url = serializers.CharField(max_length=255)
    display = serializers.CharField(max_length=50)
    background_color = serializers.CharField(max_length=20)
    theme_color = serializers.CharField(max_length=20)
    orientation = serializers.CharField(max_length=20)
    icons = serializers.ListField(child=serializers.DictField())
    scope = serializers.CharField(max_length=255)
    dir = serializers.CharField(max_length=10)
    lang = serializers.CharField(max_length=10)


class ServiceWorkerSerializer(serializers.Serializer):
    """Serializer for generating the service worker configuration."""
    cache_name = serializers.CharField(max_length=255)
    urls_to_cache = serializers.ListField(child=serializers.CharField(max_length=500))
    offline_page = serializers.CharField(max_length=255)
    cache_version = serializers.IntegerField()


class WebPushSerializer(serializers.Serializer):
    """Serializer for web push configuration."""
    public_key = serializers.CharField(max_length=255)
