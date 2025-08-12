from sqlalchemy import Column, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class ChatMessage(Base, TimestampMixin):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_chat_id = Column(Integer, ForeignKey('user_chats.id'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    client_id = Column(Integer, ForeignKey('clients.id'), nullable=False, index=True)
    prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    source = Column(JSON, nullable=True)
    rating = Column(JSON, nullable=True)
    context = Column(JSON, nullable=True)
    is_voice = Column(Integer, default=0, nullable=False)  # 0 = text, 1 = voice

    # Relationships
    user_chat = relationship("UserChat", back_populates="messages")
    user = relationship("User")
    client = relationship("Client")

    def __repr__(self):
        return f"<ChatMessage(id={self.id}, user_chat_id={self.user_chat_id})>" 