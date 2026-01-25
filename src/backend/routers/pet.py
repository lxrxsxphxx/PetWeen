from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.pet import Pet
from backend.schemas.pet import PetCreate, PetOut

router = APIRouter(
    prefix="/pets",
    tags=["Pets"]
)


@router.post("/", response_model=PetOut)
def create_pet(pet: PetCreate, db: Session = Depends(get_db)):
    new_pet = Pet(
        name=pet.name,
        species=pet.species,
        chunky=pet.chunky,
        size=pet.size
    )

    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)

    return new_pet

