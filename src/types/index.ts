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

// New document types for selection functionality
export interface DocumentListItem {
  id: string;
  title: string;
  original_filename?: string;
  document_status: string;
  created_on: string;
  updated_on: string;
}

export interface SelectedDocumentPillProps {
  fileName: string;
  onRemove: () => void;
  isDeleted?: boolean;
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