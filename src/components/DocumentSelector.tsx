import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { chatApi } from '../api/chatApi';
import { DocumentListItem as DocumentListItemType } from '../types';
import { DocumentListItem } from './DocumentListItem';
import { SelectedDocumentPill } from './SelectedDocumentPill';

interface DocumentSelectorProps {
  selectedDocuments: string[];
  onDocumentsChange: (documentIds: string[]) => void;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  selectedDocuments,
  onDocumentsChange,
}) => {
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentListItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDocumentListOpen) {
      fetchDocuments();
    }
  }, [isDocumentListOpen]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedDocuments = await chatApi.fetchDocuments();
      setDocuments(fetchedDocuments);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents');
      Alert.alert('Error', 'Failed to load documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDocument = (docId: string) => {
    // Check if we're removing a document
    if (selectedDocuments.includes(docId)) {
      // Check if the document exists in the documents array
      const docExists = documents.some((doc) => doc.id === docId);

      // Only allow removing documents that exist (not deleted)
      if (docExists) {
        onDocumentsChange(selectedDocuments.filter((id) => id !== docId));
      } else {
        Alert.alert('Error', 'Cannot remove deleted documents from the chat.');
      }
      return;
    }

    // If we're adding a document, it must exist in the documents array
    const doc = documents.find((doc) => doc.id === docId);
    if (doc) {
      onDocumentsChange([...selectedDocuments, docId]);
    } else {
      Alert.alert('Error', 'Document not found in the document store');
    }
  };

  const handleRemoveDocument = (docId: string) => {
    onDocumentsChange(selectedDocuments.filter((id) => id !== docId));
  };

  const readyDocuments = documents.filter((doc) => doc.document_status === 'READY');

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={() => setIsDocumentListOpen(!isDocumentListOpen)}
        style={styles.toggleButton}
        labelStyle={styles.toggleButtonLabel}
      >
        {isDocumentListOpen ? 'Hide Documents' : 'Select Documents'}
      </Button>

      {/* Selected Documents */}
      {selectedDocuments.length > 0 && (
        <View style={styles.selectedDocumentsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedDocumentsScroll}
          >
            {selectedDocuments.map((docId) => {
              const doc = documents.find((d) => d.id === docId);
              // If doc is null/undefined, it means the document has been deleted
              return (
                <SelectedDocumentPill
                  key={docId}
                  fileName={doc?.title || doc?.original_filename || 'Untitled Document'}
                  onRemove={() => handleRemoveDocument(docId)}
                  isDeleted={!doc}
                />
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Document List */}
      {isDocumentListOpen && (
        <View style={styles.documentListContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading documents...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button
                mode="outlined"
                onPress={fetchDocuments}
                style={styles.retryButton}
              >
                Retry
              </Button>
            </View>
          ) : readyDocuments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No documents available</Text>
            </View>
          ) : (
            <ScrollView style={styles.documentList}>
              {readyDocuments.map((doc) => (
                <DocumentListItem
                  key={doc.id}
                  id={doc.id}
                  title={doc.title || doc.original_filename || 'Untitled Document'}
                  isSelected={selectedDocuments.includes(doc.id)}
                  isReady={doc.document_status === 'READY'}
                  onClick={() => handleSelectDocument(doc.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  toggleButtonLabel: {
    fontSize: 12,
  },
  selectedDocumentsContainer: {
    marginBottom: 8,
  },
  selectedDocumentsScroll: {
    paddingHorizontal: 4,
  },
  documentListContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    maxHeight: 200,
  },
  documentList: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 80,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
