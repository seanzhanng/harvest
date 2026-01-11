import os
import random
import json
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

router = APIRouter()

keys_str = os.environ.get("OPENROUTER_API_KEYS")
API_KEYS = [k.strip() for k in keys_str.split(",")] if keys_str else []
MODEL_NAME = "google/gemini-2.0-flash-001"

# --- 1. Updated Models ---

class RecipeRequest(BaseModel):
    ingredients: List[str]

class RecipeResult(BaseModel):
    title: str
    instructions: str
    ingredients_used: str

class AutoSuggestResponse(BaseModel):
    status_code: int
    results: List[RecipeResult]

# --- 2. Updated Pipeline ---

@router.post("/recipe-engine/auto-suggest", response_model=AutoSuggestResponse)
def auto_suggest_pipeline(request: RecipeRequest):
    try:
        ingredients_str = ", ".join(request.ingredients)
        
        # Changed prompt to ask for full details instead of just names
        prompt = (
            f"Create 3 distinct recipes using these ingredients: {ingredients_str}. "
            "Return ONLY a JSON list of objects with these exact keys: "
            "'title', 'instructions' (summarized steps), and 'ingredients_used' (comma separated string)."
        )
        
        random.shuffle(API_KEYS)
        generated_data = []
        
        for key in API_KEYS:
            try:
                client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
                res = client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[{"role": "user", "content": prompt}],
                    timeout=15.0 # Increased slightly for longer text generation
                )
                content = res.choices[0].message.content
                clean_json = content.replace("```json", "").replace("```", "").strip()
                generated_data = json.loads(clean_json)
                break 
            except Exception as e:
                print(f"LLM error with key: {e}")
                continue

        if not generated_data:
            raise HTTPException(status_code=500, detail="AI failed to generate recipes.")

        # Map JSON directly to your new Result model (Scraping logic removed)
        final_output = []
        for item in generated_data:
            final_output.append(RecipeResult(
                title=item.get("title", "Unknown Recipe"),
                instructions=item.get("instructions", "No instructions provided."),
                ingredients_used=item.get("ingredients_used", ingredients_str)
            ))

        return AutoSuggestResponse(
            status_code=200,
            results=final_output
        )

    except Exception as e:
        print(f"Engine Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Engine Error")