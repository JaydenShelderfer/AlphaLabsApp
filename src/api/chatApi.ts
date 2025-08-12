import { ChatMessage, ChatResponse, ApiError } from '../types';

// AlphaLabs Mobile Backend API
const API_BASE_URL = 'http://localhost:8000';

class ChatApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    const payload = {
      message,
      conversation_id: conversationId || null,
    };

    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getChatHistory(conversationId: string): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/api/chat/history/${conversationId}`);
  }

  async uploadDocument(file: File): Promise<{ id: string; name: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<{ id: string; name: string }>('/api/documents/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }
}

export const chatApi = new ChatApi(); 