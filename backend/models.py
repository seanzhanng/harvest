from typing import Optional
from sqlmodel import Field, SQLModel

class Food(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    season: str         # "Winter", "Spring", "All Year"
    eco_score: int      # 1-10
    base_price: float
    category: str       # "Vegetable", "Fruit", "Protein"
    description: Optional[str] = None # Added for AI summaries

# We only store recipes if the user hits "Save"
class SavedRecipe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    instructions: str
    ingredients_used: str # Store as "Apple, Spinach" for simplicity