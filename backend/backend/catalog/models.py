from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Store(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="stores")
    logo = models.ImageField(upload_to="stores/logos/", null=True, blank=True)
    banner = models.ImageField(upload_to="stores/banners/", null=True, blank=True)
    category = models.CharField(max_length=100, db_index=True, null=True, blank=True)
    rating = models.FloatField(default=0.0, db_index=True)
    response_rate = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Store customization
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    shipping_policy = models.TextField(blank=True)
    return_policy = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=255, db_index=True) # Consider making this a Model
    rating = models.FloatField(default=0.0, db_index=True)
    reviews_count = models.IntegerField(default=0)
    source = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="products/", null=True, blank=True)
    season = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    sales_count = models.IntegerField(default=0, db_index=True)
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")
    stock = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    sku = models.CharField(max_length=100, unique=True, null=True, blank=True, db_index=True)
    images = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Banner(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    highlight_text = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="banners/")
    image_mobile = models.ImageField(upload_to="banners/mobile/", null=True, blank=True)
    link_url = models.CharField(max_length=500, blank=True)
    action_type = models.CharField(max_length=50, default="url", choices=[("url", "URL"), ("category", "Category"), ("product", "Product")])
    action_value = models.CharField(max_length=255, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    views = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    position = models.CharField(max_length=50, default="hero")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title
