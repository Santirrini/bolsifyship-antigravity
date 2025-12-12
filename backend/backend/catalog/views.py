from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Store, Banner
from .serializers import ProductSerializer, StoreSerializer, BannerSerializer

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "category"]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "store", "is_active", "season"]
    search_fields = ["name", "description", "sku"]
    ordering_fields = ["price", "rating", "created_at"]

    @action(detail=False, methods=["GET"], url_path="my_products")
    def my_products(self, request):
        """
        Return products belonging to the stores owned by the current user.
        """
        if not request.user.is_authenticated:
             return viewsets.Response(status=401)
        
        # Filter products where the store's owner is the current user
        queryset = self.filter_queryset(self.get_queryset()).filter(store__owner=request.user)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return viewsets.Response(serializer.data)

class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Banner.objects.filter(is_active=True).order_by("order")
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CategoryViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing categories based on existing products.
    """
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        # Get unique categories from active products
        categories = Product.objects.filter(is_active=True).values_list('category', flat=True).distinct()
        
        data = []
        for category_name in categories:
            if not category_name:
                continue
                
            # Find a representative product for the image
            product = Product.objects.filter(category=category_name, is_active=True, image__isnull=False).first()
            
            image_url = None
            if product:
                # Use the ProductSerializer logic to get the absolute URL effectively
                # or just do a simple check since we are inside the view
                if product.image:
                    try:
                        image_url = request.build_absolute_uri(product.image.url)
                    except:
                        image_url = None
            
            data.append({
                "name": category_name,
                "image": image_url
            })
            
        return Response(data)

