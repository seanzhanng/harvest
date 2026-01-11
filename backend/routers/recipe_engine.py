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

# --- 1. Models ---

class RecipeRequest(BaseModel):
    ingredients: List[str]

class RecipeResult(BaseModel):
    title: str
    instructions: str
    ingredients_used: str
    co2_saved: str    # <--- NEW
    eco_benefit: str  # <--- NEW

class AutoSuggestResponse(BaseModel):
    status_code: int
    results: List[RecipeResult]

# --- 2. Pipeline ---

@router.post("/recipe-engine/auto-suggest", response_model=AutoSuggestResponse)
def auto_suggest_pipeline(request: RecipeRequest):
    try:
        ingredients_str = ", ".join(request.ingredients)
        
        # --- UPDATED PROMPT ---
        prompt = (
            f"Create 3 distinct eco-friendly recipes using these ingredients: {ingredients_str}. "
            "Return ONLY a JSON list of objects with these exact keys: "
            "'title', "
            "'instructions' (Provide very thorough, step-by-step cooking instructions. Include measurements and temps.), "
            "'ingredients_used' (comma separated string), "
            "'co2_saved' (Estimate CO2 emissions saved compared to a typical meat-based equivalent meal. E.g., 'approx. 1.5kg CO2e'), "
            "and 'eco_benefit' (A short, punchy sentence explaining WHY this is good for the environment. E.g., 'Seasonal ingredients require less transport energy.')."
        )
        
        random.shuffle(API_KEYS)
        generated_data = []
        
        for key in API_KEYS:
            try:
                client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
                res = client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[{"role": "user", "content": prompt}],
                    timeout=20.0
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

        final_output = []
        for item in generated_data:
            final_output.append(RecipeResult(
                title=item.get("title", "Unknown Recipe"),
                instructions=item.get("instructions", "No instructions provided."),
                ingredients_used=item.get("ingredients_used", ingredients_str),
                co2_saved=item.get("co2_saved", "Unknown savings"),    # <--- Mapped
                eco_benefit=item.get("eco_benefit", "Eco-friendly choice") # <--- Mapped
            ))

        return AutoSuggestResponse(
            status_code=200,
            results=final_output
        )

    except Exception as e:
        print(f"Engine Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Engine Error")