import os
import random
import json
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
        API_KEYS.append(k.strip())

MODEL_NAME = "google/gemini-2.0-flash-001"

class CartRequest(BaseModel):
    ingredients: List[str]

@router.post("/generate-recipe/")
def generate_recipe(cart: CartRequest):
    ingredients_str = ""
    for item in cart.ingredients:
        ingredients_str = ingredients_str + item + ", "

    prompt = f"Create an eco-friendly recipe using: {ingredients_str}. Return ONLY JSON with keys: title, cooking_time_minutes, instructions, eco_tip."

    random.shuffle(API_KEYS)
    for key in API_KEYS:
        try:
            client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
            clean_json = content.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json)
        except:
            continue
    return {"error": "All keys failed"}

@router.get("/suggestions/{food_name}")
def get_food_suggestions(food_name: str):
    prompt = f"Give 3 recipe titles for {food_name}. Return ONLY a JSON list of strings."
    
    random.shuffle(API_KEYS)
    for key in API_KEYS:
        try:
            client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
            clean_json = content.replace("```json", "").replace("```", "").strip()
            return {"suggestions": json.loads(clean_json)}
        except:
            continue
    return {"error": "Failed to get suggestions"}