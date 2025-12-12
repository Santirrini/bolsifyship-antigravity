from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import models, schemas

from supabase_client import supabase



def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Register with Supabase
    try:
        # Note: If called from outside (no request context), we might not want to sign in?
        # But sign_up signs in by default.
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        
        if not auth_response.user:
             # If user exists in supabase but not local validation caught it?
             raise Exception("Supabase registration failed")

        db_user = models.User(
            email=user.email,
            full_name=user.full_name,
            supabase_user_id=auth_response.user.id,
            hashed_password=None # Not storing local password anymore
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        print(f"Error creating user: {e}")
        # If duplicated, usually get_user_by_email catches it first, 
        # but race conditions or out-of-sync DBs exist.
        raise e

def create_seller_and_store(db: Session, user: schemas.UserCreate, store: schemas.StoreCreate):
    try:
        # 1. Register with Supabase
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        
        if not auth_response.user:
             raise Exception("Supabase registration failed")

        db_user = models.User(
            email=user.email,
            full_name=user.full_name,
            supabase_user_id=auth_response.user.id,
            hashed_password=None,
            role="seller"
        )
        db.add(db_user)
        db.flush() # Get ID
        
        # 2. Create Store
        db_store = models.Store(
            name=store.name,
            description=store.description,
            logo_url=store.logo_url,
            owner_id=db_user.id,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(db_store)
        
        # 3. Commit
        db.commit()
        db.refresh(db_user)
        db.refresh(db_store)
        return db_user, db_store

    except Exception as e:
        db.rollback()
        print(f"Error creating seller and store: {e}")
        raise e

def get_products(
    db: Session, 
    query: Optional[str] = None, 
    category: Optional[str] = None, 
    min_price: Optional[float] = None, 
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = None,
    on_sale: bool = False,
    store_id: Optional[int] = None
):
    db_query = db.query(models.Product)
    
    if query:
        db_query = db_query.filter(models.Product.name.contains(query))
    
    if category:
        db_query = db_query.filter(models.Product.category == category)
        
    if min_price is not None:
        db_query = db_query.filter(models.Product.price >= min_price)
        
    if max_price is not None:
        db_query = db_query.filter(models.Product.price <= max_price)
        
    if min_rating is not None:
        db_query = db_query.filter(models.Product.rating >= min_rating)
        
    if on_sale:
        db_query = db_query.filter(models.Product.discount_price.isnot(None))

    if store_id is not None:
        db_query = db_query.filter(models.Product.store_id == store_id)
        
    # Sorting
    if sort_by == "price_asc":
        db_query = db_query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        db_query = db_query.order_by(models.Product.price.desc())
    elif sort_by == "rating_desc":
        db_query = db_query.order_by(models.Product.rating.desc())
        
    return db_query.all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        discount_price=product.discount_price,
        category=product.category,
        rating=product.rating,
        reviews=product.reviews,
        source=product.source,
        image=product.image
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_categories(db: Session):
    return db.query(models.Product.category, models.Product.image).group_by(models.Product.category).all()
