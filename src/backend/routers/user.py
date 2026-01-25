from fastapi import APIRouter, Depends, UploadFile, File
from starlette.staticfiles import StaticFiles

from sqlalchemy.orm import Session
import os

from backend.database import get_db, SessionLocal
from backend.models.user import User
from backend.schemas.user import UserCreate, UserOut


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

@router.get("/")
def list_user(db: Session = Depends(get_db)):
    return db.query(User).all()