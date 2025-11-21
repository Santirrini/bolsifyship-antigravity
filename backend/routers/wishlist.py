from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal

router = APIRouter(
    prefix="/wishlist",
    tags=["wishlist"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/toggle")
def toggle_wishlist(item: schemas.WishlistItemCreate, db: Session = Depends(get_db)):
    existing_item = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == item.user_id,
        models.WishlistItem.product_id == item.product_id
    ).first()

    if existing_item:
        db.delete(existing_item)
        db.commit()
        return {"message": "Removed from wishlist", "status": "removed"}
    
    new_item = models.WishlistItem(
        user_id=item.user_id,
        product_id=item.product_id
    )
    db.add(new_item)
    db.commit()
    return {"message": "Added to wishlist", "status": "added"}

@router.get("/{user_id}")
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.WishlistItem).filter(models.WishlistItem.user_id == user_id).all()
