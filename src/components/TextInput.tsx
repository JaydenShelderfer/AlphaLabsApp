import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';

interface TextInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim() || isLoading || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
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
        disabled={disabled}
        right={
          <PaperTextInput.Icon
            icon="send"
            onPress={sendMessage}
            disabled={!message.trim() || isLoading || disabled}
            color={message.trim() && !isLoading && !disabled ? "#F16736" : "#C0C0C0"}
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