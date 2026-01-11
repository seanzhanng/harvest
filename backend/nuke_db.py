import os
import sys
from sqlmodel import Session, text
from database import engine

from dotenv import load_dotenv
from pathlib import Path
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

def nuke_it():
    print("☢️  NUKING THE DATABASE...")
    with Session(engine) as session:
        session.exec(text("DROP TABLE IF EXISTS savedrecipe CASCADE;"))
        session.exec(text("DROP TABLE IF EXISTS food CASCADE;"))
        session.commit()
    
    print("✅ Tables dropped. The database is empty.")

if __name__ == "__main__":
    nuke_it()