# schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
# from app.schemas.address import AddressOut

class AddressOut(BaseModel):
    id: int
    full_name: str
    street: str
    city: str
    state: str
    pincode: str
    phone: str

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    dark_mode: Optional[bool] = None

class UserOut(UserBase):
    id: int
    role: str
    dark_mode: Optional[bool] = False
    addresses: List[AddressOut] = []  # ✅ Add this

    class Config:
        orm_mode = True
