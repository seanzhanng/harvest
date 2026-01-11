from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, col, desc  # <--- Imported desc
from database import get_session
from models import Food

router = APIRouter()

@router.get("/foods/", response_model=List[Food])
def read_foods(
    session: Session = Depends(get_session),
    category: Optional[str] = None,
    season: Optional[str] = None,
    search: Optional[str] = None,
    offset: int = 0,
    limit: int = 20,
):
    try:
        query = select(Food)

        if category:
            query = query.where(Food.category == category)
        if season:
            query = query.where(Food.season == season)
        if search:
            query = query.where(col(Food.name).ilike(f"%{search}%"))

        query = query.order_by(desc(Food.eco_score))
        
        query = query.offset(offset).limit(limit)
        return session.exec(query).all()
    except Exception as e:
        print(f"Error reading foods: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/foods/{food_id}", response_model=Food)
def read_single_food(food_id: int, session: Session = Depends(get_session)):
    try:
        f = session.get(Food, food_id)
        if not f:
            raise HTTPException(status_code=404, detail="Food not found")
        return f
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error reading single food: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/foods/", response_model=Food)
def create_food(food: Food, session: Session = Depends(get_session)):
    try:
        session.add(food)
        session.commit()
        session.refresh(food)
        return food
    except Exception as e:
        session.rollback()
        print(f"Error creating food: {e}")
        raise HTTPException(status_code=500, detail="Could not create food item")

@router.get("/foods/categories")
def get_categories(session: Session = Depends(get_session)):
    try:
        statement = select(Food.category).distinct()
        return session.exec(statement).all()
    except Exception as e:
        print(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")