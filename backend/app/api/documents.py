from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from datetime import datetime

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.document import Document
from app.api.auth import get_current_user
from app.schemas.document import DocumentResponse, DocumentCreate

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file size
    if file.size and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE} bytes"
        )
    
    # Validate file type (basic check)
    allowed_types = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png"
    ]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not allowed"
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Get or create default client
    from app.models.client import Client
    client = db.query(Client).filter(Client.id == 1).first()
    if not client:
        client = Client(name="Default Client", description="Default client for mobile app")
        db.add(client)
        db.commit()
        db.refresh(client)
    
    # Create document record
    document = Document(
        client_id=client.id,
        title=file.filename,
        original_filename=file.filename,
        file_path=file_path,
        file_size=len(content),
        mime_type=file.content_type,
        uploaded_by=current_user.id
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return {
        "id": document.id,
        "title": document.title,
        "original_filename": document.original_filename,
        "file_size": document.file_size,
        "mime_type": document.mime_type,
        "uploaded_by": document.uploaded_by,
        "created_on": document.created_on
    }

@router.get("/", response_model=List[DocumentResponse])
async def get_user_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    documents = db.query(Document).filter(
        Document.uploaded_by == current_user.id,
        Document.is_deleted == False
    ).order_by(Document.created_on.desc()).all()
    
    return [
        {
            "id": doc.id,
            "title": doc.title,
            "original_filename": doc.original_filename,
            "file_size": doc.file_size,
            "mime_type": doc.mime_type,
            "uploaded_by": doc.uploaded_by,
            "created_on": doc.created_on
        }
        for doc in documents
    ]

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.uploaded_by == current_user.id,
        Document.is_deleted == False
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return {
        "id": document.id,
        "title": document.title,
        "original_filename": document.original_filename,
        "file_size": document.file_size,
        "mime_type": document.mime_type,
        "uploaded_by": document.uploaded_by,
        "created_on": document.created_on
    } 