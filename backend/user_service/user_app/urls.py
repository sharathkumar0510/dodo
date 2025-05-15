from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerRegistrationView,
    VendorRegistrationView,
    AdminRegistrationView,
    UserViewSet,
    CustomerProfileViewSet,
    VendorProfileViewSet,
    AdminProfileViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'customer-profiles', CustomerProfileViewSet)
router.register(r'vendor-profiles', VendorProfileViewSet)
router.register(r'admin-profiles', AdminProfileViewSet)

urlpatterns = [
    path('register/customer/', CustomerRegistrationView.as_view(), name='customer-registration'),
    path('register/vendor/', VendorRegistrationView.as_view(), name='vendor-registration'),
    path('register/admin/', AdminRegistrationView.as_view(), name='admin-registration'),
    path('', include(router.urls)),
]
