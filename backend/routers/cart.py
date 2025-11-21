from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal

router = APIRouter(
    prefix="/cart",
    tags=["cart"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_to_cart(item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    # Check if item already exists
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == item.user_id,
        models.CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    new_item = models.CartItem(
        user_id=item.user_id,
        product_id=item.product_id,
        quantity=item.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/{user_id}")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item removed"}
