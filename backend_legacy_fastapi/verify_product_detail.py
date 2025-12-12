import requests
import sys
import os

# Add current directory to path to import models
sys.path.append(os.getcwd())

from database import SessionLocal
import models

def verify_product_detail():
    db = SessionLocal()
    
    # 1. Ensure a user exists to be store owner
    user = db.query(models.User).filter(models.User.email == "seller@example.com").first()
    if not user:
        print("Creating test seller user...")
        user = models.User(
            email="seller@example.com",
            full_name="Test Seller",
            hashed_password="hashed_password",
            role="seller",
            is_active=1
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Ensure a store exists
    store = db.query(models.Store).filter(models.Store.owner_id == user.id).first()
    if not store:
        print("Creating test store...")
        store = models.Store(
            name="Tech World",
            description="Best tech gadgets",
            owner_id=user.id,
            logo_url="https://via.placeholder.com/150",
            created_at="2023-01-01"
        )
        db.add(store)
        db.commit()
        db.refresh(store)
    
    # 3. Ensure a product exists and link it to the store
    product = db.query(models.Product).first()
    if not product:
        print("No products found. Please seed data first.")
        return

    print(f"Linking product '{product.name}' (ID: {product.id}) to store '{store.name}' (ID: {store.id})")
    product.store_id = store.id
    db.commit()

    # 4. Call the API
    print(f"Testing API endpoint: http://localhost:8000/products/{product.id}")
    try:
        response = requests.get(f"http://localhost:8000/products/{product.id}")
        if response.status_code == 200:
            data = response.json()
            print("Response received:")
            print(f"Product Name: {data['name']}")
            if data.get('store'):
                print(f"Store Name: {data['store']['name']}")
                print("SUCCESS: Store info received in product detail.")
            else:
                print("FAILURE: Store info MISSING in product detail.")
        else:
            print(f"FAILURE: API returned status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"FAILURE: Could not connect to API. Is it running? Error: {e}")

    db.close()

if __name__ == "__main__":
    verify_product_detail()
