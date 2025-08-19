import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { IconButton, Text, ActivityIndicator } from 'react-native-paper';
import { useChatStore } from '../stores/chatStore';
import { voiceUtils } from '../utils/voiceUtils';
import { chatApi } from '../api/chatApi';

export const VoiceInput: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  
  const { 
    setVoiceRecording, 
    setVoiceProcessing, 
    setVoiceError,
    addMessage,
    setLoading 
  } = useChatStore();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const permission = await voiceUtils.requestPermissions();
    setHasPermission(permission);
  };

  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please grant microphone permission to use voice input.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsRecording(true);
      setVoiceRecording(true);
      await voiceUtils.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      setVoiceError('Failed to start recording');
      setIsRecording(false);
      setVoiceRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setVoiceRecording(false);
      setIsProcessing(true);
      setVoiceProcessing(true);

      const audioUri = await voiceUtils.stopRecording();
      
      // TODO: Implement voice-to-text conversion
      // For now, we'll simulate it with a placeholder
      const transcribedText = "Voice input detected - transcription service needed";
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: transcribedText,
        role: 'user' as const,
        timestamp: new Date(),
        isVoice: true,
      };
      
      addMessage(userMessage);
      
      // Send to API and get response
      setLoading(true);
      try {
        const response = await chatApi.sendMessage(transcribedText);
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: response.response,
          role: 'assistant' as const,
          timestamp: new Date(),
          isVoice: false,
        };
        
        addMessage(assistantMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        setVoiceError('Failed to send message');
      } finally {
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Error stopping recording:', error);
      setVoiceError('Failed to process voice input');
    } finally {
      setIsProcessing(false);
      setVoiceProcessing(false);
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <IconButton
          icon="microphone-off"
          size={32}
          iconColor="#999999"
          disabled
          style={styles.micButton}
        />
        <Text style={styles.permissionText}>Microphone access required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon={isRecording ? "stop" : "microphone"}
        size={32}
        iconColor={isRecording ? "#FF4444" : "#F16736"}
        onPress={handlePress}
        style={[
          styles.micButton,
          isRecording && styles.recordingButton
        ]}
        disabled={isProcessing}
      />
      
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#F16736" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
      
      {isRecording && (
        <Text style={styles.recordingText}>Recording...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  micButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F16736',
    elevation: 4,
  },
  recordingButton: {
    borderColor: '#FF4444',
    backgroundColor: '#FFE6E6',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  processingText: {
    marginLeft: 8,
    color: '#F16736',
    fontSize: 14,
  },
  recordingText: {
    marginTop: 8,
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionText: {
    marginTop: 8,
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
  },
}); 