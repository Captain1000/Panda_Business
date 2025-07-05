from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.db.session import Base
from app.models.address import Address

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    dark_mode = Column(Boolean, default=False)

    addresses = relationship("Address", backref="user")  # ✅ Add this line
