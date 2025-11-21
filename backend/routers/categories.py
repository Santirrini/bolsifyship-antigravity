from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas
from database import get_db

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
)

@router.get("/", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    categories = crud.get_categories(db)
    # categories is a list of tuples (category_name, image_url)
    return [{"name": cat, "image": img} for cat, img in categories]
