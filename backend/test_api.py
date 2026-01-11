import requests

def test_final_pipeline():
    url = "http://localhost:8000/recipe-engine/auto-suggest"
    # Testing with multiple items to see how the AI combines them
    payload = {"ingredients": ["apple", "bread"]}
    
    print("🚀 Testing AI Recipe Generation Pipeline...")
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Error: {data}")
            return

        for i, res in enumerate(data.get("results", []), 1):
            print(f"🍴 Recipe #{i}: {res['title']}")
            print(f"📝 Instructions: {res['instructions'][:100]}...") # Truncate for cleaner output
            print(f"🥕 Ingredients: {res['ingredients_used']}\n")
            
            # Validation: Ensure essential fields are present
            if not res['instructions'] or res['instructions'] == "No instructions provided.":
                print("❌ FAIL: Missing instructions!")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_final_pipeline()