from pydantic import BaseModel
from typing import Optional, List

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    category: str
    rating: float = 0.0
    reviews: int = 0
    source: str = "internal"
    image: Optional[str] = None
    season: Optional[str] = None
    sales_count: int = 0
    store_id: Optional[int] = None
    stock: int = 0
    is_active: int = 1
    sku: Optional[str] = None
    images: Optional[List[str]] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    source: Optional[str] = None
    image: Optional[str] = None
    season: Optional[str] = None
    sales_count: Optional[int] = None
    store_id: Optional[int] = None
    stock: Optional[int] = None
    is_active: Optional[int] = None
    sku: Optional[str] = None

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    is_active: int
    is_admin: int = 0
    role: str = "customer"

    class Config:
        from_attributes = True

# --- Store Schemas ---
class StoreBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    category: Optional[str] = None

class StoreCreate(StoreBase):
    pass

class Store(StoreBase):
    id: int
    owner_id: int
    rating: float = 0.0
    response_rate: int = 100
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class StoreFollow(BaseModel):
    id: int
    user_id: int
    store_id: int
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class ProductDetail(Product):
    store: Optional[Store] = None

class SellerOnboardingRequest(BaseModel):
    user: UserCreate
    store: StoreCreate

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Other Schemas ---
class Category(BaseModel):
    name: str
    image: Optional[str] = None

class CartItemCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1

class WishlistItemCreate(BaseModel):
    user_id: int
    product_id: int

# --- Order Schemas ---
class OrderItem(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str
    payment_token: str # Token from PSP

class Order(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: Optional[str] = None
    shipping_address: Optional[str] = None

    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_sales: float
    total_orders: int
    total_users: int
    total_products: int

# --- Address Schemas ---
class AddressBase(BaseModel):
    full_name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    zip_code: str
    country: str
    phone: str
    is_default: int = 0

class AddressCreate(AddressBase):
    pass

class AddressUpdate(AddressBase):
    pass

class Address(AddressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# --- Payment Method Schemas ---
class PaymentMethodBase(BaseModel):
    card_type: str
    last_four: str
    expiry_date: str
    card_holder: str
    is_default: int = 0

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethod(PaymentMethodBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# --- Banner Schemas ---
class BannerBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    highlight_text: Optional[str] = None
    description: Optional[str] = None
    image_url: str
    image_mobile: Optional[str] = None
    link_url: Optional[str] = None
    action_type: str = "url"
    action_value: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    position: str = "hero"
    is_active: int = 1
    order: int = 0
    views: int = 0
    clicks: int = 0

class BannerCreate(BannerBase):
    pass

class BannerUpdate(BannerBase):
    pass

class BannerResponse(BannerBase):
    id: int

    class Config:
        from_attributes = True
