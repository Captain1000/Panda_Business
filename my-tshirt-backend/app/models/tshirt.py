from sqlalchemy import Column, Integer, String, Float, JSON
from app.db.session import Base

class TShirt(Base):
    __tablename__ = "tshirts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    image = Column(String, nullable=False)
    colors = Column(JSON)
    sizes = Column(JSON)

