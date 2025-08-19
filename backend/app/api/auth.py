from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional, Dict, Any
import uuid

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.models.client import Client
from app.models.user_chat import UserChat
from app.schemas.auth import UserCreate, UserLogin, Token, TokenData, SigninRequest, SigninResponse, UserResponse

router = APIRouter()

# JWT Constants
JWT_ALGORITHM = 'HS256'
JWT_ISSUER = {
    'name': 'alpha-labs-mobile-api',
    'version': '1.0.0',
    'environment': settings.ENVIRONMENT,
    'url': 'http://localhost:8000'
}

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def generate_jwt_token(user: User, client_id: int = 1) -> str:
    """Generate JWT token with enhanced claims similar to alpha-labs-platform"""
    now = datetime.utcnow()
    
    # Generate JWT token with enhanced claims
    token = jwt.encode({
        # Standard JWT claims
        'iss': JWT_ISSUER['name'],           # Issuer name
        'sub': str(user.id),                 # Subject (user ID)
        'aud': f"{settings.ENVIRONMENT}-alpha-labs-mobile",  # Audience
        'iat': now,                          # Issued at
        'exp': now + timedelta(days=1),      # Expiration
        'jti': str(uuid.uuid4()),            # JWT ID
        
        # Custom issuer claims
        'issuer': {
            'name': JWT_ISSUER['name'],
            'version': JWT_ISSUER['version'],
            'environment': JWT_ISSUER['environment'],
            'url': JWT_ISSUER['url']
        },
        
        # User claims
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'client_id': client_id,
            'created_at': user.created_on.isoformat() if user.created_on else None
        },
        
        # Token metadata
        'token_type': 'access',
        'token_use': 'api_access'
    }, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    return token

def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    # Dev bypass when enabled
    if settings.DISABLE_AUTH:
        # Return the first user or create the test user if none exists
        user = db.query(User).first()
        if user:
            return user
        # Create test user if not present
        hashed = get_password_hash(settings.TEST_USER_PASSWORD)
        user = User(email=settings.TEST_USER_EMAIL, name=settings.TEST_USER_NAME, password=hashed)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Decode the JWT token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM])
        
        user_id_claim = payload.get("user", {}).get("id")
        if user_id_claim is None:
            raise credentials_exception
        # Coerce to integer to match database column type
        try:
            user_id = int(user_id_claim)
        except (TypeError, ValueError):
            raise credentials_exception
            
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise credentials_exception
            
        return user
        
    except JWTError:
        raise credentials_exception
    except Exception as e:
        raise credentials_exception

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = get_user(db, email=user_data.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signin", response_model=SigninResponse)
async def signin(request: SigninRequest, http_request: Request, db: Session = Depends(get_db)):
    """Signin endpoint similar to alpha-labs-platform"""
    user = db.query(User).filter_by(email=request.email).first()
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Get or create default client
    client = db.query(Client).filter(Client.id == 1).first()
    if not client:
        client = Client(name="Default Client", description="Default client for mobile app")
        db.add(client)
        db.commit()
        db.refresh(client)
    
    # Generate JWT token
    token = generate_jwt_token(user, client.id)
    
    # Create user response
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        is_active=user.is_active,
        client_id=client.id
    )
    
    return SigninResponse(
        token=token,
        user=user_response,
        issuer=JWT_ISSUER
    )

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "is_active": current_user.is_active
    } 