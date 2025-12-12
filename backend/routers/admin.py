from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, Product, Order, OrderItem
from schemas import ProductCreate, ProductUpdate
from schemas import Product as ProductSchema, AdminStats, Order as OrderSchema, User as UserSchema
from routers.auth import get_current_user
from pydantic import BaseModel
import crud

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

# --- Admin Dependency ---
def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access admin panel",
        )
    return current_user

# --- Schemas (Local for now if not in schemas.py) ---

class OrderUpdate(BaseModel):
    status: str

class UserUpdate(BaseModel):
    is_admin: Optional[int] = None
    is_active: Optional[int] = None

class UserCreateAdmin(BaseModel):
    email: str
    password: str
    full_name: str
    is_admin: int = 0

# --- Endpoints ---

@router.get("/stats", response_model=AdminStats)
def get_admin_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    total_sales = db.query(Order).with_entities(Order.total_amount).all()
    total_sales_sum = sum([amount[0] for amount in total_sales if amount[0]])
    
    total_orders = db.query(Order).count()
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    
    return {
        "total_sales": total_sales_sum,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_products": total_products
    }

@router.get("/products", response_model=List[ProductSchema])
def get_admin_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@router.post("/products", response_model=ProductSchema)
def create_product(product: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/products/{product_id}", response_model=ProductSchema)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product.dict(exclude_unset=True).items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}

@router.get("/orders", response_model=List[OrderSchema])
def get_admin_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    orders = db.query(Order).offset(skip).limit(limit).all()
    return orders

@router.put("/orders/{order_id}", response_model=OrderSchema)
def update_order_status(order_id: int, order_update: OrderUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_order.status = order_update.status
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/users")
def get_admin_users(
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    role: Optional[int] = None,
    is_active: Optional[int] = None,
    sort_by: Optional[str] = "id",
    sort_order: Optional[str] = "asc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    query = db.query(User)

    # Filtering
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_filter)) | 
            (User.email.ilike(search_filter))
        )
    
    if role is not None:
        query = query.filter(User.is_admin == role)
        
    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    # Sorting
    if sort_by:
        # Validate sort_by field to prevent injection or errors
        valid_sort_fields = ["id", "full_name", "email", "is_admin", "is_active"]
        if sort_by in valid_sort_fields:
            column = getattr(User, sort_by)
            if sort_order == "desc":
                query = query.order_by(column.desc())
            else:
                query = query.order_by(column.asc())
        else:
             # Default sort
            query = query.order_by(User.id.asc())
    else:
        query = query.order_by(User.id.asc())

    # Pagination
    total = query.count()
    users = query.offset(skip).limit(limit).all()
    
    return {"users": users, "total": total}

@router.post("/users", response_model=UserSchema)
def create_user_admin(user: UserCreateAdmin, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Use crud.create_user to handle Supabase registration
    # Validating schema conversion (UserCreateAdmin -> UserCreate)
    # UserCreate needs email, fullname, password. UserCreateAdmin has them.
    from schemas import UserCreate
    user_create = UserCreate(
        email=user.email,
        password=user.password,
        full_name=user.full_name
    )
    
    try:
        db_user = crud.create_user(db, user_create)
        
        # Update admin status
        db_user.is_admin = user.is_admin
        db_user.is_active = 1
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.is_admin is not None:
        db_user.is_admin = user_update.is_admin
    if user_update.is_active is not None:
        db_user.is_active = user_update.is_active
        
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted"}
