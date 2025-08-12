from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentCreate(BaseModel):
    title: Optional[str] = None

class DocumentResponse(BaseModel):
    id: int
    title: str
    original_filename: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    uploaded_by: Optional[int] = None
    created_on: datetime

    class Config:
        from_attributes = True 