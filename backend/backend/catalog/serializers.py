from rest_framework import serializers
from django.conf import settings

from .models import Product, Store, Banner

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"
        read_only_fields = ["rating", "created_at"]

class ProductSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source="store.name", read_only=True)
    images = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "price", "discount_price",
            "category", "rating", "reviews_count", "image", "season",
            "sales_count", "store", "store_name", "stock", "is_active",
            "sku", "images", "created_at"
        ]
        read_only_fields = ["rating", "reviews_count", "sales_count", "created_at"]

    def get_image(self, obj):
        """
        Returns the image URL. If the stored image path is an external URL,
        return it directly. Otherwise, build the full media URL.
        """
        if not obj.image:
            return None
        
        # Get the stored image name/path
        image_path = str(obj.image.name) if hasattr(obj.image, 'name') else str(obj.image)
        
        # If it's already an absolute URL, return it directly
        if image_path.startswith("http://") or image_path.startswith("https://"):
            return image_path
        
        # For local files, build the absolute URL
        request = self.context.get("request")
        if request and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        
        return None


    def get_images(self, obj):
        if not obj.images:
            return []
        
        request = self.context.get("request")
        if not request:
            return obj.images
            
        urls = []
        for img_path in obj.images:
            if not img_path:
                continue
            
            # If it's already an absolute URL, leave it alone
            if img_path.startswith("http://") or img_path.startswith("https://"):
                urls.append(img_path)
                continue
                
            # Construct the relative media URL
            # If stored as "products/foo.jpg", become "/media/products/foo.jpg"
            if not img_path.startswith(settings.MEDIA_URL) and not img_path.startswith("/"):
                # Clean path interaction
                url_path = f"{settings.MEDIA_URL}{img_path}"
            else:
                url_path = img_path
                
            urls.append(request.build_absolute_uri(url_path))
            
        return urls

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"
