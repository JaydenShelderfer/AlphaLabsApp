#!/usr/bin/env python3
"""
Database initialization script for AlphaLabs Mobile
Creates initial data and default client
"""

import asyncio
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Base, User, Client
from app.api.auth import get_password_hash

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if default client exists
        default_client = db.query(Client).filter(Client.id == 1).first()
        if not default_client:
            print("Creating default client...")
            default_client = Client(
                name="AlphaLabs Mobile",
                description="Default client for mobile application"
            )
            db.add(default_client)
            db.commit()
            print("Default client created")
        else:
            print("Default client already exists")
        
        # Check if test user exists
        test_user = db.query(User).filter(User.email == "test@alphalabs.com").first()
        if not test_user:
            print("Creating test user...")
            test_user = User(
                email="test@alphalabs.com",
                name="Test User",
                password=get_password_hash("password123"),
                is_verified=True
            )
            db.add(test_user)
            db.commit()
            print("Test user created (email: test@alphalabs.com, password: password123)")
        else:
            print("Test user already exists")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing AlphaLabs Mobile Database...")
    init_db()
    print("Database initialization complete!") 