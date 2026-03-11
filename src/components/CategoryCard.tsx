import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors } from '../constants/colors';

interface CategoryCardProps {
  category: Category;
  cardCount: number;
  bestScore?: number; // percentage
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(({
  category,
  cardCount,
  bestScore,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: category.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={category.icon as any} size={28} color={category.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{category.label}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {category.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.cardCount}>{cardCount} cards</Text>
          {bestScore !== undefined && (
            <Text style={[styles.bestScore, { color: bestScore >= 90 ? Colors.successGreen : Colors.textMuted }]}>
              Best: {bestScore}%
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 6,
    // iOS shadow
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.ink,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCount: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.inkLight,
    textTransform: 'uppercase',
  },
  bestScore: {
    fontSize: 11,
    fontWeight: '700',
  },
});
