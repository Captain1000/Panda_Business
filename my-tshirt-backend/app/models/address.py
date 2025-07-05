from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base


class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String)
    street = Column(String)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    phone = Column(String)