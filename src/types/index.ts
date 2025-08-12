export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isVoice?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  timestamp: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploaded_at: Date;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface VoiceInputState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
} 