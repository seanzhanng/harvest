from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from database import get_session
from models import SavedRecipe, Food

router = APIRouter()

class RecipeSaveRequest(BaseModel):
    id: str
    title: str
    instructions: str
    ingredients_used: str

@router.post("/recipes/save/")
def save_recipe(recipe: RecipeSaveRequest, food: Food, session: Session = Depends(get_session)):
    db_recipe = SavedRecipe(
        title=recipe.title,
        instructions=recipe.instructions,
        ingredients_used=recipe.ingredients_used
    )
    session.add(db_recipe)
    session.commit()
    session.refresh(db_recipe)
    return db_recipe

@router.get("/recipes/")
def read_saved_recipes(session: Session = Depends(get_session)):
    recipes = session.exec(select(SavedRecipe)).all()
    return recipes

@router.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, session: Session = Depends(get_session)):
    recipe = session.get(SavedRecipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    session.delete(recipe)
    session.commit()
    return {"ok": True}