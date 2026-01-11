from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import SavedRecipe

router = APIRouter()

@router.post("/recipes/save/", response_model=SavedRecipe)
def save_recipe(recipe: SavedRecipe, session: Session = Depends(get_session)):
    try:
        session.add(recipe)
        session.commit()
        session.refresh(recipe)
        return recipe
    except Exception as e:
        session.rollback()
        print(f"Error saving recipe: {e}")
        raise HTTPException(status_code=500, detail="Could not save recipe")

@router.get("/recipes/", response_model=List[SavedRecipe])
def read_saved_recipes(session: Session = Depends(get_session)):
    try:
        return session.exec(select(SavedRecipe)).all()
    except Exception as e:
        session.rollback()
        print(f"Error reading saved recipes: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, session: Session = Depends(get_session)):
    try:
        recipe = session.get(SavedRecipe, recipe_id)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        session.delete(recipe)
        session.commit()
        return {"ok": True}
    except HTTPException as he:
        raise he
    except Exception as e:
        session.rollback()
        print(f"Error deleting recipe: {e}")
        raise HTTPException(status_code=500, detail="Could not delete recipe")