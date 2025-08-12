import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { ChatMessage as ChatMessageType } from '../types';
import { voiceUtils } from '../utils/voiceUtils';

interface ChatMessageProps {
  message: ChatMessageType;
  onSpeak?: () => void;
}

const formatTime = (ts: unknown) => {
  if (!ts) return '';
  const d =
    ts instanceof Date
      ? ts
      : typeof ts === 'number'
      ? new Date(ts < 2000000000 ? ts * 1000 : ts)
      : new Date(ts as string);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ 
  message, 
  onSpeak 
}) => {
  const isUser = message.role === 'user';
  const isVoice = message.isVoice;

  const handleSpeak = async () => {
    if (onSpeak) {
      onSpeak();
    } else {
      try {
        await voiceUtils.speakText(message.content);
      } catch (error) {
        console.error('Error speaking message:', error);
      }
    }
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <Card style={[
        styles.messageCard,
        isUser ? styles.userCard : styles.assistantCard
      ]}>
        <Card.Content>
          <View style={styles.messageHeader}>
            <Text style={[
              styles.roleText,
              isUser ? styles.userRoleText : styles.assistantRoleText
            ]}>
              {isUser ? 'You' : 'Alphi'}
            </Text>
            {isVoice && (
              <IconButton
                icon="microphone"
                size={16}
                iconColor="#F16736"
                style={styles.voiceIcon}
              />
            )}
          </View>
          
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {message.content}
          </Text>
          
          {formatTime(message.timestamp) ? (
            <Text style={styles.timestamp}>
              {formatTime(message.timestamp)}
            </Text>
          ) : null}
        </Card.Content>
        
        {!isUser && (
          <Card.Actions style={styles.actions}>
            <IconButton
              icon="volume-high"
              size={20}
              iconColor="#0D2D3E"
              onPress={handleSpeak}
              style={styles.speakButton}
            />
          </Card.Actions>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '85%',
    elevation: 2,
  },
  userCard: {
    backgroundColor: '#0D2D3E',
  },
  assistantCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userRoleText: {
    color: '#FFFFFF',
  },
  assistantRoleText: {
    color: '#0D2D3E',
  },
  voiceIcon: {
    margin: 0,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#333333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
    textAlign: 'right',
  },
  actions: {
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
  speakButton: {
    margin: 0,
  },
});
