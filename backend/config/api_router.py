from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from backend.users.api.views import UserViewSet
from backend.users.api.views import UserViewSet
from backend.catalog.views import ProductViewSet, StoreViewSet, BannerViewSet, CategoryViewSet

from backend.orders.views import OrderViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register("products", ProductViewSet)
router.register("stores", StoreViewSet)
router.register("banners", BannerViewSet)
router.register("categories", CategoryViewSet, basename="categories")

router.register("orders", OrderViewSet, basename="orders")

app_name = "api"
urlpatterns = router.urls
