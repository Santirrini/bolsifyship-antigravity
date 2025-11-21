from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal
from routers.auth import get_current_user, get_db
from passlib.context import CryptContext

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.put("/me", response_model=schemas.User)
def update_user_me(user_update: schemas.UserUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.email is not None:
        # Check if email already exists
        existing_user = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
    if user_update.password is not None:
        current_user.hashed_password = pwd_context.hash(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

# --- Addresses ---

@router.get("/me/addresses", response_model=List[schemas.Address])
def read_user_addresses(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Address).filter(models.Address.user_id == current_user.id).all()

@router.post("/me/addresses", response_model=schemas.Address)
def create_user_address(address: schemas.AddressCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # If this is the first address, make it default
    is_first = db.query(models.Address).filter(models.Address.user_id == current_user.id).count() == 0
    
    db_address = models.Address(**address.dict(), user_id=current_user.id)
    if is_first:
        db_address.is_default = 1
        
    if address.is_default:
        # Unset other defaults
        db.query(models.Address).filter(models.Address.user_id == current_user.id).update({"is_default": 0})
    
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address

@router.put("/me/addresses/{address_id}", response_model=schemas.Address)
def update_user_address(address_id: int, address: schemas.AddressUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_address = db.query(models.Address).filter(models.Address.id == address_id, models.Address.user_id == current_user.id).first()
    if not db_address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    if address.is_default:
         # Unset other defaults
        db.query(models.Address).filter(models.Address.user_id == current_user.id).update({"is_default": 0})

    for key, value in address.dict(exclude_unset=True).items():
        setattr(db_address, key, value)

    db.commit()
    db.refresh(db_address)
    return db_address

@router.delete("/me/addresses/{address_id}")
def delete_user_address(address_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_address = db.query(models.Address).filter(models.Address.id == address_id, models.Address.user_id == current_user.id).first()
    if not db_address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    db.delete(db_address)
    db.commit()
    return {"message": "Address deleted"}

# --- Payment Methods ---

@router.get("/me/payment-methods", response_model=List[schemas.PaymentMethod])
def read_user_payment_methods(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.PaymentMethod).filter(models.PaymentMethod.user_id == current_user.id).all()

@router.post("/me/payment-methods", response_model=schemas.PaymentMethod)
def create_user_payment_method(payment_method: schemas.PaymentMethodCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # If this is the first payment method, make it default
    is_first = db.query(models.PaymentMethod).filter(models.PaymentMethod.user_id == current_user.id).count() == 0

    db_payment = models.PaymentMethod(**payment_method.dict(), user_id=current_user.id)
    if is_first:
        db_payment.is_default = 1
        
    if payment_method.is_default:
        # Unset other defaults
        db.query(models.PaymentMethod).filter(models.PaymentMethod.user_id == current_user.id).update({"is_default": 0})

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.delete("/me/payment-methods/{payment_method_id}")
def delete_user_payment_method(payment_method_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_payment = db.query(models.PaymentMethod).filter(models.PaymentMethod.id == payment_method_id, models.PaymentMethod.user_id == current_user.id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    db.delete(db_payment)
    db.commit()
    return {"message": "Payment method deleted"}
