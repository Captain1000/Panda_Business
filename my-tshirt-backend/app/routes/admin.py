from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.crud import custom_design
from app.db.session import get_db
from app.dependencies import get_current_admin_user
from app.models import order as order_model, tshirt as tshirt_model, custom_design as custom_model
from app.models.tshirt import TShirt
from app.schemas.order import OrderOut, OrderItemOut, AddressOut
from app.models.order_item import OrderItem

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
        address = AddressOut.from_orm(order.address) if order.address else None

        item_objs = []
        total_price = 0.0
        for item in order.items:
            item_info = {
                "item_type": item.item_type,
                "item_id": item.item_id,
                "quantity": item.quantity,
                "price": 0.0,
                "subtotal": 0.0
            }

            if item.item_type == "tshirt":
                tshirt = db.query(tshirt_model.TShirt).filter_by(id=item.item_id).first()
                if tshirt:
                    item_info["name"] = tshirt.name
                    item_info["image"] = tshirt.image
                    item_info["price"] = tshirt.price
                    item_info["subtotal"] = tshirt.price * item.quantity
                    total_price += item_info["subtotal"]

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
            items=item_objs,
            total_price=total_price
        ))

    return result



@router.get("/sales-stats")
def get_sales_stats(db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    from datetime import datetime

    now = datetime.utcnow()
    current_month = now.month
    current_year = now.year

    # 🔢 Total sales this month (T-shirt items only)
    total_sales_this_month = (
        db.query(func.sum(OrderItem.quantity))
        .filter(
            OrderItem.item_type == "tshirt",
            extract("month", order_model.Order.order_date) == current_month,
            extract("year", order_model.Order.order_date) == current_year,
            OrderItem.order_id == order_model.Order.id
        )
        .scalar() or 0
    )

    # 🔢 Total sales last month
    last_month = current_month - 1 if current_month > 1 else 12
    last_month_year = current_year if current_month > 1 else current_year - 1

    total_sales_last_month = (
        db.query(func.sum(OrderItem.quantity))
        .filter(
            OrderItem.item_type == "tshirt",
            extract("month", order_model.Order.order_date) == last_month,
            extract("year", order_model.Order.order_date) == last_month_year,
            OrderItem.order_id == order_model.Order.id
        )
        .scalar() or 0
    )

    # 🔢 Total sales this year
    total_sales_this_year = (
        db.query(func.sum(OrderItem.quantity))
        .filter(
            OrderItem.item_type == "tshirt",
            extract("year", order_model.Order.order_date) == current_year,
            OrderItem.order_id == order_model.Order.id
        )
        .scalar() or 0
    )

    # 🔝 Top 5 best-selling T-shirts
    top_tshirts = (
        db.query(OrderItem.item_id, func.sum(OrderItem.quantity).label("total"))
        .filter(OrderItem.item_type == "tshirt")
        .group_by(OrderItem.item_id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    top_selling = []
    for item_id, total in top_tshirts:
        tshirt = db.query(TShirt).filter(TShirt.id == item_id).first()
        if tshirt:
            top_selling.append({
                "id": tshirt.id,
                "name": tshirt.name,
                "image": tshirt.image,
                "total_sold": total
            })

    return {
        "total_sales": {
            "this_month": total_sales_this_month,
            "last_month": total_sales_last_month,
            "this_year": total_sales_this_year,
        },
        "top_5_tshirts": top_selling,
    }