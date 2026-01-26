from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from sqlalchemy.orm import Session
import os

from backend.database import get_db

from backend.models.user import User
from backend.schemas.user import UserCreate, UserOut

from backend.models.pet import Pet

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

Upload_DIR = "uploads"
os.makedirs(Upload_DIR, exist_ok=True)

@router.post("/with-image", response_model=UserOut)
def create_user_with_image(
    name: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = image.filename
    filepath = os.path.join(Upload_DIR, filename)


    with open(filepath, "wb") as f:
        f.write(image.file.read())

    new_user = User(
        name=name,
        profile_image=filepath
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/{user_id}/pets/{pet_id}")
def add_pet_to_user(
    user_id: int,
    pet_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    if pet in user.pets:
        raise HTTPException(status_code=400, detail="Pet already assigned to user")

    user.pets.append(pet)
    db.commit()

    return {
        "message": f"Pet '{pet.name}' added to user '{user.name}'"
    }

from backend.schemas.user import UserOut

@router.post("/users/{user_id}/friend", response_model=UserOut)
def add_friend(
    user_id: int,
    friend_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    friend = db.query(User).filter(User.id == friend_id).first()

    user.friends.append(friend)
    friend.friends.append(user)

    db.commit()
    db.refresh(user)

    return user


@router.get("/")
def list_user(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/users/{user_id}/pets")
def get_pets_of_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user.pets

@router.get("/users/{user_id}/friends")
def get_friends(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user.friends

@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
