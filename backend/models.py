from typing import Optional
from sqlmodel import Field, SQLModel

class Food(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    season: str         # e.g. "Winter", "Summer", "All Year"
    eco_score: int      # 1-10 (10 is best)
    base_price: float
    description: Optional[str] = None