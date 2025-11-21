from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Store, Base
from database import SQLALCHEMY_DATABASE_URL

# Setup DB connection
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def check_user(email):
    print(f"Checking user: {email}")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print("User not found!")
        return

    print(f"User ID: {user.id}")
    print(f"User Role: {user.role}")
    print(f"User Is Active: {user.is_active}")

    store = db.query(Store).filter(Store.owner_id == user.id).first()
    if store:
        print(f"Store Found: {store.name} (ID: {store.id})")
        print(f"Store Owner ID: {store.owner_id}")
    else:
        print("No store found for this user.")

    if store and user.role != "seller":
        print("MISMATCH DETECTED: User has store but role is not seller.")
    elif store and user.role == "seller":
        print("Data looks correct: User has store and role is seller.")
    else:
        print("User has no store, so role should be customer (or admin).")

if __name__ == "__main__":
    check_user("bolsifyshop@hotmail.com")
    
    print("\n--- All Stores ---")
    stores = db.query(Store).all()
    for s in stores:
        print(f"Store ID: {s.id}, Name: {s.name}, Owner ID: {s.owner_id}")
    if not stores:
        print("No stores found in the database.")
