import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, FAB, Portal, Modal, Text, Button } from 'react-native-paper';
import { useChatStore } from '../stores/chatStore';
import { ChatMessageComponent } from '../components/ChatMessage';
import { VoiceInput } from '../components/VoiceInput';
import { TextInput } from '../components/TextInput';
import { voiceUtils } from '../utils/voiceUtils';

export const ChatScreen: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    clearMessages,
    setError 
  } = useChatStore();
  
  const [showVoiceModal, setShowVoiceModal] = React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => setError(null) }]);
    }
  }, [error]);

  const scrollToBottom = () => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearMessages },
      ]
    );
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await voiceUtils.pickDocument();
      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        // TODO: Implement document upload to backend
        Alert.alert('Document Selected', `Selected: ${file.name}`);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
    setShowDocumentModal(false);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <ChatMessageComponent message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Welcome to AlphaLabs!</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start a conversation with Alphi, your AI assistant. You can type or use voice input.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content 
          title="Alphi" 
          titleStyle={styles.headerTitle}
          subtitle="AlphaLabs AI Assistant"
        />
        <Appbar.Action icon="delete" onPress={handleClearChat} />
      </Appbar.Header>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <VoiceInput />
        <TextInput />
      </View>

      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowDocumentModal(true)}
          color="#FFFFFF"
        />
      </Portal>

      {/* Document Upload Modal */}
      <Modal
        visible={showDocumentModal}
        onDismiss={() => setShowDocumentModal(false)}
        contentContainerStyle={styles.modal}
      >
        <Text style={styles.modalTitle}>Upload Document</Text>
        <Text style={styles.modalSubtitle}>
          Select a document to analyze with Alphi
        </Text>
        <View style={styles.modalButtons}>
          <Button
            mode="outlined"
            onPress={() => setShowDocumentModal(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleDocumentUpload}
            style={styles.modalButton}
            buttonColor="#F16736"
          >
            Select Document
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#0D2D3E',
    elevation: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D2D3E',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#F16736',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D2D3E',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 