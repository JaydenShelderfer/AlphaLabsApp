# AlphaLabs Mobile App

This repository is **frontend** only. All server/API logic is in main Alphalabs repo.

## 🚀 Features

- **Chat Interface**: Text and voice input with Alphi AI
- **Voice Input**: Record and send voice messages
- **Document Upload**: Select and analyze documents
- **Chat History**: Persistent conversation storage
- **Mobile-First Design**: Touch-optimized, voice-friendly interface
- **Brand Integration**: AlphaLabs colors and branding
- **Full Backend**: Production-ready FastAPI backend with PostgreSQL

## 🏗️ Tech Stack

### **Frontend (Mobile App)**
- **Framework**: Expo + React Native + TypeScript
- **State Management**: Zustand with persistence
- **UI Components**: React Native Paper
- **Voice Processing**: Expo Speech + Expo AV
- **Storage**: AsyncStorage for chat persistence

### **Backend (API Server)**
- **Framework**: FastAPI + Python
- **Database**: PostgreSQL 15
- **Cache**: Redis
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens
- **Containerization**: Docker + Docker Compose

## 📱 Getting Started

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Docker Desktop
- iOS Simulator (for iOS development) or Android Emulator

### **Installation & Setup**

#### **1. Clone and Install Dependencies**
```bash
git clone <your-repo-url>
cd AlphaLabsMobile
npm install
```
#### **2. Start Mobile App**
```bash
# In the root directory
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Run on Web
npm run web
```

## 🔧 Configuration

### **Mobile App API**
- **Base URL**: http://localhost:8000
- **Authentication**: JWT Bearer tokens
- **CORS**: Enabled for mobile app access

### **Test Credentials**
- **Email**: test@alphalabs.com
- **Password**: password123

## 📁 Project Structure

```
AlphaLabsMobile/
├── src/                    # Mobile app source code
│   ├── components/         # Reusable UI components
│   ├── screens/           # App screens
│   ├── stores/            # State management
│   ├── api/               # API integration
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── core/          # Configuration
│   │   └── services/      # Business logic
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Backend container
├── docker-compose.yml      # Service orchestration
├── data/                   # Database volumes
└── uploads/                # Document storage
```


## API Integration

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Chat Endpoints**
- `POST /api/chat/` - Create new chat
- `POST /api/chat/{chat_id}/messages` - Send message
- `GET /api/chat/{chat_id}/messages` - Get chat history
- `GET /api/chat/` - Get user chats

### **Document Endpoints**
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/` - Get user documents
- `GET /api/documents/{document_id}` - Get specific document

## Voice Features

- **Recording**: High-quality audio recording
- **Permissions**: Automatic microphone permission handling
- **Processing**: Voice-to-text conversion (TODO: implement use wisper)
- **Playback**: Text-to-speech for AI responses

### **Mobile App Deployment**
**Expo Application Services (EAS)**:
   ```bash
   npm install -g @expo/eas-cli
   eas build --platform all
   eas submit --platform all
   ```

