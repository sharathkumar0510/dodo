from django.db import models
from django.utils.translation import gettext_lazy as _


class Permission(models.Model):
    """
    Permission model for defining granular permissions in the system.
    """
    name = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    """
    Role model for defining roles with specific permissions.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField(Permission, related_name='roles')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Role')
        verbose_name_plural = _('Roles')

    def __str__(self):
        return self.name


class AdminRole(models.Model):
    """
    Links an admin user to a specific role.
    """
    user = models.OneToOneField('user_app.User', on_delete=models.CASCADE, related_name='admin_role')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='admin_users')
    assigned_by = models.ForeignKey('user_app.User', on_delete=models.SET_NULL, null=True, related_name='assigned_roles')
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.role}"
