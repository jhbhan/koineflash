import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Flashcard } from '../types';
import { Colors } from '../constants/colors';
import { Button } from './Button';

interface ResultsSummaryProps {
  score: number;
  total: number;
  missedCards: Flashcard[];
  onRetryMissed: () => void;
  onBackToMenu: () => void;
  mode: 'flashcard' | 'quiz';
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  score,
  total,
  missedCards,
  onRetryMissed,
  onBackToMenu,
  mode,
}) => {
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage < 60) return "Keep practicing! Every master was once a beginner. 💪";
    if (percentage < 85) return "Good work! You're building solid foundations. 📖";
    return "Excellent! Ὁ λόγος σου ἰσχυρός ἐστιν! 🏆";
  };

  const getIcon = () => {
    if (percentage < 60) return "school-outline";
    if (percentage < 85) return "book-outline";
    return "trophy-outline";
  };

  const getColor = () => {
    if (percentage < 60) return Colors.errorRed;
    if (percentage < 85) return Colors.gold;
    return Colors.successGreen;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { borderColor: getColor() }]}>
          <Ionicons name={getIcon()} size={48} color={getColor()} />
        </View>
        <Text style={styles.scoreText}>{score} / {total}</Text>
        <Text style={[styles.percentageText, { color: getColor() }]}>{percentage}%</Text>
        <Text style={styles.messageText}>{getMessage()}</Text>
      </View>

      <View style={styles.content}>
        {missedCards.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Cards to Review ({missedCards.length})</Text>
            <FlatList
              data={missedCards}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.missedCard}>
                  <Text style={styles.missedPrompt}>{item.prompt}</Text>
                  <Text style={styles.missedAnswer}>{item.answer}</Text>
                </View>
              )}
              style={styles.list}
              scrollEnabled={false}
            />
          </>
        ) : (
          <View style={styles.perfectScore}>
            <Ionicons name="sparkles" size={32} color={Colors.gold} />
            <Text style={styles.perfectScoreText}>Perfect Score!</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {missedCards.length > 0 && (
          <Button
            label="Retry Missed Cards"
            onPress={onRetryMissed}
            variant="primary"
            icon="refresh"
            fullWidth
            style={styles.button}
          />
        )}
        <Button
          label="Back to Menu"
          onPress={onBackToMenu}
          variant="secondary"
          icon="home-outline"
          fullWidth
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: Colors.cardBg,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.ink,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: '800',
    marginVertical: 5,
  },
  messageText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    lineHeight: 22,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    width: '100%',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 12,
  },
  list: {
    width: '100%',
  },
  missedCard: {
    backgroundColor: Colors.cardBg,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  missedPrompt: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  missedAnswer: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.terracotta,
  },
  perfectScore: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  perfectScoreText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gold,
    marginTop: 10,
  },
  footer: {
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    marginBottom: 12,
  },
});
