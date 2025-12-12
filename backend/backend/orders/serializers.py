from rest_framework import serializers
from .models import Order, OrderItem
from backend.catalog.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_details", "title", "quantity", "price"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "user_email", "items", "total_amount",
            "status", "shipping_address", "created_at", "updated_at"
        ]
        read_only_fields = ["user", "created_at", "updated_at"]
    
    def create(self, validated_data):
        # Logic to handle order creation will go here (usually involving populating items)
        # For now, standard creation
        return super().create(validated_data)
