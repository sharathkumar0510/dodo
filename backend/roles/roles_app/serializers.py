from rest_framework import serializers
from .models import Permission, Role, AdminRole
from user_service.user_app.serializers import UserSerializer
from user_service.user_app.models import User


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'description']
        read_only_fields = ['id']


class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_ids', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        permission_ids = validated_data.pop('permission_ids', [])
        role = Role.objects.create(**validated_data)

        if permission_ids:
            role.permissions.set(permission_ids)

        return role

    def update(self, instance, validated_data):
        permission_ids = validated_data.pop('permission_ids', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if permission_ids is not None:
            instance.permissions.set(permission_ids)

        instance.save()
        return instance


class AdminRoleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    assigned_by = UserSerializer(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(user_type='admin'),
        write_only=True
    )
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        write_only=True
    )

    class Meta:
        model = AdminRole
        fields = ['id', 'user', 'role', 'assigned_by', 'user_id', 'role_id', 'assigned_at', 'updated_at']
        read_only_fields = ['id', 'assigned_at', 'updated_at']

    def create(self, validated_data):
        user = validated_data.pop('user_id')
        role = validated_data.pop('role_id')
        assigned_by = self.context['request'].user

        admin_role = AdminRole.objects.create(
            user=user,
            role=role,
            assigned_by=assigned_by,
            **validated_data
        )

        return admin_role
