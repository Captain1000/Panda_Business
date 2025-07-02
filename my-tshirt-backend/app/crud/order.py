from sqlalchemy.orm import Session
from app.models.order import Order
from app.schemas.order import OrderCreate

def create_order(db: Session, user_id: int, order_data: OrderCreate):
    new_order = Order(
        user_id=user_id,
        item_type=order_data.item_type,
        item_id=order_data.item_id,
        address_id=order_data.address_id,
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

def get_user_orders(db: Session, user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.order_date.desc()).all()

def confirm_order(db: Session, order_id: int, user_id: int):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        return None
    order.status = "confirmed"
    db.commit()
    db.refresh(order)
    return order

def cancel_order(db: Session, order_id: int, user_id: int):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        return None
    order.status = "cancelled"
    db.commit()
    db.refresh(order)
    return order
