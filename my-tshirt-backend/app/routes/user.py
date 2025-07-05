from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserUpdate, UserOut
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_current_user_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user = db.query(User).options(joinedload(User.addresses)).filter(User.id == current_user.id).first()
    return current_user

@router.put("/me")
def update_user_info(
    update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if update.dark_mode is not None:
        current_user.dark_mode = update.dark_mode
    if update.address is not None:
        current_user.address = update.address
    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "dark_mode": current_user.dark_mode,
        "address": current_user.address,
    }
