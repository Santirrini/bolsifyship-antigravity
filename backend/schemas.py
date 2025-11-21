from pydantic import BaseModel
from typing import Optional, List

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

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class CartItemCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1

class WishlistItemCreate(BaseModel):
    user_id: int
    product_id: int

class User(UserBase):
    id: int
    is_active: int
    is_admin: int = 0

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Category(BaseModel):
    name: str
    image: Optional[str] = None

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
    payment_token: str # Token from PSP (e.g., "tok_visa_123")

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

class PaymentMethodBase(BaseModel):
    card_type: str
    last_four: str
    expiry_date: str
from pydantic import BaseModel
from typing import Optional, List

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

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class CartItemCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1

class WishlistItemCreate(BaseModel):
    user_id: int
    product_id: int

class User(UserBase):
    id: int
    is_active: int
    is_admin: int = 0

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Category(BaseModel):
    name: str
    image: Optional[str] = None

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
    payment_token: str # Token from PSP (e.g., "tok_visa_123")

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

class BannerBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    highlight_text: Optional[str] = None
    description: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    position: str = "hero"
    is_active: int = 1
    order: int = 0

class BannerCreate(BannerBase):
    pass

class BannerUpdate(BannerBase):
    pass

class BannerResponse(BannerBase):
    id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
