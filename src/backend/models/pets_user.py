from sqlalchemy import Table, Column, Integer, ForeignKey
from backend.database import Base

user_pets = Table(
    "user_pets",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("pet_id", Integer, ForeignKey("pets.id"), primary_key=True),
)
