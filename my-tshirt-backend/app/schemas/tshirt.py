from pydantic import BaseModel
from typing import List

class TShirtBase(BaseModel):
    name: str
    price: float
    image: str
    colors: List[str]
    sizes: List[str]

class TShirtCreate(TShirtBase):
    pass

class TShirtUpdate(TShirtBase):
    pass

class TShirtOut(TShirtBase):
    id: int
    class Config:
        orm_mode = True
