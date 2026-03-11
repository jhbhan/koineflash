import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { flashcards } from '../src/data/flashcards';
import { categories } from '../src/data/categories';
import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { ModeSelectionModal } from '../src/components/ModeSelectionModal';
import { Button } from '../src/components/Button';
import { Colors } from '../src/constants/colors';
import { saveCustomSet, loadCustomSets, deleteCustomSet } from '../src/utils/storage';
import { CustomSet } from '../src/types';

export default function CustomSetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [savedSets, setSavedSets] = useState<CustomSet[]>([]);
  const [setName, setSetName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal state
  const [isModeModalVisible, setIsModeModalVisible] = useState(false);
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [activeSetName, setActiveSetName] = useState('');

  // Load saved sets on mount
  useEffect(() => {
    (async () => {
      const sets = await loadCustomSets();
      setSavedSets(sets);
    })();
  }, []);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, { label: string, items: string[] }> = {};
    
    flashcards.forEach(card => {
      const cat = categories.find(c => c.id === card.category);
      const catLabel = cat?.label || 'Other';
      
      if (!groups[card.category]) {
        groups[card.category] = { label: catLabel, items: [] };
      }
      
      if (!groups[card.category].items.includes(card.answer)) {
        groups[card.category].items.push(card.answer);
      }
    });

    return Object.entries(groups).map(([id, group]) => ({
      id,
      label: group.label,
      items: group.items.sort()
    }));
  }, []);

  const toggleItem = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(e => e !== item) 
        : [...prev, item]
    );
  };

  const toggleCategory = (items: string[]) => {
    const allSelected = items.every(e => selectedItems.includes(e));
    if (allSelected) {
      setSelectedItems(prev => prev.filter(e => !items.includes(e)));
    } else {
      setSelectedItems(prev => Array.from(new Set([...prev, ...items])));
    }
  };

  const handleSaveSet = async () => {
    if (!setName.trim()) {
      Alert.alert('Error', 'Please enter a name for your set.');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one pattern.');
      return;
    }

    const newSet: CustomSet = {
      id: Date.now().toString(),
      name: setName.trim(),
      items: selectedItems,
      createdAt: Date.now(),
    };

    await saveCustomSet(newSet);
    const updatedSets = await loadCustomSets();
    setSavedSets(updatedSets);
    setSetName('');
    setIsSaving(false);
    Alert.alert('Success', 'Custom set saved!');
  };

  const openModeModal = (items: string[], name: string = 'Custom Set') => {
    setActiveItems(items);
    setActiveSetName(name);
    setIsModeModalVisible(true);
  };

  const handleDeleteSet = async (id: string) => {
    Alert.alert(
      'Delete Set',
      'Are you sure you want to delete this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteCustomSet(id);
            setSavedSets(prev => prev.filter(s => s.id !== id));
          }
        }
      ]
    );
  };

  const startSession = (mode: 'flashcard' | 'quiz') => {
    if (activeItems.length === 0) return;
    setIsModeModalVisible(false);
    router.push({
      pathname: `/${mode}`,
      params: { 
        categoryId: 'custom',
        customItems: activeItems.join(',') 
      },
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenWrapper scrollable={false} padded={false} edges={['left', 'right']}>
        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* Saved Sets Section */}
          {savedSets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Saved Sets</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.savedSetsScroll}>
                {savedSets.map((set) => (
                  <TouchableOpacity 
                    key={set.id} 
                    style={styles.savedSetCard}
                    onPress={() => openModeModal(set.items, set.name)}
                  >
                    <View style={styles.savedSetHeader}>
                      <Text style={styles.savedSetName} numberOfLines={1}>{set.name}</Text>
                      <TouchableOpacity onPress={() => handleDeleteSet(set.id)}>
                        <Ionicons name="trash-outline" size={16} color={Colors.errorRed} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.savedSetCount}>{set.items.length} patterns</Text>
                    <View style={styles.tapToStart}>
                      <Text style={styles.tapToStartText}>Tap to Start</Text>
                      <Ionicons name="play-circle-outline" size={14} color={Colors.terracotta} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Create New Set</Text>
              <TouchableOpacity onPress={() => setSelectedItems([])}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {groupedItems.map((group) => {
              const isCatSelected = group.items.every(e => selectedItems.includes(e));
              return (
                <View key={group.id} style={styles.categoryGroup}>
                  <TouchableOpacity 
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(group.items)}
                  >
                    <Text style={styles.categoryLabel}>{group.label}</Text>
                    <Ionicons 
                      name={isCatSelected ? "checkbox" : "square-outline"} 
                      size={20} 
                      color={isCatSelected ? Colors.terracotta : Colors.textMuted} 
                    />
                  </TouchableOpacity>
                  <View style={styles.grid}>
                    {group.items.map((item) => {
                      const isSelected = selectedItems.includes(item);
                      return (
                        <TouchableOpacity
                          key={item}
                          style={[
                            styles.itemChip,
                            isSelected && styles.itemChipSelected
                          ]}
                          onPress={() => toggleItem(item)}
                        >
                          <Text style={[
                            styles.itemText,
                            isSelected && styles.itemTextSelected
                          ]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Sticky Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {isSaving ? (
            <View style={styles.saveContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter set name (e.g. 'Review Set')"
                value={setName}
                onChangeText={setSetName}
                autoFocus
              />
              <View style={styles.saveButtons}>
                <Button label="Cancel" variant="ghost" onPress={() => setIsSaving(false)} style={{ flex: 1 }} />
                <Button label="Save Set" variant="primary" onPress={handleSaveSet} style={{ flex: 1 }} />
              </View>
            </View>
          ) : (
            <View style={styles.footerActions}>
              <View style={styles.selectionInfo}>
                <Text style={styles.countText}>{selectedItems.length} patterns selected</Text>
                <TouchableOpacity 
                  onPress={() => setIsSaving(true)} 
                  disabled={selectedItems.length === 0}
                  style={styles.saveIconBtn}
                >
                  <Ionicons name="save-outline" size={20} color={selectedItems.length === 0 ? Colors.border : Colors.terracotta} />
                  <Text style={[styles.saveIconText, selectedItems.length === 0 && { color: Colors.border }]}>Save</Text>
                </TouchableOpacity>
              </View>
              
              <Button
                label="Practice Current Selection"
                onPress={() => openModeModal(selectedItems, setName || 'Current Selection')}
                variant="primary"
                fullWidth
                disabled={selectedItems.length === 0}
                icon="play-outline"
              />
            </View>
          )}
        </View>

        <ModeSelectionModal
          isVisible={isModeModalVisible}
          onClose={() => setIsModeModalVisible(false)}
          onSelectMode={startSession}
          category={{
            id: 'custom',
            label: activeSetName,
            description: `${activeItems.length} selected patterns`,
            icon: 'color-filter-outline',
            color: Colors.terracotta
          }}
        />
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearAllText: {
    color: Colors.terracotta,
    fontSize: 13,
    fontWeight: '600',
  },
  savedSetsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  savedSetCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 150,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  savedSetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  savedSetName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
    flex: 1,
    marginRight: 4,
  },
  savedSetCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tapToStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 8,
  },
  tapToStartText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.terracotta,
    marginRight: 4,
  },
  categoryGroup: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 12,
    borderRadius: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ink,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    minWidth: '22%',
    alignItems: 'center',
  },
  itemChipSelected: {
    backgroundColor: Colors.terracotta,
    borderColor: Colors.terracotta,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
  },
  itemTextSelected: {
    color: 'white',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.screenBg,
  },
  footerActions: {
    width: '100%',
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  saveIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  saveIconText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.terracotta,
    marginLeft: 6,
  },
  saveContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 16,
    borderRadius: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});