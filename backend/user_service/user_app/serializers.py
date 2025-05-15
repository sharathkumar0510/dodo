from rest_framework import serializers
from .models import User, CustomerProfile, VendorProfile, AdminProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'mobile', 'email', 'first_name', 'last_name', 'user_type', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = ['id', 'user', 'address', 'profile_picture', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class VendorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = VendorProfile
        fields = ['id', 'user', 'business_name', 'business_address', 'service_areas', 
                  'profile_picture', 'is_verified', 'created_at', 'updated_at']
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']


class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = ['id', 'user', 'department', 'profile_picture', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    address = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False)
    
    class Meta:
        model = User
        fields = ['mobile', 'email', 'first_name', 'last_name', 'address', 'profile_picture']
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }
    
    def create(self, validated_data):
        address = validated_data.pop('address', '')
        profile_picture = validated_data.pop('profile_picture', None)
        
        validated_data['user_type'] = 'customer'
        user = User.objects.create(**validated_data)
        
        # Create customer profile
        profile = CustomerProfile.objects.create(
            user=user,
            address=address,
            profile_picture=profile_picture
        )
        
        return user


class VendorRegistrationSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(required=True)
    business_address = serializers.CharField(required=True)
    service_areas = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False)
    
    class Meta:
        model = User
        fields = ['mobile', 'email', 'first_name', 'last_name', 
                  'business_name', 'business_address', 'service_areas', 'profile_picture']
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def create(self, validated_data):
        business_name = validated_data.pop('business_name')
        business_address = validated_data.pop('business_address')
        service_areas = validated_data.pop('service_areas', '')
        profile_picture = validated_data.pop('profile_picture', None)
        
        validated_data['user_type'] = 'vendor'
        user = User.objects.create(**validated_data)
        
        # Create vendor profile
        profile = VendorProfile.objects.create(
            user=user,
            business_name=business_name,
            business_address=business_address,
            service_areas=service_areas,
            profile_picture=profile_picture
        )
        
        return user


class AdminRegistrationSerializer(serializers.ModelSerializer):
    department = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False)
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'department', 'profile_picture']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def create(self, validated_data):
        department = validated_data.pop('department', '')
        profile_picture = validated_data.pop('profile_picture', None)
        password = validated_data.pop('password')
        
        validated_data['user_type'] = 'admin'
        validated_data['is_active'] = False  # Admin needs to be activated by super admin
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        
        # Create admin profile
        profile = AdminProfile.objects.create(
            user=user,
            department=department,
            profile_picture=profile_picture
        )
        
        return user
