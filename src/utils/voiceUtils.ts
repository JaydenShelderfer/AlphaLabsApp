import * as Speech from 'expo-speech';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

export class VoiceUtils {
  private recording: Audio.Recording | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    try {
      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      this.recording = recording;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string> {
    if (!this.recording) {
      throw new Error('No recording in progress');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      
      if (!uri) {
        throw new Error('Recording URI is null');
      }

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  async speakText(text: string): Promise<void> {
    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        volume: 1.0,
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }

  async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    try {
      return await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
    } catch (error) {
      console.error('Error picking document:', error);
      throw error;
    }
  }

  // Convert audio file to base64 for API transmission
  async audioToBase64(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting audio to base64:', error);
      throw error;
    }
  }
}

export const voiceUtils = new VoiceUtils(); 