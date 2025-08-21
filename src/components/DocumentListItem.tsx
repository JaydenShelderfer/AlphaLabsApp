import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

interface DocumentListItemProps {
  id: string;
  title: string;
  isSelected: boolean;
  isReady: boolean;
  onClick: () => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  id,
  title,
  isSelected,
  isReady,
  onClick,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        !isReady && styles.disabledContainer,
      ]}
      onPress={onClick}
      disabled={!isReady}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isSelected && styles.selectedTitle,
            !isReady && styles.disabledTitle,
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {!isReady && (
          <Text style={styles.statusText}>Processing...</Text>
        )}
      </View>
      {isSelected && (
        <IconButton
          icon="check-circle"
          size={20}
          iconColor="#10B981"
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  selectedContainer: {
    backgroundColor: '#F0F9FF',
    borderColor: '#3B82F6',
  },
  disabledContainer: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 20,
  },
  selectedTitle: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  disabledTitle: {
    color: '#9CA3AF',
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checkIcon: {
    margin: 0,
  },
});
