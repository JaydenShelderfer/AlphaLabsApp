from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(63), nullable=False, unique=True, index=True)
    name = Column(String(63), nullable=False)
    password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    # Relationships
    chats = relationship("UserChat", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="uploader")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>" 