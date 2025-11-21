from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User, Base
from passlib.context import CryptContext

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def create_admin_user():
    db = SessionLocal()
    try:
        email = "admin@bolsifyshop.com"
        password = "admin123" # Change this!
        
        # Check if exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"User {email} already exists. Updating to admin...")
            existing_user.is_admin = 1
            existing_user.is_active = 1
            existing_user.role = "admin"
            existing_user.hashed_password = pwd_context.hash(password)
            db.commit()
            print("User updated successfully.")
            return

        print(f"Creating admin user: {email}")
        hashed_password = pwd_context.hash(password)
        
        admin_user = User(
            email=email,
            hashed_password=hashed_password,
            full_name="System Admin",
            is_admin=1,
            is_active=1,
            role="admin"
        )
        
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully!")
        print(f"Email: {email}")
        print(f"Password: {password}")
        
    except Exception as e:
        print(f"Error creating admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
