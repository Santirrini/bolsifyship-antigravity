from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Store
from database import SQLALCHEMY_DATABASE_URL
from datetime import datetime

# Setup DB connection
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def create_store_for_user(email, store_name, store_description):
    print(f"Finding user: {email}")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print("User not found!")
        return

    print(f"User found: {user.email} (ID: {user.id})")
    
    # Check if store already exists
    existing_store = db.query(Store).filter(Store.owner_id == user.id).first()
    if existing_store:
        print(f"Store already exists: {existing_store.name}")
        return

    print(f"Creating store '{store_name}' for user...")
    new_store = Store(
        name=store_name,
        description=store_description,
        owner_id=user.id,
        created_at=datetime.utcnow().isoformat(),
        logo_url=""
    )
    db.add(new_store)
    
    # Update user role
    print("Updating user role to 'seller'...")
    user.role = "seller"
    db.add(user)
    
    db.commit()
    print("Success! Store created and user role updated.")

if __name__ == "__main__":
    create_store_for_user(
        "bolsifyshop@hotmail.com", 
        "Bolsify Official Store", 
        "Tienda oficial de Bolsify"
    )
