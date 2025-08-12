from sqlalchemy import Column, Integer, ForeignKey, String, BigInteger, Boolean
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class Document(Base, TimestampMixin):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(Integer, ForeignKey('clients.id'), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=True)  # in bytes
    mime_type = Column(String(100), nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    uploaded_by = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)

    # Relationships
    client = relationship("Client", back_populates="documents")
    uploader = relationship("User", back_populates="documents")

    def __repr__(self):
        return f"<Document(id={self.id}, title={self.title}, filename={self.original_filename})>" 