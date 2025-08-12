import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, VoiceInputState } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  voiceInput: VoiceInputState;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  setVoiceRecording: (isRecording: boolean) => void;
  setVoiceProcessing: (isProcessing: boolean) => void;
  setVoiceError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      voiceInput: {
        isRecording: false,
        isProcessing: false,
        error: null,
      },

      addMessage: (message: ChatMessage) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      setError: (error: string | null) =>
        set({ error }),

      clearMessages: () =>
        set({ messages: [] }),

      setVoiceRecording: (isRecording: boolean) =>
        set((state) => ({
          voiceInput: { ...state.voiceInput, isRecording },
        })),

      setVoiceProcessing: (isProcessing: boolean) =>
        set((state) => ({
          voiceInput: { ...state.voiceInput, isProcessing },
        })),

      setVoiceError: (error: string | null) =>
        set((state) => ({
          voiceInput: { ...state.voiceInput, error },
        })),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ messages: state.messages }),
    }
  )
); 