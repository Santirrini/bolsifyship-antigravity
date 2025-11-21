from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from thefuzz import fuzz, process

import crud, models, schemas
from database import SessionLocal

router = APIRouter(
    prefix="/search",
    tags=["search"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Product])
def search_products(
    query: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = None,
    on_sale: bool = False,
    db: Session = Depends(get_db)
):
    return crud.get_products(
        db=db,
        query=query,
        category=category,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        sort_by=sort_by,
        on_sale=on_sale
    )

@router.get("/{product_id}", response_model=schemas.Product)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/suggest", response_model=List[str])
def autocomplete_suggestions(
    query: str,
    db: Session = Depends(get_db)
):
    if not query:
        return []
        
    all_products = db.query(models.Product).all()
    names = [p.name for p in all_products]
    
    # Get top 5 matches
    matches = process.extract(query, names, limit=5)
    return [m[0] for m in matches if m[1] > 50]
