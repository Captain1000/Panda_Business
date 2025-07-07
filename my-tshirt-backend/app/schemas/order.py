from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- For Order Placement ---
class AddressCreate(BaseModel):
    full_name: str
    street: str
    city: str
    state: str
    pincode: str
    phone: str


class OrderItemCreate(BaseModel):
    item_type: str  # e.g., "tshirt"
    item_id: int
    quantity: int


class OrderCreate(BaseModel):
    address: AddressCreate
    items: List[OrderItemCreate]


# --- For Order Response ---
class AddressOut(BaseModel):
    full_name: str
    street: str
    city: str
    state: str
    pincode: str
    phone: str

    model_config = ConfigDict(from_attributes=True)


class OrderItemOut(BaseModel):
    item_type: str
    item_id: int
    quantity: int
    name: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None        
    subtotal: Optional[float] = None  

    model_config = ConfigDict(from_attributes=True)


class OrderOut(BaseModel):
    id: int
    address: Optional[AddressOut]
    order_date: datetime
    status: str
    items: List[OrderItemOut]
    total_price: Optional[float] = None  

    model_config = ConfigDict(from_attributes=True)
