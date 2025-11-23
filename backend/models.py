from sqlalchemy import Column, Integer, String, Float
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    price = Column(Float, index=True) # Changed to Float for easier filtering
    discount_price = Column(Float, nullable=True)
    category = Column(String, index=True)
    rating = Column(Float, default=0.0, index=True, nullable=False)
    reviews = Column(Integer, default=0, nullable=False)
    source = Column(String)
    image = Column(String, nullable=True)
    season = Column(String, nullable=True, index=True) # "christmas", "halloween", "summer", etc.
    sales_count = Column(Integer, default=0, index=True) # To track popularity/clearance status
    store_id = Column(Integer, index=True, nullable=True) # Null for internal products
    stock = Column(Integer, default=0) # New: Inventory count
    is_active = Column(Integer, default=1) # New: 1 for active, 0 for draft/hidden
    sku = Column(String, nullable=True, index=True) # New: Stock Keeping Unit

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Integer, default=1) # 1 for active, 0 for inactive
    is_admin = Column(Integer, default=0) # 0 for regular user, 1 for admin
    role = Column(String, default="customer") # "admin", "seller", "customer"

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, index=True) # User ID of the seller
    logo_url = Column(String, nullable=True)
    banner_url = Column(String, nullable=True) # New: Store banner
    category = Column(String, index=True, nullable=True) # New: Main category (e.g., "Technology", "Fashion")
    rating = Column(Float, default=0.0, index=True) # New: Average rating
    response_rate = Column(Integer, default=100) # New: Response rate percentage
    created_at = Column(String) # ISO format

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # For simplicity, not using ForeignKey constraint yet to avoid migration issues if users table is empty/different
    product_id = Column(Integer, index=True)
    quantity = Column(Integer, default=1)

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    product_id = Column(Integer, index=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    total_amount = Column(Float)
    status = Column(String, default="pending") # pending, processing, shipped, delivered, cancelled
    created_at = Column(String) # ISO format date string
    shipping_address = Column(String)

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, index=True)
    product_id = Column(Integer, index=True)
    quantity = Column(Integer)
    price = Column(Float) # Price at the time of purchase


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    full_name = Column(String)
    address_line1 = Column(String)
    address_line2 = Column(String, nullable=True)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    country = Column(String)
    phone = Column(String)
    is_default = Column(Integer, default=0)

class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    card_type = Column(String) # Visa, Mastercard, etc.
    last_four = Column(String)
    expiry_date = Column(String) # MM/YY
    card_holder = Column(String)
    is_default = Column(Integer, default=0)

class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subtitle = Column(String, nullable=True)
    highlight_text = Column(String, nullable=True)
    description = Column(String, nullable=True)
    image_url = Column(String)
    image_mobile = Column(String, nullable=True) # New: Mobile specific image
    link_url = Column(String, nullable=True)
    action_type = Column(String, default="url") # "url", "category", "product"
    action_value = Column(String, nullable=True) # The URL, category ID, or product ID
    start_date = Column(String, nullable=True) # ISO format
    end_date = Column(String, nullable=True) # ISO format
    views = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    position = Column(String, default="hero") # "hero", "home_middle", etc.
    is_active = Column(Integer, default=1)
    order = Column(Integer, default=0)

class StoreFollow(Base):
    __tablename__ = "store_follows"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    store_id = Column(Integer, index=True)
    created_at = Column(String) # ISO format

