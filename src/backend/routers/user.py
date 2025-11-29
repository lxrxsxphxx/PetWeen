from fastapi import APIRouter

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

@router.get("/")
def get_user():
    return ["example"]

