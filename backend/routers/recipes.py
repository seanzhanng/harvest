from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from database import get_session
from models import SavedRecipe, Food

router = APIRouter()

class RecipeSaveRequest(BaseModel):
    title: str
    instructions: str
    ingredients_used: str

class RecipeSaveResponse(BaseModel):
    status_code: int
    name: str

# creates a new saved recipe
@router.post("/recipes/save/", response_model=RecipeSaveResponse)
def save_recipe(recipe: RecipeSaveRequest, session: Session = Depends(get_session)):
    try:
        db_recipe = SavedRecipe(
            title=recipe.title,
            instructions=recipe.instructions,
            ingredients_used=recipe.ingredients_used
        )

        # adds to databse
        session.add(db_recipe)
        session.commit()
        session.refresh(db_recipe)

        print("test")
        
        return RecipeSaveResponse(
            status_code=201,
            name=db_recipe.title
        )
    except Exception as e:
        session.rollback()
        print(f"Error saving recipe: {e}")
        raise HTTPException(status_code=500, detail="Could not save recipe")

# get all saved recipes
@router.get("/recipes/")
def read_saved_recipes(session: Session = Depends(get_session)):
    try:
        # select all saved recipes
        recipes = session.exec(select(SavedRecipe)).all()
        return recipes
    except Exception as e:
        session.rollback()
        print(f"Error reading saved recipes: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# delete saved recipe
@router.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, session: Session = Depends(get_session)):
    try:
        recipe = session.get(SavedRecipe, recipe_id)
        if not recipe:
            raise HTTPException(status_code="404", detail="Recipe not found")
        session.delete(recipe)
        session.commit()
    except HTTPException as he:
        raise he
    except Exception as e:
        session.rollback()
        print(f"Error deleting recipe: {e}")
        raise HTTPException(status_code=500, detail="Could not delete recipe")