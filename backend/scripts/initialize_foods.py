# backend/scripts/initialize_foods.py
import sys
import os
import json
import google.generativeai as genai

# Add backend directory to path so we can import 'database' and 'models'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session
from database import engine, reset_db
from models import Food

# Setup Gemini
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

RAW_FOODS = ["Apple", "Banana", "Zucchini", "Strawberry", "Salmon", "Almonds", "Pumpkin"]

def enrich_and_seed():
    reset_db() # Wipes the DB to start fresh
    
    with Session(engine) as session:
        print(f"🤖 Gemini is analyzing {len(RAW_FOODS)} food items...")
        
        prompt = f"""
        Analyze these food items: {", ".join(RAW_FOODS)}.
        Return a JSON list (and ONLY JSON) where each object has:
        - name: The food name
        - category: 'Fruit', 'Vegetable', 'Protein', or 'Grain'
        - best_season: 'Spring', 'Summer', 'Fall', 'Winter', or 'All Year'
        - description: A short, punchy 1-sentence description.
        """

        try:
            response = model.generate_content(prompt)
            # Cleanup common formatting issues
            clean_json = response.text.replace("```json", "").replace("```", "").strip()
            ai_data = json.loads(clean_json)
            
            for item in ai_data:
                food = Food(
                    name=item['name'],
                    category=item['category'],
                    season=item['best_season'],
                    description=item['description'],
                    eco_score=5, # Placeholder
                    base_price=0.0 
                )
                session.add(food)
            
            session.commit()
            print("✅ Database seeded with Gemini-tagged foods!")
            
        except Exception as e:
            print(f"❌ AI Error: {e}")
            print("Raw Response was:", response.text)

if __name__ == "__main__":
    enrich_and_seed()