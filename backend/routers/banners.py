from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/banners",
    tags=["banners"]
)

@router.get("/", response_model=List[schemas.BannerResponse])
def read_banners(
    skip: int = 0, 
    limit: int = 100, 
    position: Optional[str] = None,
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Banner)
    
    if position:
        query = query.filter(models.Banner.position == position)
    
    if active_only:
        query = query.filter(models.Banner.is_active == 1)
        
    banners = query.order_by(models.Banner.order.asc()).offset(skip).limit(limit).all()
    return banners

@router.post("/", response_model=schemas.BannerResponse, status_code=status.HTTP_201_CREATED)
def create_banner(banner: schemas.BannerCreate, db: Session = Depends(get_db)):
    db_banner = models.Banner(**banner.dict())
    db.add(db_banner)
    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.get("/{banner_id}", response_model=schemas.BannerResponse)
def read_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = db.query(models.Banner).filter(models.Banner.id == banner_id).first()
    if banner is None:
        raise HTTPException(status_code=404, detail="Banner not found")
    return banner

@router.put("/{banner_id}", response_model=schemas.BannerResponse)
def update_banner(banner_id: int, banner_update: schemas.BannerUpdate, db: Session = Depends(get_db)):
    db_banner = db.query(models.Banner).filter(models.Banner.id == banner_id).first()
    if db_banner is None:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    for key, value in banner_update.dict().items():
        setattr(db_banner, key, value)
    
    db.commit()
    db.refresh(db_banner)
    return db_banner

@router.delete("/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_banner(banner_id: int, db: Session = Depends(get_db)):
    db_banner = db.query(models.Banner).filter(models.Banner.id == banner_id).first()
    if db_banner is None:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    db.delete(db_banner)
    db.commit()
    return None
