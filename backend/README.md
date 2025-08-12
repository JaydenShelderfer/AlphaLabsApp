# AlphaLabs Mobile Backend

FastAPI backend for the AlphaLabs mobile application, providing authentication, chat functionality, and document management.

## 🏗️ Architecture

- **FastAPI** - Modern, fast web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **SQLAlchemy** - ORM for database operations
- **JWT** - Authentication tokens
- **Docker** - Containerized deployment

## 🚀 Quick Start

### 1. Start the Backend Services

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f api
```

### 2. Initialize Database

```bash
# Run database initialization
python init_db.py
```

### 3. Access the API

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **pgAdmin**: http://localhost:5050 (admin@alphalabs.com / admin)

## 🔐 Authentication

### Test User Credentials
- **Email**: test@alphalabs.com
- **Password**: password123

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

## 💬 Chat API

- `POST /api/chat/` - Create new chat
- `POST /api/chat/{chat_id}/messages` - Send message
- `GET /api/chat/{chat_id}/messages` - Get chat history
- `GET /api/chat/` - Get user chats

## 📄 Document API

- `POST /api/documents/upload` - Upload document
- `GET /api/documents/` - Get user documents
- `GET /api/documents/{document_id}` - Get specific document

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| API | 8000 | FastAPI backend |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| pgAdmin | 5050 | Database management |

## 🔧 Development

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables
Create a `.env` file:
```env
DATABASE_URL=postgresql://dev:dev@localhost:5432/alphalabs_mobile
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
```

## 📊 Database Schema

### Core Models
- **User** - User accounts and authentication
- **Client** - Client organizations
- **UserChat** - Chat sessions
- **ChatMessage** - Individual messages
- **Document** - File uploads

### Relationships
- User → UserChat (one-to-many)
- UserChat → ChatMessage (one-to-many)
- User → Document (one-to-many)
- Client → UserChat (one-to-many)

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest

# Run with coverage
pytest --cov=app
```

## 🚀 Production Deployment

1. **Update environment variables**
2. **Set proper SECRET_KEY**
3. **Configure CORS origins**
4. **Set up SSL/TLS**
5. **Configure database backups**

## 📝 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 Integration with Mobile App

The mobile app connects to this backend via:
- **Base URL**: http://localhost:8000
- **API Version**: v1
- **Authentication**: JWT Bearer tokens
- **CORS**: Enabled for mobile app access

---

**Built for AlphaLabs Intelligence - Mobile Application Backend** 