from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from routers.auth import get_current_user, get_db

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
)

@router.get("/me", response_model=List[schemas.Order])
def read_user_orders(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()

@router.get("/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id, models.Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=schemas.Order)
def create_order(order_data: schemas.OrderCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Verify Payment Token (Simulated PSP Call)
    if not order_data.payment_token.startswith("tok_"):
        raise HTTPException(status_code=400, detail="Invalid payment token")
    
    # In a real app, we would call Stripe/PayPal API here with the token and amount
    # response = stripe.Charge.create(amount=total_amount, source=order_data.payment_token, ...)
    
    # 2. Calculate total amount and validate products
    total_amount = 0.0
    order_items_objects = []
    
    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        
        # Use discount price if available, otherwise regular price
        price = product.discount_price if product.discount_price else product.price
        item_total = price * item.quantity
        total_amount += item_total
        
        order_items_objects.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": price
        })

    # 3. Create Order
    from datetime import datetime
    new_order = models.Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="paid", # Mark as paid since token was verified
        created_at=datetime.utcnow().isoformat(),
        shipping_address=order_data.shipping_address
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # 4. Create Order Items
    for item_obj in order_items_objects:
        new_order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item_obj["product_id"],
            quantity=item_obj["quantity"],
            price=item_obj["price"]
        )
        db.add(new_order_item)
    
    db.commit()
    
    return new_order
