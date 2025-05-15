from rest_framework import serializers
from .models import OTP
from user_service.user_app.models import User


class SendOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)


class VerifyOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})


class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class UserTypeSerializer(serializers.Serializer):
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES)
