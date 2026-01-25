from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import SessionLocal, get_db
from backend.models.pet import Pet
from backend.schemas.pet import PetCreate, PetOut

router = APIRouter(
    prefix="/pets",
    tags=["Pets"]
)


@router.post("/", response_model=PetOut)
def create_pet(pet: PetCreate, db: Session = Depends(get_db)):
    db_pet = Pet(
        name=pet.name,
        species=pet.species,
        chunky=pet.chunky,
        size=pet.size
    )

    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)

    return db_pet
