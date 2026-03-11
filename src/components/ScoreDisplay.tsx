import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';

interface ScoreDisplayProps {
  correct: number;
  total: number;
  streak?: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  correct,
  total,
  streak,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreItem}>
        <Text style={styles.label}>Correct</Text>
        <Text style={[styles.value, { color: Colors.successGreen }]}>{correct}</Text>
      </View>
      {streak !== undefined && streak > 1 && (
        <View style={styles.scoreItem}>
          <Text style={styles.label}>Streak</Text>
          <Text style={[styles.value, { color: Colors.gold }]}>{streak} 🔥</Text>
        </View>
      )}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>Accuracy</Text>
        <Text style={styles.value}>
          {total > 0 ? Math.round((correct / total) * 100) : 0}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
    marginTop: 0,
    backgroundColor: Colors.cardBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
});
