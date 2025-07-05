from pydantic import BaseModel

class AddressBase(BaseModel):
    full_name: str
    street: str
    city: str
    state: str
    pincode: str
    phone: str

class AddressCreate(AddressBase):
    pass

class AddressOut(AddressBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True

