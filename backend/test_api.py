import requests

def test_final_pipeline():
    url = "http://localhost:8000/recipe-engine/auto-suggest"
    # Testing with multiple items to see how the AI combines them
    payload = {"ingredients": ["apple", "bread"]}
    
    print("🚀 Testing Multi-Source Pipeline...")
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        print(f"Status: {response.status_code}")
        for res in data.get("results", []):
            print(f"🍴 {res['meal_name']}")
            print(f"🔗 {res['recipe_link']}\n")
            
            # Validation: Ensure link is actually there
            if not res['recipe_link'] or "No link" in res['recipe_link']:
                print("❌ FAIL: Empty link found!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_final_pipeline()