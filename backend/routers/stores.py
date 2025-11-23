from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from datetime import datetime
from routers.auth import get_current_user

router = APIRouter(
    prefix="/stores",
    tags=["stores"],
)

@router.get("/", response_model=List[schemas.Store])
def get_stores(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Store)
    
    if category:
        query = query.filter(models.Store.category == category)
    
    if search:
        query = query.filter(models.Store.name.contains(search))
        
    stores = query.offset(skip).limit(limit).all()
    return stores

@router.get("/{store_id}", response_model=schemas.Store)
def get_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

@router.get("/{store_id}/products", response_model=List[schemas.Product])
def get_store_products(
    store_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    products = db.query(models.Product).filter(models.Product.store_id == store_id).offset(skip).limit(limit).all()
    return products

@router.post("/{store_id}/follow", response_model=schemas.StoreFollow)
def follow_store(
    store_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if store exists
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Check if already following
    existing_follow = db.query(models.StoreFollow).filter(
        models.StoreFollow.user_id == current_user.id,
        models.StoreFollow.store_id == store_id
    ).first()

    if existing_follow:
        return existing_follow

    new_follow = models.StoreFollow(
        user_id=current_user.id,
        store_id=store_id,
        created_at=datetime.utcnow().isoformat()
    )
    db.add(new_follow)
    db.commit()
    db.refresh(new_follow)
    return new_follow

@router.delete("/{store_id}/follow")
def unfollow_store(
    store_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    follow = db.query(models.StoreFollow).filter(
        models.StoreFollow.user_id == current_user.id,
        models.StoreFollow.store_id == store_id
    ).first()

    if not follow:
        raise HTTPException(status_code=404, detail="Not following this store")

    db.delete(follow)
    db.commit()
    return {"message": "Unfollowed successfully"}

@router.get("/{store_id}/is_following")
def check_is_following(
    store_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    follow = db.query(models.StoreFollow).filter(
        models.StoreFollow.user_id == current_user.id,
        models.StoreFollow.store_id == store_id
    ).first()

    return {"is_following": follow is not None}
