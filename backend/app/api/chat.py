from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models.user import User
from app.models.client import Client
from app.models.user_chat import UserChat
from app.models.chat_message import ChatMessage
from app.api.auth import get_current_user
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse, ChatCreate, ChatResponse

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def create_chat(
    chat_data: ChatCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get or create client (for now, use a default client)
    client = db.query(Client).filter(Client.id == 1).first()
    if not client:
        # Create default client if none exists
        client = Client(name="Default Client", description="Default client for mobile app")
        db.add(client)
        db.commit()
        db.refresh(client)
    
    # Create new chat
    db_chat = UserChat(
        user_id=current_user.id,
        client_id=client.id,
        title=chat_data.title or f"Chat {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    
    return {
        "id": db_chat.id,
        "title": db_chat.title,
        "user_id": db_chat.user_id,
        "client_id": db_chat.client_id,
        "created_on": db_chat.created_on
    }

@router.post("/{chat_id}/messages", response_model=ChatMessageResponse)
async def send_message(
    chat_id: int,
    message_data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify chat exists and belongs to user
    chat = db.query(UserChat).filter(
        UserChat.id == chat_id,
        UserChat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    # For now, simulate AI response (you can integrate with your AI service later)
    ai_response = f"AI Response to: {message_data.content}"
    
    # Create user message
    user_message = ChatMessage(
        user_chat_id=chat_id,
        user_id=current_user.id,
        client_id=chat.client_id,
        prompt=message_data.content,
        response=ai_response,
        is_voice=1 if message_data.is_voice else 0
    )
    db.add(user_message)
    
    # Update chat last message timestamp
    chat.last_message = datetime.utcnow()
    
    db.commit()
    db.refresh(user_message)
    
    return {
        "id": user_message.id,
        "content": user_message.prompt,
        "response": user_message.response,
        "is_voice": bool(user_message.is_voice),
        "created_on": user_message.created_on
    }

@router.get("/{chat_id}/messages", response_model=List[ChatMessageResponse])
async def get_chat_messages(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify chat exists and belongs to user
    chat = db.query(UserChat).filter(
        UserChat.id == chat_id,
        UserChat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    # Get messages
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_chat_id == chat_id
    ).order_by(ChatMessage.created_on.asc()).all()
    
    return [
        {
            "id": msg.id,
            "content": msg.prompt,
            "response": msg.response,
            "is_voice": bool(msg.is_voice),
            "created_on": msg.created_on
        }
        for msg in messages
    ]

@router.get("/", response_model=List[ChatResponse])
async def get_user_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chats = db.query(UserChat).filter(
        UserChat.user_id == current_user.id
    ).order_by(UserChat.last_message.desc().nullslast(), UserChat.created_on.desc()).all()
    
    return [
        {
            "id": chat.id,
            "title": chat.title,
            "user_id": chat.user_id,
            "client_id": chat.client_id,
            "created_on": chat.created_on
        }
        for chat in chats
    ] 