from datetime import datetime, timedelta
from typing import Optional

import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal
from supabase_client import supabase

load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(request: Request, token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # 1. Get Token (Header or Cookie)
    if not token:
        token = request.cookies.get("sb-access-token") or request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Verify with Supabase
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        supabase_user = user_response.user
        
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Find or Link User in Local DB
    user = db.query(models.User).filter(models.User.supabase_user_id == supabase_user.id).first()
    
    # If using Supabase for the first time but email exists (migration path)
    if not user:
        user = db.query(models.User).filter(models.User.email == supabase_user.email).first()
        if user:
            # Link existing user
            user.supabase_user_id = supabase_user.id
            db.commit()
            db.refresh(user)
        else:
            # Create new user in local DB (synced from Supabase)
            user = models.User(
                email=supabase_user.email,
                supabase_user_id=supabase_user.id,
                full_name=supabase_user.user_metadata.get("full_name", ""),
                is_active=1
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    # 4. Check Roles
    store = db.query(models.Store).filter(models.Store.owner_id == user.id).first()
    if store and user.role != "seller":
        user.role = "seller"
        db.add(user)
        db.commit()
    
    return user

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Register with Supabase directly
    try:
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        
        if not auth_response.user and not auth_response.session:
             raise HTTPException(status_code=400, detail="Registration failed")

        # Create local user immediately
        if auth_response.user:
            db_user = models.User(
                email=user.email,
                full_name=user.full_name,
                supabase_user_id=auth_response.user.id,
                # hashed_password no longer needed locally
            )
            try:
                db.add(db_user)
                db.commit()
                db.refresh(db_user)
                return db_user
            except Exception as e:
                db.rollback()
                # If local creation fails but auth succeeded, we have a sync issue.
                # In prod, this should be handled by a webhook or robust error handling.
                print(f"Local DB Creation Error: {e}")
                # Try to clean up auth user?
                raise HTTPException(status_code=500, detail="Account created but profile setup failed")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/token")
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Login via Supabase
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })
        
        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        access_token = auth_response.session.access_token
        
        # Set cookie
        response.set_cookie(
            key="sb-access-token",
            value=access_token,
            httponly=True,
            max_age=3600, # 1 hour
            samesite="lax",
            secure=False # Set to True in prod
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        print(f"Login Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/logout")
async def logout(response: Response):
    try:
        supabase.auth.sign_out()
    except:
        pass
    response.delete_cookie("sb-access-token")
    response.delete_cookie("access_token")
    return {"message": "Logged out"}

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user
