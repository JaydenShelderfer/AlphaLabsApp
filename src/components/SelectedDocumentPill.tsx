import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

interface SelectedDocumentPillProps {
  fileName: string;
  onRemove: () => void;
  isDeleted?: boolean;
}

export const SelectedDocumentPill: React.FC<SelectedDocumentPillProps> = ({
  fileName,
  onRemove,
  isDeleted = false,
}) => {
  if (isDeleted) {
    return (
      <View style={styles.pillContainer}>
        <View style={[styles.pill, styles.deletedPill]}>
          <IconButton
            icon="alert-triangle"
            size={14}
            iconColor="#DC2626"
            style={styles.icon}
          />
          <Text style={[styles.text, styles.deletedText]} numberOfLines={1}>
            Document Deleted
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pillContainer}>
      <View style={styles.pill}>
        <Text style={styles.text} numberOfLines={1}>
          {fileName}
        </Text>
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconButton
            icon="close"
            size={14}
            iconColor="#6B7280"
            style={styles.removeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    margin: 2,
  },
  pill: {
    backgroundColor: '#DBEAFE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 120,
    position: 'relative',
  },
  deletedPill: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: '#FECACA',
    borderBottomColor: '#FECACA',
    borderRightColor: '#FECACA',
  },
  text: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1E40AF',
    flex: 1,
    marginRight: 20,
  },
  deletedText: {
    color: '#DC2626',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  removeIcon: {
    margin: 0,
  },
  icon: {
    margin: 0,
    marginRight: 4,
  },
});
