from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.address import AddressCreate, AddressOut
from app.crud import address
from app.db.session import get_db
from app.dependencies import get_current_user
from typing import List

router = APIRouter()

@router.post("/address", response_model=AddressOut)
def add_address(data: AddressCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return address.create_address(db, user.id, data)

@router.get("/address", response_model=List[AddressOut])
def list_addresses(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return address.get_user_addresses(db, user.id)
