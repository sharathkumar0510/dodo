from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import json
import logging

from .models import OTP
from .serializers import (
    SendOTPSerializer,
    VerifyOTPSerializer,
    AdminLoginSerializer,
    TokenRefreshSerializer,
    UserTypeSerializer
)
from user_service.user_app.models import User, CustomerProfile, VendorProfile

logger = logging.getLogger(__name__)


class SendOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            mobile = serializer.validated_data['mobile']

            # Generate OTP
            otp_obj = OTP.generate_otp(mobile)

            # Send OTP via MSG91
            try:
                self.send_otp_via_msg91(mobile, otp_obj.otp)
                return Response({
                    'message': 'OTP sent successfully',
                    'mobile': mobile
                }, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Error sending OTP: {str(e)}")
                return Response({
                    'error': 'Failed to send OTP',
                    'details': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_otp_via_msg91(self, mobile, otp):
        """Send OTP using MSG91 API"""
        url = "https://api.msg91.com/api/v5/otp"

        # Remove country code if present
        if mobile.startswith('+'):
            mobile = mobile[1:]

        # Extract country code (default to India: 91)
        country_code = '91'
        if len(mobile) > 10:
            country_code = mobile[:-10]
            mobile = mobile[-10:]

        payload = {
            "template_id": settings.MSG91_TEMPLATE_ID,
            "mobile": f"{country_code}{mobile}",
            "authkey": settings.MSG91_AUTH_KEY,
            "otp": otp,
            "sender": settings.MSG91_SENDER_ID
        }

        headers = {
            "Content-Type": "application/json"
        }

        response = requests.post(url, data=json.dumps(payload), headers=headers)

        if response.status_code != 200:
            raise Exception(f"MSG91 API error: {response.text}")

        return response.json()


class VerifyOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            mobile = serializer.validated_data['mobile']
            otp = serializer.validated_data['otp']

            # Verify OTP
            if OTP.verify_otp(mobile, otp):
                # Check if user exists
                try:
                    user = User.objects.get(mobile=mobile)
                    # User exists, generate tokens
                    refresh = RefreshToken.for_user(user)

                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user_type': user.user_type,
                        'is_new_user': False
                    }, status=status.HTTP_200_OK)
                except User.DoesNotExist:
                    # User doesn't exist, return success but indicate new user
                    return Response({
                        'message': 'OTP verified successfully',
                        'mobile': mobile,
                        'is_new_user': True
                    }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid OTP or OTP expired'
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(email=email, password=password)

            if user is not None and user.user_type == 'admin' and user.is_active:
                refresh = RefreshToken.for_user(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_type': user.user_type
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials or inactive account'
                }, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        if serializer.is_valid():
            try:
                refresh = RefreshToken(serializer.validated_data['refresh'])

                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    'error': 'Invalid refresh token',
                    'details': str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
