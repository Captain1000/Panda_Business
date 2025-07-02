from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base

class CustomDesign(Base):
    __tablename__ = "custom_designs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tshirt_id = Column(Integer, ForeignKey("tshirts.id"))
    text = Column(String)
    text_color = Column(String)
    selected_color = Column(String)
    status = Column(String, default="pending")

