from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
import uvicorn
import os
import logging

from app.core.config import settings
from app.api import auth, chat, documents, users
from app.core.database import engine, Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("alphalabs.api")

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AlphaLabs Mobile API",
    description="Backend API for AlphaLabs Mobile Application",
    version="1.0.0",
)

# CORS (tighten in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(auth, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat, prefix="/api/chat", tags=["Chat"])
app.include_router(documents, prefix="/api/documents", tags=["Documents"])
app.include_router(users, prefix="/api/users", tags=["Users"])

@app.on_event("startup")
async def on_startup():
    logger.info("Starting AlphaLabs Mobile API")
    # Optional quick DB ping at startup (non-fatal)
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("DB connectivity OK")
    except Exception as e:
        logger.warning(f"DB connectivity check failed: {e}")

@app.get("/")
async def root():
    return {"message": "AlphaLabs Mobile API is running!"}

@app.get("/health")
async def health_check():
    db_ok = True
    db_err = None
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        db_ok = False
        db_err = str(e)
    return {
        "status": "healthy" if db_ok else "degraded",
        "service": "AlphaLabs Mobile API",
        "db": {"ok": db_ok, "error": db_err},
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,            
        reload=True,            
        access_log=True,
        log_level="debug",
        proxy_headers=True,
        forwarded_allow_ips="*",
    )
