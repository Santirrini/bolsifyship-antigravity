from sqlalchemy.orm import Session
from typing import Optional
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_products(
    db: Session, 
    query: Optional[str] = None, 
    category: Optional[str] = None, 
    min_price: Optional[float] = None, 
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = None,
    on_sale: bool = False
):
    db_query = db.query(models.Product)
    
    if query:
        db_query = db_query.filter(models.Product.name.contains(query))
    
    if category:
        db_query = db_query.filter(models.Product.category == category)
        
    if min_price is not None:
        db_query = db_query.filter(models.Product.price >= min_price)
        
    if max_price is not None:
        db_query = db_query.filter(models.Product.price <= max_price)
        
    if min_rating is not None:
        db_query = db_query.filter(models.Product.rating >= min_rating)
        
    if on_sale:
        db_query = db_query.filter(models.Product.discount_price.isnot(None))
        
    # Sorting
    if sort_by == "price_asc":
        db_query = db_query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        db_query = db_query.order_by(models.Product.price.desc())
    elif sort_by == "rating_desc":
        db_query = db_query.order_by(models.Product.rating.desc())
        
    return db_query.all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        discount_price=product.discount_price,
        category=product.category,
        rating=product.rating,
        reviews=product.reviews,
        source=product.source,
        image=product.image
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_categories(db: Session):
    return db.query(models.Product.category, models.Product.image).group_by(models.Product.category).all()
