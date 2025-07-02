from sqlalchemy.orm import Session
from app.models.custom_design import CustomDesign
from app.schemas.custom_design import CustomDesignCreate

def create_custom_design(db: Session, user_id: int, design: CustomDesignCreate):
    db_design = CustomDesign(user_id=user_id, **design.dict())
    db.add(db_design)
    db.commit()
    db.refresh(db_design)
    return db_design

def get_user_designs(db: Session, user_id: int):
    return db.query(CustomDesign).filter(CustomDesign.user_id == user_id).all()

def approve_design(db: Session, id: int):
    design = db.query(CustomDesign).filter(CustomDesign.id == id).first()
    if design:
        design.status = "approved"
        db.commit()
    return design

def reject_design(db: Session, id: int):
    design = db.query(CustomDesign).filter(CustomDesign.id == id).first()
    if design:
        design.status = "rejected"
        db.commit()
    return design

def get_pending_designs(db: Session):
    return db.query(CustomDesign).filter(CustomDesign.status == "pending").all()

