import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { IconButton, Text, ActivityIndicator } from 'react-native-paper';
import { voiceUtils } from '../utils/voiceUtils';

interface VoiceInputProps {
  onVoiceMessage: (transcribedText: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onVoiceMessage,
  isLoading = false,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const permission = await voiceUtils.requestPermissions();
    setHasPermission(permission);
  };

  const startRecording = async () => {
    if (!hasPermission || isLoading || disabled) {
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please grant microphone permission to use voice input.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    try {
      setIsRecording(true);
      await voiceUtils.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);

      const audioUri = await voiceUtils.stopRecording();
      
      // TODO: Implement voice-to-text conversion
      // For now, we'll simulate it with a placeholder
      const transcribedText = "Voice input detected - transcription service needed";
      
      // Call the callback with the transcribed text
      onVoiceMessage(transcribedText);
      
    } catch (error) {
      console.error('Error stopping recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = isLoading || disabled || isProcessing;

  return (
    <View style={styles.container}>
      {isRecording ? (
        <IconButton
          icon="stop"
          size={32}
          iconColor="#FFFFFF"
          style={[styles.voiceButton, styles.recordingButton]}
          onPress={stopRecording}
          disabled={isDisabled}
        />
      ) : (
        <IconButton
          icon="microphone"
          size={32}
          iconColor={isDisabled ? "#C0C0C0" : "#F16736"}
          style={[styles.voiceButton, isDisabled && styles.disabledButton]}
          onPress={startRecording}
          disabled={isDisabled}
        />
      )}
      
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#F16736" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
      
      {!hasPermission && (
        <Text style={styles.permissionText}>
          Microphone permission required
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  voiceButton: {
    backgroundColor: '#F16736',
    margin: 8,
  },
  recordingButton: {
    backgroundColor: '#DC2626',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
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
  permissionText: {
    color: '#EF4444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
}); 