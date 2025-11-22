from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

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
