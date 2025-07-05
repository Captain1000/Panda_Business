from fastapi import APIRouter, Depends, HTTPException
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

@router.put("/address/{address_id}", response_model=AddressOut)
def update_address(address_id: int, data: AddressCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    existing = address.get_address_by_id(db, address_id)
    if not existing or existing.user_id != user.id:
        raise HTTPException(status_code=404, detail="Address not found")
    return address.update_address(db, existing, data)

@router.delete("/address/{address_id}")
def delete_address(address_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    existing = address.get_address_by_id(db, address_id)
    if not existing or existing.user_id != user.id:
        raise HTTPException(status_code=404, detail="Address not found")
    address.delete_address(db, existing)
    return {"message": "Address deleted successfully"}

