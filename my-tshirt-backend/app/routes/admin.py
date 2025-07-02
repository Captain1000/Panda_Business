from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.crud import custom_design
from app.db.session import get_db
from app.dependencies import get_current_admin_user
from app.models import order as order_model, tshirt as tshirt_model, custom_design as custom_model
from app.schemas.order import OrderOut, OrderItemOut, AddressOut

router = APIRouter()


@router.get("/custom/pending")
def get_pending_customs(db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return custom_design.get_pending_designs(db)


@router.post("/custom/approve/{id}")
def approve(id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return custom_design.approve_design(db, id)


@router.post("/custom/reject/{id}")
def reject(id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return custom_design.reject_design(db, id)


@router.get("/orders", response_model=List[OrderOut])
def get_all_orders(db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    orders = db.query(order_model.Order).all()
    result = []

    for order in orders:
        address = AddressOut.from_orm(order.address)

        item_objs = []
        for item in order.items:
            item_info = {
                "item_type": item.item_type,
                "item_id": item.item_id,
                "quantity": item.quantity,
            }

            if item.item_type == "tshirt":
                tshirt = db.query(tshirt_model.TShirt).filter_by(id=item.item_id).first()
                if tshirt:
                    item_info["name"] = tshirt.name
                    item_info["image"] = tshirt.image

            elif item.item_type == "custom":
                custom = db.query(custom_model.CustomDesign).filter_by(id=item.item_id).first()
                if custom:
                    item_info["name"] = custom.name
                    item_info["image"] = custom.image

            item_objs.append(OrderItemOut(**item_info))

        result.append(OrderOut(
            id=order.id,
            address=address,
            order_date=order.order_date,
            status=order.status,
            items=item_objs
        ))

    return result
