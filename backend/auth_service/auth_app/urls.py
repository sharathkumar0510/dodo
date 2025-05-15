from django.urls import path
from .views import SendOTPView, VerifyOTPView, AdminLoginView, TokenRefreshView

urlpatterns = [
    path('otp/send/', SendOTPView.as_view(), name='send-otp'),
    path('otp/verify/', VerifyOTPView.as_view(), name='verify-otp'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
