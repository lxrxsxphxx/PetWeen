from backend.database import SessionLocal, engine
from backend.models.user import User
from backend.models.pet import Pet
from backend.models.relas import user_pets, friendships
from backend.database import Base

Base.metadata.create_all(bind=engine)

# Session starten
db = SessionLocal()

# Beispiel-User anlegen

user_names = [  "Alice", "Grace", "Eva", "Talia",
                "Kate", "Zephin", "Darin", "Fionn",
                "Esben", "Haruno", "Allan", "Jules",
                "Izana", "Inui", "Mickey", "Daisy",
                "Pluto", "Moritz"]

users = [User(name=name) for name in user_names]

db.add_all(users)
db.commit()

# Freundschaften händisch
# user1.friends.append(user2)
# user2.friends.append(user3)

db.commit()

# Freundschaften automatisch
import random

for user in users:
    friends_sample = random.sample(users, k=random.randint(0, len(users)-1))
    for f in friends_sample:
        if f != user and f not in user.friends:
            user.friends.append(f)

db.commit()



# Pets erstellen
pet_data = [
    {"name": "Bulki",           "species": "Cat",   "chunky": 80, "size": 10},
    {"name": "Vivi",            "species": "Dino",  "chunky": 0, "size": 0},
    {"name": "Nala",            "species": "Frog",  "chunky": 0, "size": 0},
    {"name": "Cali",            "species": "Cat",   "chunky": 0, "size": 0},
    {"name": "Yelena",          "species": "Dino",  "chunky": 0, "size": 0},
    {"name": "Charlyn",         "species": "Frog",  "chunky": 0, "size": 0},
    {"name": "Bonni",           "species": "Dino",  "chunky": 0, "size": 0},
    {"name": "Millie",          "species": "Frog",  "chunky": 0, "size": 0},
    {"name": "Hela",            "species": "Cat",   "chunky": 0, "size": 0},
    {"name": "Nami",            "species": "Dino",  "chunky": 0, "size": 0},
    {"name": " Artemis",        "species": "Frog",  "chunky": 0, "size": 0},
    {"name": "Calipso",         "species": "Dino",  "chunky": 0, "size": 0},
    {"name": "Zoe",             "species": "Frog",  "chunky": 0, "size": 0},
    {"name": "Oreo",            "species": "Cat",   "chunky": 0, "size": 0},
    {"name": "Tiffi",           "species": "Dino",  "chunky": 0, "size": 0},
    {"name": "Willow",          "species": "Frog",  "chunky": 0, "size": 0},
    {"name": "Molly",           "species": "Dino",  "chunky": 0, "size": 0},
    {"name": "Rue",             "species": "Frog",  "chunky": 0, "size": 0},
    {"name": "Zelda",           "species": "Cat",   "chunky": 0, "size": 0},
    {"name": "Robin",           "species": "Dino",  "chunky": 0, "size": 0},
    {"name": "Tessa",           "species": "Frog",  "chunky": 0, "size": 0},
]

pets = [Pet(**data) for data in pet_data]  # **data entpackt dict in Argumente

db.add_all(pets)
db.commit()


# Pets den Usern zuweisen händisch
users[0].pets.append(pets[0])  # Alice bekommt Bulki
users[1].pets.append(pets[0])  # Grace bekommt Bulki auch
users[2].pets.append(pets[1])  # Eva bekommt Vivi


db.commit()

# automatisch
# Anzahl der Pets pro User zufällig zwischen 0 und 3
for user in users:
    pets_sample = random.sample(pets, k=random.randint(0, 3))
    for pet in pets_sample:
        if pet not in user.pets:
            user.pets.append(pet)

db.commit()




db.close()

print("Seeded database with users, pets, and friendships")
