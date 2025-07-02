from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserUpdate, UserOut

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.put("/me/dark-mode")
def update_dark_mode(
    update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.dark_mode = update.dark_mode
    db.commit()
    db.refresh(current_user)
    return {"dark_mode": current_user.dark_mode}
