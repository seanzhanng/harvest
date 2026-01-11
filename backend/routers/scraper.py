import os
import requests
import json
import random
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

router = APIRouter()

keys_str = os.environ.get("OPENROUTER_API_KEYS")
API_KEYS = []
if keys_str:
    for k in keys_str.split(","):
        API_KEYS.append(k.strip())

class SearchRequest(BaseModel):
    query: str

@router.post("/scraper/search")
def search_recipes(request: SearchRequest):
    url = f"https://www.allrecipes.com/search?q={request.query}"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, "html.parser")
        text_data = soup.get_text()[:5000]

        prompt = f"Find 5 recipes in this text. Return a JSON list of objects with 'title' and 'link'. Text: {text_data}"

        random.shuffle(API_KEYS)
        for key in API_KEYS:
            try:
                client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
                ai_res = client.chat.completions.create(
                    model="google/gemini-2.0-flash-001",
                    messages=[{"role": "user", "content": prompt}]
                )
                content = ai_res.choices[0].message.content
                clean_json = content.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_json)
            except:
                continue
    except Exception as e:
        return {"error": str(e)}