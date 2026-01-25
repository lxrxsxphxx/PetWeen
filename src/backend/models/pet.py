from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.database import Base
from backend.models.pets_user import user_pets


class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    chunky = Column(Integer, nullable=False)
    size = Column(Integer, nullable=False)

    owners = relationship(
        "User",
        secondary=user_pets,
        back_populates="pets"
    )
