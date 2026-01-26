from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.database import Base
from backend.models.relas import user_pets, friendships

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    profile_image = Column(String, nullable=True)


    pets = relationship(
        "Pet",
        secondary=user_pets,
        back_populates="owners"
    )

    friends = relationship(
        "User",
        secondary=friendships,
        primaryjoin=id == friendships.c.user_id,
        secondaryjoin=id == friendships.c.friend_id,
        backref="friend_of"
    )