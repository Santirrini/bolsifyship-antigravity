from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import SessionLocal, engine
import time

from routers import auth, search, cart, wishlist, categories, offers, admin, users, orders, banners
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Migration for is_admin
@app.on_event("startup")
def startup_db_client():
    try:
        with engine.connect() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0"))
    except OperationalError:
        pass # Column likely already exists
    except Exception as e:
        print(f"Migration error: {e}")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(search.router)
app.include_router(cart.router)
app.include_router(wishlist.router)
app.include_router(categories.router)
app.include_router(offers.router)
app.include_router(admin.router)
app.include_router(banners.router)

@app.get("/")
def read_root():
    return {"message": "Bolsifyshop API is running"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

class CompareRequest(schemas.BaseModel):
    product_ids: List[str]

@app.post("/compare")
def compare_products(request: CompareRequest):
    # Mock AI comparison (keeping this mock for now as requested only DB for products)
    return {
        "summary": "Based on the comparison, the Pro version offers better value for money due to...",
        "recommendation": "Bolsifyshop Pro",
        "details": {
            "price_diff": "$50",
            "feature_comparison": "Pro has X, Lite has Y"
        }
    }
