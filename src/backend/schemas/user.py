from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str

class UserOut(BaseModel):
    id: int
    name: str
    profile_image: str | None = None

    class Config:
        from_attributes = True  # für SQLAlchemy
