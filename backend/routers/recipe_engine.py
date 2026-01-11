import os
import random
import json
import requests
import re
from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from openai import OpenAI
from bs4 import BeautifulSoup

router = APIRouter()

keys_str = os.environ.get("OPENROUTER_API_KEYS")
API_KEYS = [k.strip() for k in keys_str.split(",")] if keys_str else []
MODEL_NAME = "google/gemini-2.0-flash-001"

class RecipeRequest(BaseModel):
    ingredients: List[str]

class RecipeResult(BaseModel):
    meal_name: str
    recipe_link: str

class AutoSuggestResponse(BaseModel):
    status_code: int
    ingredients_provided: List[str]
    results: List[RecipeResult]

def clean_site_title(raw_text: str) -> str:
    """Removes junk like '1,043 Ratings', newlines, and extra spaces."""
    text = raw_text.replace("\n", " ").replace("\t", " ")
    text = re.sub(r'\d{1,3}(,\d{3})*\s*Ratings', '', text)
    text = re.sub(r'By\s+.*', '', text)
    text = " ".join(text.split())
    return text

@router.post("/recipe-engine/auto-suggest", response_model=AutoSuggestResponse)
def auto_suggest_pipeline(request: RecipeRequest):
    try:
        ingredients_str = ", ".join(request.ingredients)
        
        prompt = f"Suggest 3 realistic meal names using: {ingredients_str}. Return ONLY a JSON list of strings."
        
        random.shuffle(API_KEYS)
        suggested_themes = []
        
        for key in API_KEYS:
            try:
                client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
                res = client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[{"role": "user", "content": prompt}],
                    timeout=10.0
                )
                content = res.choices[0].message.content
                clean_json = content.replace("```json", "").replace("```", "").strip()
                suggested_themes = json.loads(clean_json)
                break 
            except:
                continue

        if not suggested_themes:
            raise HTTPException(status_code=500, detail="AI failed to suggest meals.")

        final_output = []
        used_links = set()
        headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

        for theme in suggested_themes:
            display_title = theme 
            fallback_link = f"https://www.google.com/search?q={theme.replace(' ', '+')}+recipe"
            final_link = fallback_link
            
            search_query = theme.replace(" ", "+")
            search_url = f"https://www.allrecipes.com/search?q={search_query}"
            
            try:
                response = requests.get(search_url, headers=headers, timeout=5)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, "html.parser")
                    
                    for a_tag in soup.find_all("a", href=True):
                        href = a_tag["href"]
                        if "/recipe/" in href:
                            full_url = href if href.startswith("http") else f"https://www.allrecipes.com{href}"

                            if full_url in used_links:
                                continue
                            
                            site_title = a_tag.get_text()
                            display_title = clean_site_title(site_title)
                            final_link = full_url
                            
                            used_links.add(full_url)
                            break
            except Exception as e:
                print(f"Scraper error: {e}")

            final_output.append(RecipeResult(meal_name=display_title, recipe_link=final_link))

        return AutoSuggestResponse(
            status_code=200,
            ingredients_provided=request.ingredients,
            results=final_output
        )

    except Exception as e:
        print(f"Engine Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Engine Error")