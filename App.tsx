import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatScreen } from './src/screens/ChatScreen';

// Custom theme for AlphaLabs branding
const theme = {
  colors: {
    primary: '#0D2D3E',
    accent: '#F16736',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    placeholder: '#888888',
    error: '#FF4444',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ChatScreen />
        <StatusBar style="light" backgroundColor="#0D2D3E" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
