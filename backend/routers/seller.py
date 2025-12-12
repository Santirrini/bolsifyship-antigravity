from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from database import get_db
from routers.auth import get_current_user
from datetime import timedelta, datetime
import crud

router = APIRouter(
    prefix="/seller",
    tags=["seller"],
    responses={404: {"description": "Not found"}},
)

@router.post("/register", response_model=schemas.Store)
def register_store(store: schemas.StoreCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Check if user already has a store
    existing_store = db.query(models.Store).filter(models.Store.owner_id == current_user.id).first()
    if existing_store:
        raise HTTPException(status_code=400, detail="User already has a store")
    
    from datetime import datetime
    # Create store
    db_store = models.Store(
        **store.dict(), 
        owner_id=current_user.id,
        created_at=datetime.utcnow().isoformat()
    )
    db.add(db_store)
    
    # Update user role to seller
    # Use merge to ensure the object is attached to the current session
    user = db.merge(current_user)
    user.role = "seller"
    db.add(user)
    
    db.commit()
    db.refresh(db_store)
    return db_store

from supabase_client import supabase

@router.post("/onboard", response_model=schemas.Token)
def onboard_seller(onboarding_data: schemas.SellerOnboardingRequest, db: Session = Depends(get_db)):
    # 1. Register with Supabase
    try:
        auth_response = supabase.auth.sign_up({
            "email": onboarding_data.user.email,
            "password": onboarding_data.user.password,
            "options": {
                "data": {
                    "full_name": onboarding_data.user.full_name
                }
            }
        })
        
        if not auth_response.user or not auth_response.session:
             raise HTTPException(status_code=400, detail="Registration failed")
             
        # 2. Check if user already exists locally (shouldn't if Supabase succeeded newly, but maybe sync issue)
        # Note: If email exists in Supabase but not locally, sign_up returns same user/session for existing users if email confirm off? 
        # Actually sign_up for existing user usually returns user but no session if requires email confirm, or error.
        # Let's assume happy path or unique email.
        
        db_user = crud.get_user_by_email(db, email=onboarding_data.user.email)
        if db_user:
             # If user exists locally, we might just be adding a store? 
             # But this endpoint implies fresh onboarding.
             raise HTTPException(status_code=400, detail="User already registered locally")

        # 3. Create User and Store locally
        # We need to inject the supabase_user_id
        # crud.create_seller_and_store expects UserCreate which has password. 
        # We can still use it, just password won't be used for auth.
        # But we need to ensure the LOCAL user gets the supabase_id.
        
        # We might need to customize create_seller_and_store or do it manually here.
        # Let's do it manually to ensure ID linking.
        
        user = models.User(
            email=onboarding_data.user.email,
            full_name=onboarding_data.user.full_name,
            supabase_user_id=auth_response.user.id,
            is_active=1,
            role="seller" # Directly set role
        )
        db.add(user)
        db.commit() # Commit to get ID
        db.refresh(user)
        
        store = models.Store(
            **onboarding_data.store.dict(),
            owner_id=user.id,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(store)
        db.commit()
        
        return {"access_token": auth_response.session.access_token, "token_type": "bearer"}

    except Exception as e:
        print(f"Onboarding Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/store", response_model=schemas.Store)
def get_seller_store(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    store = db.query(models.Store).filter(models.Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

@router.put("/store", response_model=schemas.Store)
def update_seller_store(store_update: schemas.StoreBase, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    store = db.query(models.Store).filter(models.Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    store.name = store_update.name
    store.description = store_update.description
    store.logo_url = store_update.logo_url
    store.banner_url = store_update.banner_url
    store.phone = store_update.phone
    store.address = store_update.address
    store.contact_email = store_update.contact_email
    store.shipping_policy = store_update.shipping_policy
    store.return_policy = store_update.return_policy
    
    db.commit()
    db.refresh(store)
    return store

@router.get("/stats", response_model=schemas.AdminStats) # Reusing AdminStats for now, or create SellerStats
def get_seller_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    store = db.query(models.Store).filter(models.Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Calculate stats for this store
    products_count = db.query(models.Product).filter(models.Product.store_id == store.id).count()
    # For sales/orders, we need to join OrderItems with Products filtered by store_id
    # This is complex without proper relationships, but let's do a basic query
    
    # Find all product IDs for this store
    store_product_ids = [p.id for p in db.query(models.Product).filter(models.Product.store_id == store.id).all()]
    
    total_sales = 0.0
    total_orders = 0 # Unique orders containing at least one product from this store
    
    if store_product_ids:
        order_items = db.query(models.OrderItem).filter(models.OrderItem.product_id.in_(store_product_ids)).all()
        total_sales = sum(item.price * item.quantity for item in order_items)
        total_orders = len(set(item.order_id for item in order_items))

    return {
        "total_sales": total_sales,
        "total_orders": total_orders,
        "total_users": 0, # Not relevant for seller
        "total_products": products_count
    }

@router.get("/products", response_model=List[schemas.Product])
def get_seller_products(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    store = db.query(models.Store).filter(models.Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    products = db.query(models.Product).filter(models.Product.store_id == store.id).all()
    return products

@router.post("/products", response_model=schemas.Product)
def create_seller_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    store = db.query(models.Store).filter(models.Store.owner_id == current_user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    db_product = models.Product(**product.dict(exclude={'store_id'}), store_id=store.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
