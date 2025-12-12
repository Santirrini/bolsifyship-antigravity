from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
import json
from database import get_db

router = APIRouter(
    prefix="/products",
    tags=["products"],
)

@router.get("/{product_id}", response_model=schemas.ProductDetail)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Fetch store details if store_id is present
    store = None
    if product.store_id:
        store = db.query(models.Store).filter(models.Store.id == product.store_id).first()
    
    # Create ProductDetail response
    product_detail = schemas.ProductDetail.from_orm(product)
    product_detail.store = store
    
    # Parse images JSON if present
    if product.images:
        try:
            product_detail.images = json.loads(product.images)
        except:
            product_detail.images = []
    
    return product_detail

@router.get("/{product_id}/related", response_model=List[schemas.Product])
def get_related_products(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Find products in the same category, excluding the current one
    related = db.query(models.Product).filter(
        models.Product.category == product.category,
        models.Product.id != product_id
    ).limit(4).all()
    
    return related
