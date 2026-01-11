import os
import random
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

router = APIRouter()

keys_str = os.environ.get("OPENROUTER_API_KEYS")
API_KEYS = []

if keys_str:
    raw_keys = keys_str.split(",")
    for k in raw_keys:
        clean_key = k.strip()
        if clean_key:
            API_KEYS.append(clean_key)

MODEL_NAME = "google/gemini-2.0-flash-001"

class CartRequest(BaseModel):
    ingredients: List[str]

@router.post("/generate-recipe/")
def generate_recipe(cart: CartRequest):
    if not cart.ingredients:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    if not API_KEYS:
        raise HTTPException(status_code=500, detail="No API Keys configured")

    ingredients_str = ""
    for ingredient in cart.ingredients:
        if ingredients_str == "":
            ingredients_str = ingredient
        else:
            ingredients_str = ingredients_str + ", " + ingredient
    
    prompt = f"""
    You are an eco-conscious chef. Create a recipe using these ingredients: {ingredients_str}.
    Return a STRICT JSON object with these keys: 
    - title (string)
    - cooking_time_minutes (integer)
    - instructions (string, step by step, can include newline characters)
    - eco_tip (string, a quick tip about why this is sustainable)
    Do not include markdown formatting like ```json. Just raw JSON.
    """

    last_error = ""
    random.shuffle(API_KEYS)

    for key in API_KEYS:
        try:
            client = OpenAI(
                base_url="[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)",
                api_key=key,
            )
            
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
            clean_text = content.replace("```json", "").replace("```", "").strip()
            return {"recipe_json": clean_text}
            
        except Exception as e:
            last_error = str(e)
            continue

    return {"error": f"All API keys failed. Last error: {last_error}"}

@router.get("/suggestions/{food_name}")
def get_food_suggestions(food_name: str):
    if not API_KEYS:
        raise HTTPException(status_code=500, detail="No API Keys configured")

    prompt = f"""
    Give me 3 creative, short recipe titles that feature '{food_name}' as the star ingredient.
    Return ONLY a JSON list of strings. Example: ["Spicy {food_name} Soup", "Baked {food_name} Chips", "{food_name} Salad"]
    Do not write any markdown or extra text.
    """

    last_error = ""
    random.shuffle(API_KEYS)

    for key in API_KEYS:
        try:
            client = OpenAI(
                base_url="[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)",
                api_key=key,
            )
            
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
            clean_text = content.replace("```json", "").replace("```", "").strip()
            return {"suggestions": clean_text}
            
        except Exception as e:
            last_error = str(e)
            continue

    return {"error": f"Failed to get suggestions. {last_error}"}