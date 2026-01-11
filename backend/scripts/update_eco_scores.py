import sys
import os
import time
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from openai import OpenAI
from database import engine
from models import Food

keys_str = os.environ.get("OPENROUTER_API_KEYS")
if not keys_str:
    print("❌ CRITICAL ERROR: OPENROUTER_API_KEYS is missing! Check backend/.env")
    sys.exit(1)

API_KEYS = [k.strip() for k in keys_str.split(",") if k.strip()]
print(f"🔑 Loaded {len(API_KEYS)} API Keys for rotation.")

MODEL_NAME = "google/gemini-2.0-flash-001"
LOCATION = "Southern Ontario, Canada"
CURRENT_MONTH = datetime.now().strftime("%B") 

def update_scores():
    with Session(engine) as session:
        foods = session.exec(select(Food)).all()
        print(f"🌍 Updating Eco Scores for {LOCATION} in {CURRENT_MONTH}...")

        current_key_idx = 0

        for food in foods:
            prompt = f"""
            Rate the eco-friendliness of eating '{food.name}' in {LOCATION} during {CURRENT_MONTH}.
            Consider: Food miles, greenhouse requirements, and seasonality.
            Return ONLY a single integer from 1 (Terrible) to 10 (Perfect).
            Do not write any other words.
            """
            
            success = False
            
            while not success:
                try:
                    client = OpenAI(
                        base_url="https://openrouter.ai/api/v1",
                        api_key=API_KEYS[current_key_idx],
                    )

                    response = client.chat.completions.create(
                        model=MODEL_NAME,
                        messages=[{"role": "user", "content": prompt}]
                    )
                    score_text = response.choices[0].message.content.strip()
                    
                    if "/" in score_text:
                        score_text = score_text.split("/")[0]
                    score_text = ''.join(filter(str.isdigit, score_text))

                    if score_text:
                        new_score = int(score_text)
                        print(f"   -> {food.name}: {new_score}/10")
                        food.eco_score = new_score
                        session.add(food)
                    else:
                        print(f"   ⚠️ Could not parse score for {food.name}")
                    
                    success = True
                    
                except Exception as e:
                    print(f"   ⚠️ Error with Key #{current_key_idx + 1}: {e}")
                    
                    current_key_idx = (current_key_idx + 1) % len(API_KEYS)
                    print(f"   🔄 Switching to Key #{current_key_idx + 1}...")
                    time.sleep(1)

        session.commit()
        print("✅ All Eco Scores updated!")

if __name__ == "__main__":
    update_scores()