from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class PushSubscription(models.Model):
    """Model to store push notification subscriptions."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='push_subscriptions')
    endpoint = models.URLField(max_length=500)
    p256dh = models.CharField(max_length=255)
    auth = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'endpoint')
        verbose_name = 'Push Subscription'
        verbose_name_plural = 'Push Subscriptions'

    def __str__(self):
        return f"{self.user.email or self.user.mobile} - {self.endpoint[:30]}..."


class OfflineAction(models.Model):
    """Model to store actions performed offline that need to be synced."""
    ACTION_TYPES = (
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offline_actions')
    action_type = models.CharField(max_length=10, choices=ACTION_TYPES)
    resource_type = models.CharField(max_length=50)  # e.g., 'booking', 'service', etc.
    resource_id = models.CharField(max_length=50, null=True, blank=True)  # Null for create actions
    data = models.JSONField()  # The data to be synced
    created_at = models.DateTimeField(auto_now_add=True)
    synced = models.BooleanField(default=False)
    synced_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Offline Action'
        verbose_name_plural = 'Offline Actions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action_type} {self.resource_type} by {self.user.email or self.user.mobile}"


class SEOMetadata(models.Model):
    """Model to store SEO metadata for different pages."""
    PAGE_TYPES = (
        ('home', 'Home Page'),
        ('service', 'Service Page'),
        ('category', 'Category Page'),
        ('blog', 'Blog Page'),
        ('blog_post', 'Blog Post'),
        ('about', 'About Page'),
        ('contact', 'Contact Page'),
        ('faq', 'FAQ Page'),
        ('terms', 'Terms Page'),
        ('privacy', 'Privacy Page'),
        ('custom', 'Custom Page'),
    )

    page_type = models.CharField(max_length=20, choices=PAGE_TYPES)
    page_identifier = models.CharField(max_length=255, null=True, blank=True)  # For specific pages like blog posts
    title = models.CharField(max_length=70)  # SEO best practice: 50-60 characters
    description = models.TextField(max_length=160)  # SEO best practice: 150-160 characters
    keywords = models.CharField(max_length=255, null=True, blank=True)
    canonical_url = models.URLField(max_length=500, null=True, blank=True)
    og_title = models.CharField(max_length=70, null=True, blank=True)
    og_description = models.TextField(max_length=200, null=True, blank=True)
    og_image = models.ImageField(upload_to='seo/og_images/', null=True, blank=True)
    twitter_title = models.CharField(max_length=70, null=True, blank=True)
    twitter_description = models.TextField(max_length=200, null=True, blank=True)
    twitter_image = models.ImageField(upload_to='seo/twitter_images/', null=True, blank=True)
    structured_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'SEO Metadata'
        verbose_name_plural = 'SEO Metadata'
        unique_together = ('page_type', 'page_identifier')

    def __str__(self):
        if self.page_identifier:
            return f"{self.get_page_type_display()} - {self.page_identifier}"
        return self.get_page_type_display()


class Sitemap(models.Model):
    """Model to store sitemap entries."""
    url = models.URLField(max_length=500, unique=True)
    priority = models.DecimalField(max_digits=2, decimal_places=1, default=0.5)
    changefreq = models.CharField(
        max_length=10,
        choices=(
            ('always', 'Always'),
            ('hourly', 'Hourly'),
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
            ('never', 'Never'),
        ),
        default='monthly'
    )
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Sitemap Entry'
        verbose_name_plural = 'Sitemap Entries'

    def __str__(self):
        return self.url
