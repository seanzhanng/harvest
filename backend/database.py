from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os
from pathlib import Path

# 1. Force Python to find the .env file in the backend folder
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# 2. Get the URL
DATABASE_URL = os.getenv("DATABASE_URL")

# 3. Safety Check
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is missing! Check your .env file.")

# 4. Create engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def reset_db():
    # ⚠️ WARNING: This deletes all data!
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    print("♻️  Database completely reset and updated to new models.")