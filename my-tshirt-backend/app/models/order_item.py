# app/models/order_item.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    item_type = Column(String)  # e.g., "tshirt" or "custom"
    item_id = Column(Integer)
    quantity = Column(Integer)

    # 🔄 Back-reference to the parent order
    order = relationship("Order", back_populates="items")
