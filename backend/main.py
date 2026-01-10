from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import Food
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CRITICAL: Allow Next.js (port 3000) to talk to this backend
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run this when the server starts to create tables if they don't exist
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Harvest API is running!"}

# GET all foods
@app.get("/foods/")
def read_foods(session: Session = Depends(get_session)):
    foods = session.exec(select(Food)).all()
    return foods

# POST (add) a food
@app.post("/foods/")
def create_food(food: Food, session: Session = Depends(get_session)):
    session.add(food)
    session.commit()
    session.refresh(food)
    return food