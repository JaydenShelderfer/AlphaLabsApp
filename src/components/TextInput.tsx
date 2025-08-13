import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput, IconButton } from 'react-native-paper';
import { useChatStore } from '../stores/chatStore';
import { chatApi } from '../api/chatApi';

export const TextInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { addMessage, setLoading, setError } = useChatStore();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user' as const,
      timestamp: new Date(),
      isVoice: false,
    };

    addMessage(userMessage);
    setMessage('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(userMessage.content);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant' as const,
        timestamp: new Date(),
        isVoice: false,
      };

      addMessage(assistantMessage);
      setError(null);
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Network request failed') {
        console.error('Network request failed → likely URL/port/connection issue.');
      }
      console.error('Error sending message (full):', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      setError(`Failed to send message: ${error.message || error}`);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    sendMessage();
  };

  return (
    <View style={styles.container}>
      <PaperTextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
        mode="outlined"
        style={styles.textInput}
        outlineColor="#E0E0E0"
        activeOutlineColor="#F16736"
        multiline
        maxLength={1000}
        onSubmitEditing={handleSubmit}
        right={
          <PaperTextInput.Icon
            icon="send"
            onPress={sendMessage}
            disabled={!message.trim()}
            color={message.trim() ? "#F16736" : "#C0C0C0"}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
}); 