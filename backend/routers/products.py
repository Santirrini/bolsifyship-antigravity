from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
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
    
    return product_detail
