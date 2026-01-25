from pydantic import BaseModel
from typing import List, Optional

class PetCreate(BaseModel):
    name: str
    species: str
    chunky: int
    size: int

class PetOut(PetCreate):
    id: int

    class Config:
        from_attributes = True
