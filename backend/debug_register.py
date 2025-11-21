from database import SessionLocal, engine
import models, schemas, crud
from sqlalchemy.orm import Session

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    user = schemas.UserCreate(
        email="debug_user@example.com",
        password="password123",
        full_name="Debug User"
    )
    print("Attempting to create user...")
    db_user = crud.create_user(db, user)
    print("User created successfully:", db_user.email)
except Exception as e:
    print("Error creating user:")
    print(e)
    import traceback
    traceback.print_exc()
finally:
    db.close()
