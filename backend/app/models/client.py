from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class Client(Base, TimestampMixin):
    __tablename__ = 'clients'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    chats = relationship("UserChat", back_populates="client", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="client")

    def __repr__(self):
        return f"<Client(id={self.id}, name={self.name})>" 