from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, col, SQLModel
from database import get_session
from models import Food

router = APIRouter()

class CreateFoodRequest(SQLModel):
    name: str
    category: str
    season: str
    description: Optional[str] = None
    eco_score: int = 5
    image: Optional[str] = None

class CreateFoodResponse(SQLModel):
    status_code: int
    name: str

@router.get("/foods/", response_model=List[CreateFoodResponse])
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

        query = query.offset(offset).limit(limit)
        foods_db = session.exec(query).all()
        
        results = []
        for f in foods_db:
            response_item = CreateFoodResponse(
                status_code=200,
                name=f.name
            )
            results.append(response_item)
            
        return results
    except Exception as e:
        print(f"Error reading foods: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/foods/{food_id}", response_model=CreateFoodResponse)
def read_single_food(food_id: int, session: Session = Depends(get_session)):
    try:
        f = session.get(Food, food_id)
        if not f:
            raise HTTPException(status_code=404, detail="Food not found")
        
        return CreateFoodResponse(
            status_code=200,
            name=f.name
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error reading single food: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/foods/", response_model=CreateFoodResponse)
def create_food(food_in: CreateFoodRequest, session: Session = Depends(get_session)):
    try:
        db_food = Food(
            name=food_in.name,
            category=food_in.category,
            season=food_in.season,
            description=food_in.description,
            eco_score=food_in.eco_score,
            image=food_in.image
        )
        
        session.add(db_food)
        session.commit()
        session.refresh(db_food)
        
        return CreateFoodResponse(
            status_code=201,
            name=db_food.name
        )
    except Exception as e:
        session.rollback()
        print(f"Error creating food: {e}")
        raise HTTPException(status_code=500, detail="Could not create food item")

@router.get("/foods/categories")
def get_categories(session: Session = Depends(get_session)):
    try:
        statement = select(Food.category).distinct()
        results = session.exec(statement).all()
        return results
    except Exception as e:
        print(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")