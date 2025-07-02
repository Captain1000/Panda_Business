from pydantic import BaseModel

class CustomDesignCreate(BaseModel):
    tshirt_id: int
    text: str
    text_color: str
    selected_color: str

class CustomDesignOut(CustomDesignCreate):
    id: int
    status: str
    user_id: int
    class Config:
        orm_mode = True

