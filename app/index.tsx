import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../src/data/categories';
import { flashcards } from '../src/data/flashcards';
import { CategoryCard } from '../src/components/CategoryCard';
import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { ModeSelectionModal } from '../src/components/ModeSelectionModal';
import { Button } from '../src/components/Button';
import { useProgress } from '../src/hooks/useProgress';
import { Colors } from '../src/constants/colors';
import { Category } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { sessionHistory } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModeModalVisible, setIsModeModalVisible] = useState(false);

  // Calculate best scores per category
  const bestScores = useMemo(() => {
    const scores: Record<string, number> = {};
    sessionHistory.forEach((session) => {
      const percentage = Math.round((session.score / session.total) * 100);
      if (!scores[session.categoryId] || percentage > scores[session.categoryId]) {
        scores[session.categoryId] = percentage;
      }
    });
    return scores;
  }, [sessionHistory]);

  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsModeModalVisible(true);
  }, []);

  const startSession = useCallback((mode: 'flashcard' | 'quiz') => {
    if (!selectedCategory) return;
    setIsModeModalVisible(false);
    router.push({
      pathname: `/${mode}`,
      params: { categoryId: selectedCategory.id },
    });
  }, [selectedCategory, router]);

  const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
    <CategoryCard
      category={item}
      cardCount={flashcards.filter((c) => c.category === item.id).length}
      bestScore={bestScores[item.id]}
      onPress={() => handleCategoryPress(item)}
    />
  ), [bestScores, handleCategoryPress]);

  return (
    <ScreenWrapper padded={false} edges={['left', 'right']}>
      <Stack.Screen 
        options={{
          headerRight: () => null,
        }} 
      />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Choose a category to start drilling.</Text>
            
            <Button
              label="Study All Cards"
              onPress={() => handleCategoryPress({ id: 'all', label: 'All Cards', description: 'Everything in one deck', icon: 'apps-outline', color: Colors.ink })}
              variant="primary"
              size="lg"
              icon="infinite-outline"
              fullWidth
              style={styles.studyAllButton}
            />

            <Button
              label="Create Custom Set"
              onPress={() => router.push('/custom-set')}
              variant="secondary"
              size="lg"
              icon="color-filter-outline"
              fullWidth
              style={styles.customSetButton}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Grammar Categories</Text>
            </View>
          </View>
        }
        renderItem={renderCategoryItem}
      />

      <ModeSelectionModal
        isVisible={isModeModalVisible}
        onClose={() => setIsModeModalVisible(false)}
        onSelectMode={startSession}
        category={selectedCategory}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 60, // Increased bottom padding to clear the home indicator
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.ink,
    fontFamily: 'CrimsonPro_700Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'CrimsonPro_400Regular',
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 24,
  },
  studyAllButton: {
    marginBottom: 12,
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  customSetButton: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'CrimsonPro_700Bold',
    color: Colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Modal Styles
});
