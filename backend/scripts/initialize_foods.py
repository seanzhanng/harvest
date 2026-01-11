import sys
import os
import json
import csv
import time
import urllib.parse
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select, func, SQLModel
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
BATCH_SIZE = 50        
SLEEP_SECONDS = 1 

def load_foods_from_csv():
    csv_path = Path(__file__).parent.parent / "filtering" / "food.csv"
    if not csv_path.exists():
        return []
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        names = [row['name'] for row in reader if 'name' in row]
    return names

def enrich_and_seed():
    print("🛠️  Ensuring database tables exist...")
    SQLModel.metadata.create_all(engine)
    
    try:
        with Session(engine) as session:
            existing_count = session.exec(select(func.count(Food.id))).one()
    except:
        existing_count = 0

    all_foods = load_foods_from_csv()
    total_foods = len(all_foods)
    start_index = existing_count 
    
    if start_index >= total_foods:
        print("✅ Database looks fully seeded! Exiting.")
        return

    print(f"🚀 Resuming from item {start_index} of {total_foods}...")

    current_key_idx = 0

    with Session(engine) as session:
        for i in range(start_index, total_foods, BATCH_SIZE):
            batch = all_foods[i : i + BATCH_SIZE]
            current_batch_num = (i // BATCH_SIZE) + 1
            total_batches = (total_foods // BATCH_SIZE) + 1
            
            print(f"\n🔄 Processing Batch {current_batch_num}/{total_batches} ({len(batch)} items)...")
            
            success = False
            
            while not success:
                active_key = API_KEYS[current_key_idx]
                client = OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=active_key,
                )
                
                prompt = f"""
                Analyze this list of food items: {", ".join(batch)}.
                Return a JSON list (and ONLY JSON) where each object has:
                - name: The exact food name from the list
                - category: 'Fruit', 'Vegetable', 'Protein', 'Grain', 'Snack', 'Beverage' or 'Processed'
                - best_season: Pick the NATURAL harvest season (Spring, Summer, Fall, Winter). 
                  **CRITICAL:** Only use 'All Year' for processed foods or dried staples. 
                - description: A short, punchy 1-sentence description.
                - eco_score: An estimated eco-score from 1-10 (10 is best).
                Do not include markdown formatting. Just the raw JSON.
                """

                try:
                    response = client.chat.completions.create(
                        model=MODEL_NAME,
                        messages=[{"role": "user", "content": prompt}]
                    )
                    
                    content = response.choices[0].message.content
                    clean_json = content.replace("```json", "").replace("```", "").strip()
                    ai_data = json.loads(clean_json)

                    for item in ai_data:
                        safe_text = urllib.parse.quote(item['name'])
                        image_url = f"https://placehold.co/600x400?text={safe_text}"
                        
                        food = Food(
                            name=item['name'],
                            category=item['category'],
                            season=item['best_season'],
                            description=item['description'],
                            eco_score=item.get('eco_score', 5),
                            image=image_url
                        )
                        session.add(food)
                    
                    session.commit()
                    print(f"   ✅ Saved {len(ai_data)} items using Key #{current_key_idx + 1}")
                    success = True 
                    time.sleep(SLEEP_SECONDS)
                    
                except Exception as e:
                    print(f"   ⚠️ Error on Key #{current_key_idx + 1}: {e}")
                    current_key_idx = (current_key_idx + 1) % len(API_KEYS)
                    print(f"   🔄 Switching to Key #{current_key_idx + 1}...")

    print("\n🎉 DONE! Database is seeded.")

if __name__ == "__main__":
    enrich_and_seed()