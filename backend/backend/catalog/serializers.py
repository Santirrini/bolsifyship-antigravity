from rest_framework import serializers
from .models import Product, Store, Banner

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"
        read_only_fields = ["rating", "created_at"]

class ProductSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source="store.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "price", "discount_price",
            "category", "rating", "reviews_count", "image", "season",
            "sales_count", "store", "store_name", "stock", "is_active",
            "sku", "images", "created_at"
        ]
        read_only_fields = ["rating", "reviews_count", "sales_count", "created_at"]

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"
