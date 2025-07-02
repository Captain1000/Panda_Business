from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.custom_design import CustomDesignCreate, CustomDesignOut
from app.crud import custom_design
from app.db.session import get_db
from app.dependencies import get_current_user
from typing import List

router = APIRouter()

@router.post("/custom", response_model=CustomDesignOut)
def submit_custom(design: CustomDesignCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return custom_design.create_custom_design(db, user.id, design)

@router.get("/custom", response_model=List[CustomDesignOut])
def my_customs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return custom_design.get_user_designs(db, user.id)
