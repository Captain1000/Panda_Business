from sqlalchemy.orm import Session
from app.models.address import Address
from app.schemas.address import AddressCreate

def create_address(db: Session, user_id: int, address: AddressCreate):
    db_address = Address(user_id=user_id, **address.dict())
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address

def get_user_addresses(db: Session, user_id: int):
    return db.query(Address).filter(Address.user_id == user_id).all()

