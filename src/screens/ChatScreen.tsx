import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { ChatMessage } from '../types';
import { chatApi } from '../api/chatApi';
import { TextInput } from '../components/TextInput';
import { VoiceInput } from '../components/VoiceInput';
import { DocumentSelector } from '../components/DocumentSelector';

interface ChatScreenProps {
  onLogout: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      isVoice: false,
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(content.trim(), selectedDocuments);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date(),
        isVoice: false,
      };

      addMessage(assistantMessage);
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send message. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceMessage = async (transcribedText: string) => {
    if (!transcribedText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: transcribedText.trim(),
      role: 'user',
      timestamp: new Date(),
      isVoice: true,
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(transcribedText.trim(), selectedDocuments);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date(),
        isVoice: false,
      };

      addMessage(assistantMessage);
    } catch (error: any) {
      console.error('Error sending voice message:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send voice message. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentsChange = (documentIds: string[]) => {
    setSelectedDocuments(documentIds);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            setSelectedDocuments([]);
            chatApi.resetActiveChat();
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chat with Alphi</Text>
          <View style={styles.headerButtons}>
            <Button
              mode="outlined"
              onPress={clearChat}
              style={styles.headerButton}
              labelStyle={styles.headerButtonLabel}
            >
              Clear
            </Button>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.headerButton}
              labelStyle={styles.headerButtonLabel}
            >
              Logout
            </Button>
          </View>
        </View>

        {/* Document Selector */}
        <DocumentSelector
          selectedDocuments={selectedDocuments}
          onDocumentsChange={handleDocumentsChange}
        />

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Start a conversation with Alphi by typing a message or using voice input.
              </Text>
              {selectedDocuments.length > 0 && (
                <Text style={styles.selectedDocsText}>
                  {selectedDocuments.length} document(s) selected for context.
                </Text>
              )}
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user' ? styles.userText : styles.assistantText,
                    ]}
                  >
                    {message.content}
                  </Text>
                  <Text style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                  {message.isVoice && (
                    <Text style={styles.voiceIndicator}>🎤 Voice</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={isLoading}
          />
          <VoiceInput
            onVoiceMessage={handleVoiceMessage}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonLabel: {
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  selectedDocsText: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#1E293B',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  voiceIndicator: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 16,
  },
}); 