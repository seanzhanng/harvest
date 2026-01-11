from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from database import get_session
from models import SavedRecipe

router = APIRouter()

class RecipeSaveRequest(BaseModel):
    # your code here

@router.post("/recipes/save/")
# your code here

@router.get("/recipes/")
# your code here

@router.delete("/recipes/{recipe_id}")
# your code here