from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceCategoryViewSet,
    ServiceViewSet,
    TaxViewSet,
    PaymentTermViewSet
)

router = DefaultRouter()
router.register(r'categories', ServiceCategoryViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'taxes', TaxViewSet)
router.register(r'payment-terms', PaymentTermViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
