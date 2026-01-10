import os
import google.generativeai as genai
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List

from database import create_db_and_tables, get_session
from models import Food, SavedRecipe

# --- GEMINI SETUP ---
# Ensure GOOGLE_API_KEY is in your .env file!
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()

# --- CORS SETUP ---
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- STARTUP ---
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- SCHEMAS ---
class CartRequest(BaseModel):
    ingredients: List[str]

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"message": "Harvest API is running with Gemini!"}

# 1. GET all foods
@app.get("/foods/")
def read_foods(session: Session = Depends(get_session)):
    foods = session.exec(select(Food)).all()
    return foods

# 2. POST (add) a food manually
@app.post("/foods/")
def create_food(food: Food, session: Session = Depends(get_session)):
    session.add(food)
    session.commit()
    session.refresh(food)
    return food

# 3. AI CHEF: Generate Recipe from Cart
@app.post("/generate-recipe/")
def generate_recipe(cart: CartRequest):
    if not cart.ingredients:
        raise HTTPException(status_code=400, detail="Cart is empty")

    ingredients_str = ", ".join(cart.ingredients)
    
    # Prompt Engineering for the AI
    prompt = f"""
    You are an eco-conscious chef. Create a recipe using these ingredients: {ingredients_str}.
    You can assume standard pantry items (oil, salt, pepper) exist.
    
    Return a STRICT JSON object with these keys: 
    - title (string)
    - cooking_time_minutes (integer)
    - instructions (string, step by step)
    - eco_tip (string, a quick tip about why this is sustainable)

    Do not include markdown formatting like ```json. Just raw JSON.
    """

    try:
        response = model.generate_content(prompt)
        # Clean up potential markdown formatting from Gemini
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        return {"recipe_json": clean_text}
    except Exception as e:
        return {"error": str(e)}