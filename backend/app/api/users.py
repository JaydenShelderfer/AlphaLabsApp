from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.api.auth import get_current_user
from app.schemas.auth import UserResponse

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "is_active": current_user.is_active
    }

@router.get("/", response_model=List[UserResponse])
async def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # For now, only return current user
    # In production, you might want to add admin checks
    users = db.query(User).filter(User.id == current_user.id).all()
    
    return [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "is_active": user.is_active
        }
        for user in users
    ] 