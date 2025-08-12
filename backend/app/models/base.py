from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime
from datetime import datetime

Base = declarative_base()

class TimestampMixin:
    """Mixin to add created_on and updated_on timestamps to models"""
    created_on = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_on = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False) 