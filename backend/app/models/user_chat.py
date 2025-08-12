from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class UserChat(Base, TimestampMixin):
    __tablename__ = 'user_chats'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    client_id = Column(Integer, ForeignKey('clients.id'), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    last_message = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="chats")
    client = relationship("Client", back_populates="chats")
    messages = relationship("ChatMessage", back_populates="user_chat", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<UserChat(id={self.id}, user_id={self.user_id}, client_id={self.client_id})>" 