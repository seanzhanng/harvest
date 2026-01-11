from typing import Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, col
from database import get_session
from models import Food

router = APIRouter()

@router.get("/foods/")
def read_foods(
    session: Session = Depends(get_session),
    category: Optional[str] = None,
    season: Optional[str] = None,
    search: Optional[str] = None,
    offset: int = 0,
    limit: int = 20,
):
    query = select(Food)

    if category:
        query = query.where(Food.category == category)
    
    if season:
        query = query.where(Food.season == season)
    
    if search:
        query = query.where(col(Food.name).ilike(f"%{search}%"))

    query = query.offset(offset).limit(limit)
    foods = session.exec(query).all()
    return foods

@router.get("/foods/categories")
def get_categories(session: Session = Depends(get_session)):
    statement = select(Food.category).distinct()
    results = session.exec(statement).all()
    return results