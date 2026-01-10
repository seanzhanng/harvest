# backend/scripts/update_eco_scores.py
import sys
import os
from datetime import datetime
import google.generativeai as genai

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from database import engine
from models import Food

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

LOCATION = "Southern Ontario, Canada"
CURRENT_MONTH = datetime.now().strftime("%B") 

def update_scores():
    with Session(engine) as session:
        foods = session.exec(select(Food)).all()
        print(f"🌍 Gemini is updating Eco Scores for {LOCATION} in {CURRENT_MONTH}...")

        for food in foods:
            prompt = f"""
            Rate the eco-friendliness of eating '{food.name}' in {LOCATION} during {CURRENT_MONTH}.
            Consider: Food miles, greenhouse requirements, and seasonality.
            Return ONLY a single integer from 1 (Terrible) to 10 (Perfect).
            Do not write any other words.
            """
            
            try:
                response = model.generate_content(prompt)
                new_score = int(response.text.strip())
                print(f"   -> {food.name}: {new_score}/10")
                
                food.eco_score = new_score
                session.add(food)
            except Exception as e:
                print(f"   ⚠️ Failed to update {food.name}: {e}")

        session.commit()
        print("✅ All Eco Scores updated!")

if __name__ == "__main__":
    update_scores()