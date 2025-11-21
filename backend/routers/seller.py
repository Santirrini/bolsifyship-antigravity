from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from database import get_db
from routers.auth import get_current_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
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
    
    # Create store
    db_store = models.Store(**store.dict(), owner_id=current_user.id)
    db.add(db_store)
    
    # Update user role to seller
    # Use merge to ensure the object is attached to the current session
    user = db.merge(current_user)
    user.role = "seller"
    db.add(user)
    
    db.commit()
    db.refresh(db_store)
    db.refresh(db_store)
    return db_store

@router.post("/onboard", response_model=schemas.Token)
def onboard_seller(onboarding_data: schemas.SellerOnboardingRequest, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_user_by_email(db, email=onboarding_data.user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user and store
    user, store = crud.create_seller_and_store(db, onboarding_data.user, onboarding_data.store)
    
    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


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
    
    db_product = models.Product(**product.dict(), store_id=store.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
