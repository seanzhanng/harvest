from typing import Optional
from sqlmodel import Field, SQLModel

class Food(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    season: str         
    eco_score: int      
    category: str       
    description: Optional[str] = None
    image: str = "https://placehold.co/400?text=No+Image" 

class SavedRecipe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    instructions: str
    ingredients_used: str