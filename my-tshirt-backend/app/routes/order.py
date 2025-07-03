from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.models import order as order_model, address as address_model
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate, OrderOut, OrderItemOut, AddressOut
from app.dependencies import get_current_user
from app.models.order import Order
from app.models import tshirt as tshirt_model, custom_design as custom_model

router = APIRouter()


@router.post("/orders")
def place_order(order_data: OrderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Create address
    new_address = address_model.Address(
        user_id=user.id,
        full_name=order_data.address.full_name,
        street=order_data.address.street,
        city=order_data.address.city,
        state=order_data.address.state,
        pincode=order_data.address.pincode,
        phone=order_data.address.phone,
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)

    # Create order
    new_order = order_model.Order(
        user_id=user.id,
        address_id=new_address.id,
        status="placed"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Add items
    for item in order_data.items:
        db.add(OrderItem(
            order_id=new_order.id,
            item_type=item.item_type,
            item_id=item.item_id,
            quantity=item.quantity
        ))
    db.commit()

    return {"detail": "✅ Order placed successfully"}


# @router.get("/orders/my", response_model=List[OrderOut])
# def get_my_orders(
#     db: Session = Depends(get_db),
#     user=Depends(get_current_user)
# ):
#     orders = db.query(Order).filter(Order.user_id == user.id).all()
#     return orders  # FastAPI + Pydantic will auto-convert using `orm_mode`

@router.get("/orders/my", response_model=List[OrderOut])
def get_my_orders(db: Session = Depends(get_db), user=Depends(get_current_user)):
    orders = db.query(order_model.Order).filter(order_model.Order.user_id == user.id).all()
    result = []

    for order in orders:
        # Convert related address model to Pydantic
        address = AddressOut.from_orm(order.address)

        item_objs = []
        total_price = 0.0

        for item in order.items:
            item_info = {
                "item_type": item.item_type,
                "item_id": item.item_id,
                "quantity": item.quantity,
                "name": None,
                "image": None,
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
                    item_info["price"] = custom.price
                    item_info["subtotal"] = custom.price * item.quantity
                    total_price += item_info["subtotal"]

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
