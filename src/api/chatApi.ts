import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '../types';

// AlphaLabs Mobile Backend API
const API_BASE_URL = 'http://10.0.2.2:8000';

class ChatApi {
  private activeChatId: number | null = null;

  public resetActiveChat() {
    this.activeChatId = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    // Attach JWT if available
    let authHeaders: Record<string, string> = {};
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        authHeaders['Authorization'] = `Bearer ${token}`;
      }
    } catch {}

    // Build headers; avoid forcing JSON for multipart/form-data bodies
    const mergedHeaders: Record<string, any> = {
      ...authHeaders,
      ...(options.headers as Record<string, any>),
    };
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isFormData && !('Content-Type' in mergedHeaders)) {
      mergedHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      headers: mergedHeaders,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          message = errorData?.message || errorData?.detail || message;
        } catch {}
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    const payload = {
      email,
      password,
    };

    return this.request<any>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  private async ensureChat(): Promise<number> {
    if (this.activeChatId) {
      return this.activeChatId;
    }
    const chat = await this.request<{ id: number; title: string; user_id: number; client_id: number; created_on: string }>(
      '/api/chat/',
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
    this.activeChatId = chat.id;
    return chat.id;
  }

  async sendMessage(message: string): Promise<{ id: number; content: string; response: string; is_voice: boolean; created_on: string }> {
    const chatId = await this.ensureChat();
    const payload = { content: message, is_voice: false };
    return this.request<{ id: number; content: string; response: string; is_voice: boolean; created_on: string }>(
      `/api/chat/${chatId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  async getChatHistory(chatId: number): Promise<Array<{ id: number; content: string; response: string; is_voice: boolean; created_on: string }>> {
    return this.request<Array<{ id: number; content: string; response: string; is_voice: boolean; created_on: string }>>(
      `/api/chat/${chatId}/messages`
    );
  }

  async uploadDocument(file: File): Promise<{ id: string; name: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<{ id: string; name: string }>('/api/documents/upload', {
      method: 'POST',
      // Don't set Content-Type; fetch will set the correct multipart boundary
      body: formData,
    });
  }
}

export const chatApi = new ChatApi(); 