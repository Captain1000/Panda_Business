from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.crud import custom_design, order
from app.db.session import get_db
from app.dependencies import get_current_admin_user
from app.dependencies import get_current_user
from app.models import order as order_model, address as address_model, order_item as order_item_model
from app.models import tshirt as tshirt_model, custom_design as custom_model
from app.schemas.order import AddressCreate, OrderItemCreate
from pydantic import BaseModel
import razorpay
import hmac
import hashlib
import os
from fastapi.responses import JSONResponse

router = APIRouter()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@router.get("/custom/pending")
def get_pending_customs(db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return custom_design.get_pending_designs(db)

@router.post("/custom/approve/{id}")
def approve(id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return custom_design.approve_design(db, id)

@router.post("/custom/reject/{id}")
def reject(id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return custom_design.reject_design(db, id)

@router.get("/orders")
def get_all_orders(db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    return order.get_all_orders(db)

# -----------------------------
# Razorpay Payment Integration
# -----------------------------

class RazorpayOrderRequest(BaseModel):
    amount: int  # in rupees

@router.post("/create-razorpay-order")
def create_razorpay_order(data: RazorpayOrderRequest):
    payment = razorpay_client.order.create({
        "amount": data.amount * 100,
        "currency": "INR",
        "payment_capture": 1
    })
    return {"order_id": payment["id"]}

class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    items: list[OrderItemCreate]
    address: AddressCreate

@router.post("/payment/verify")
def verify_payment(data: RazorpayVerifyRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        generated_signature = hmac.new(
            bytes(RAZORPAY_KEY_SECRET, 'utf-8'),
            msg=bytes(f"{data.razorpay_order_id}|{data.razorpay_payment_id}", 'utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()

        if generated_signature != data.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid signature")

        # Save address
        new_address = address_model.Address(**data.address.dict())
        db.add(new_address)
        db.commit()
        db.refresh(new_address)

        # Save order
        new_order = order_model.Order(
            user_id=user.id,
            address_id=new_address.id,
            status="Paid",
            razorpay_payment_id=data.razorpay_payment_id
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        # Save order items
        for item in data.items:
            new_item = order_item_model.OrderItem(
                order_id=new_order.id,
                item_type=item.item_type,
                item_id=item.item_id,
                quantity=item.quantity
            )
            db.add(new_item)

        db.commit()

        return {"message": "Payment verified and order saved successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
