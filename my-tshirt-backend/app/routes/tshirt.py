from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.tshirt import TShirtOut, TShirtCreate, TShirtUpdate
from app.crud import tshirt
from app.db.session import get_db
from app.dependencies import get_current_admin_user
from typing import List
from fastapi import Query
from typing import Optional

router = APIRouter()

@router.get("/tshirts", response_model=List[TShirtOut])
def list_tshirts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = Query(None),
    color: Optional[str] = Query(None),
    size: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None),
):
    return tshirt.get_filtered_tshirts(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        color=color,
        size=size,
        max_price=max_price
    )

@router.post("/tshirts", response_model=TShirtOut)
def add_tshirt(data: TShirtCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return tshirt.create_tshirt(db, data)

@router.put("/tshirts/{id}", response_model=TShirtOut)
def update(id: int, data: TShirtUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    result = tshirt.update_tshirt(db, id, data)
    if not result:
        raise HTTPException(404, "Not found")
    return result

@router.delete("/tshirts/{id}")
def delete(id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    result = tshirt.delete_tshirt(db, id)
    if not result:
        raise HTTPException(404, "Not found")
    return {"detail": "Deleted"}

