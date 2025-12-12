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
        read_only_fields = ["user", "created_at", "updated_at", "total_amount"]
    
    
    def create(self, validated_data):
        items_data = self.initial_data.get('items', [])
        
        # Calculate total amount from items
        total_amount = sum(
            float(item.get('price', 0)) * int(item.get('quantity', 1)) 
            for item in items_data
        )
        validated_data['total_amount'] = total_amount

        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
