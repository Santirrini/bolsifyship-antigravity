from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(
    prefix="/offers",
    tags=["offers"]
)

@router.get("/pre-season", response_model=List[schemas.Product])
def get_pre_season_offers(db: Session = Depends(get_db)):
    # Pre-season: Christmas, Halloween (if upcoming)
    # For demo purposes, we fetch products tagged with these seasons
    seasons = ["christmas", "halloween"]
    products = db.query(models.Product).filter(models.Product.season.in_(seasons)).all()
    return products

@router.get("/past-season", response_model=List[schemas.Product])
def get_past_season_offers(db: Session = Depends(get_db)):
    # Past-season: Summer, Spring, Winter (if passed)
    seasons = ["summer", "spring", "winter"]
    products = db.query(models.Product).filter(models.Product.season.in_(seasons)).all()
    return products

@router.get("/clearance", response_model=List[schemas.Product])
def get_clearance_offers(db: Session = Depends(get_db)):
    # Clearance: Low sales count (< 5) and has a discount
    products = db.query(models.Product).filter(
        models.Product.sales_count < 5,
        models.Product.discount_price.isnot(None)
    ).all()
    return products

@router.get("/trending", response_model=List[schemas.Product])
def get_trending_offers(db: Session = Depends(get_db)):
    # Trending: High sales count (> 50) or high rating (> 4.5)
    # We can also add a small "extra discount" logic here if needed dynamically, 
    # but for now we just return the products.
    products = db.query(models.Product).filter(
        (models.Product.sales_count > 50) | (models.Product.rating > 4.7)
    ).limit(10).all()
    return products
