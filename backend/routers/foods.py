from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col, desc, asc
from database import get_session
from models import Food

router = APIRouter()

# --- 1. Static Routes (MUST COME FIRST) ---

@router.get("/foods/categories")
def get_categories(session: Session = Depends(get_session)):
    try:
        statement = select(Food.category).distinct()
        return session.exec(statement).all()
    except Exception as e:
        print(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/foods/", response_model=List[Food])
def read_foods(
    session: Session = Depends(get_session),
    category: Optional[str] = None,
    season: Optional[str] = None,
    search: Optional[str] = None,
    min_eco: int = 1,
    max_eco: int = 10,
    offset: int = 0,
    limit: int = 20,
):
    try:
        query = select(Food)

        if category and category != "All": 
            query = query.where(Food.category == category)
        
        if season and season != "All": 
            query = query.where(Food.season == season)
            
        if search:
            query = query.where(col(Food.name).ilike(f"%{search}%"))

        query = query.where(Food.eco_score >= min_eco)
        query = query.where(Food.eco_score <= max_eco)

        query = query.order_by(desc(Food.eco_score), asc(Food.id))
        
        query = query.offset(offset).limit(limit)
        return session.exec(query).all()
    except Exception as e:
        print(f"Error reading foods: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# --- 2. Dynamic Routes (MUST COME LAST) ---
# If this was first, it would capture "/foods/categories" and treat "categories" as an ID
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