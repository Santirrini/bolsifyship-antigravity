from django.contrib import admin
from .models import Product, Store, Banner

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "category", "rating", "created_at"]
    search_fields = ["name", "owner__email"]
    list_filter = ["category", "created_at"]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "category", "store", "stock", "is_active"]
    search_fields = ["name", "sku", "store__name"]
    list_filter = ["is_active", "category", "created_at"]
    list_editable = ["price", "stock", "is_active"]

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ["title", "position", "start_date", "end_date", "is_active", "order"]
    list_editable = ["is_active", "order"]
