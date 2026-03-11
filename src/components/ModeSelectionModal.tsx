import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Category } from '../types';
import { Button } from './Button';

interface ModeSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'flashcard' | 'quiz') => void;
  category: Category | null;
}

export const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelectMode,
  category,
}) => {
  if (!category) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{category.label}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              {category.meaning && (
                <View style={styles.meaningBadge}>
                  <Text style={styles.meaningText}>{category.meaning}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.ink} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>Select Practice Mode</Text>
          
          <TouchableOpacity
            style={[styles.modeButton, { borderColor: Colors.terracotta }]}
            onPress={() => onSelectMode('flashcard')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(192, 98, 42, 0.1)' }]}>
              <Ionicons name="card-outline" size={32} color={Colors.terracotta} />
            </View>
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>Flashcards</Text>
              <Text style={styles.modeDescription}>Drill endings with active recall and self-correction.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, { borderColor: Colors.gold }]}
            onPress={() => onSelectMode('quiz')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(184, 146, 42, 0.1)' }]}>
              <Ionicons name="list-outline" size={32} color={Colors.gold} />
            </View>
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>Multiple Choice Quiz</Text>
              <Text style={styles.modeDescription}>Test your knowledge with 4 possible answers.</Text>
            </View>
          </TouchableOpacity>

          <Button
            label="Cancel"
            onPress={onClose}
            variant="ghost"
            fullWidth
            style={styles.cancelBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.screenBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.ink,
    fontFamily: 'CrimsonPro_700Bold',
  },
  categoryDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  meaningBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  meaningText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.terracotta,
    fontFamily: 'CrimsonPro_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.inkLight,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    // Subtle shadow
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  cancelBtn: {
    marginTop: 8,
  },
});
