from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, StoreViewSet, BannerViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"stores", StoreViewSet)
router.register(r"banners", BannerViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
