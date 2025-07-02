from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    dark_mode: bool

class UserOut(UserBase):
    id: int
    role: str
    dark_mode: Optional[bool] = False  # Add this line

    class Config:
        orm_mode = True
