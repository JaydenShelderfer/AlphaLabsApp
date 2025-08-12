from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://dev:dev@localhost:5433/alphalabs_mobile"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6380/0"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Environment
    ENVIRONMENT: str = "dev"
    DEBUG: bool = True
    
    # API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "AlphaLabs Mobile API"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True) 