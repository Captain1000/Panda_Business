from sqlalchemy.orm import Session
from app.models.tshirt import TShirt
from app.schemas.tshirt import TShirtCreate, TShirtUpdate
from typing import Optional

def get_all_tshirts(db: Session):
    return db.query(TShirt).all()

def create_tshirt(db: Session, tshirt: TShirtCreate):
    db_tshirt = TShirt(**tshirt.dict())
    db.add(db_tshirt)
    db.commit()
    db.refresh(db_tshirt)
    return db_tshirt

def update_tshirt(db: Session, id: int, tshirt: TShirtUpdate):
    db_tshirt = db.query(TShirt).filter(TShirt.id == id).first()
    if db_tshirt:
        for field, value in tshirt.dict().items():
            setattr(db_tshirt, field, value)
        db.commit()
        db.refresh(db_tshirt)
    return db_tshirt

def delete_tshirt(db: Session, id: int):
    db_tshirt = db.query(TShirt).filter(TShirt.id == id).first()
    if db_tshirt:
        db.delete(db_tshirt)
        db.commit()
    return db_tshirt


def get_filtered_tshirts(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    color: Optional[str] = None,
    size: Optional[str] = None,
    max_price: Optional[float] = None,
):
    query = db.query(TShirt)

    if search:
        query = query.filter(TShirt.name.ilike(f"%{search}%"))
    if color:
        query = query.filter(TShirt.colors.contains([color]))
    if size:
        query = query.filter(TShirt.sizes.contains([size]))
    if max_price:
        query = query.filter(TShirt.price <= max_price)

    return query.offset(skip).limit(limit).all()
