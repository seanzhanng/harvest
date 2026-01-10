from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

# Get the DB URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine
# echo=True means it prints SQL to the terminal (helpful for debugging)
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session