from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatCreate(BaseModel):
    title: Optional[str] = None

class ChatResponse(BaseModel):
    id: int
    title: str
    user_id: int
    client_id: int
    created_on: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    content: str
    is_voice: bool = False

class ChatMessageResponse(BaseModel):
    id: int
    content: str
    response: str
    is_voice: bool
    created_on: datetime

    class Config:
        from_attributes = True 