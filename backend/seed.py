from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import Food

def seed_data():
    with Session(engine) as session:
        # Check if we already have data
        existing = session.exec(select(Food)).first()
        if existing:
            print("⚠️  Data already exists. Skipping seed to prevent duplicates.")
            return

        print("🌱 Seeding data...")
        
        foods = [
            Food(name="Apple", season="Fall", eco_score=8, base_price=0.99, description="Crisp and sweet, great for baking."),
            Food(name="Banana", season="All Year", eco_score=6, base_price=0.29, description="High potassium, imported."),
            Food(name="Strawberry", season="Summer", eco_score=9, base_price=2.99, description="Sweet local berries."),
            Food(name="Pumpkin", season="Fall", eco_score=10, base_price=5.00, description="Perfect for soups and pies."),
            Food(name="Blueberry", season="Summer", eco_score=9, base_price=3.99, description="Antioxidant rich."),
            Food(name="Orange", season="Winter", eco_score=7, base_price=0.89, description="Citrus burst, usually imported."),
            Food(name="Tomato", season="Summer", eco_score=9, base_price=1.50, description="Vine ripened is best."),
            Food(name="Spinach", season="Spring", eco_score=10, base_price=2.50, description="Local greens, very low footprint."),
            Food(name="Avocado", season="All Year", eco_score=4, base_price=1.99, description="High water usage, imported."),
            Food(name="Corn", season="Summer", eco_score=8, base_price=0.50, description="Sweet summer staple."),
        ]

        for food in foods:
            session.add(food)
        
        session.commit()
        print("✅ Success! Database seeded.")

if __name__ == "__main__":
    create_db_and_tables()
    seed_data()