# app/models/order.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    address_id = Column(Integer, ForeignKey("addresses.id"))
    order_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="placed")

    # 🧾 One order has many items
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")

    # 📦 One order is associated with one address
    address = relationship("Address", backref="orders")
