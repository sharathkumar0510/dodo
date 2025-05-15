from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from .models import User, CustomerProfile, VendorProfile, AdminProfile
from .serializers import (
    UserSerializer,
    CustomerProfileSerializer,
    VendorProfileSerializer,
    AdminProfileSerializer,
    CustomerRegistrationSerializer,
    VendorRegistrationSerializer,
    AdminRegistrationSerializer
)


class CustomerRegistrationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Customer registered successfully',
                'user_id': user.id,
                'mobile': user.mobile,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VendorRegistrationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VendorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Vendor registered successfully',
                'user_id': user.id,
                'mobile': user.mobile,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminRegistrationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Check if the requesting user is a super admin
        if not request.user.is_superuser:
            return Response({
                'error': 'Only super admins can create admin accounts'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = AdminRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Admin registered successfully (pending activation)',
                'user_id': user.id,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Regular users can only see their own profile
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            return User.objects.filter(id=self.request.user.id)
        # Admin users can see all users
        return User.objects.all()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        if not request.user.is_superuser:
            return Response({
                'error': 'Only super admins can activate users'
            }, status=status.HTTP_403_FORBIDDEN)

        user = self.get_object()
        user.is_active = True
        user.save()

        return Response({
            'message': f'User {user.id} activated successfully'
        })

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        if not request.user.is_superuser:
            return Response({
                'error': 'Only super admins can deactivate users'
            }, status=status.HTTP_403_FORBIDDEN)

        user = self.get_object()
        user.is_active = False
        user.save()

        return Response({
            'message': f'User {user.id} deactivated successfully'
        })


class CustomerProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Regular users can only see their own profile
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            return CustomerProfile.objects.filter(user=self.request.user)
        # Admin users can see all profiles
        return CustomerProfile.objects.all()


class VendorProfileViewSet(viewsets.ModelViewSet):
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Regular users can only see their own profile
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            return VendorProfile.objects.filter(user=self.request.user)
        # Admin users can see all profiles
        return VendorProfile.objects.all()

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({
                'error': 'Only admin users can verify vendors'
            }, status=status.HTTP_403_FORBIDDEN)

        profile = self.get_object()
        profile.is_verified = True
        profile.save()

        return Response({
            'message': f'Vendor {profile.id} verified successfully'
        })


class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Regular users can only see their own profile
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            return AdminProfile.objects.filter(user=self.request.user)
        # Admin users can see all profiles
        return AdminProfile.objects.all()
