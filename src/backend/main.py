from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database import Base, engine, SessionLocal
from backend.routers import user, pet

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(pet.router)


@app.get("/hello")
def hello():
    return {"message": "Hello from FastAPI!"}

# Tabellen erstellen
Base.metadata.create_all(bind=engine)

