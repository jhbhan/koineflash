import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { flashcards } from '../src/data/flashcards';
import { QuizOption } from '../src/components/QuizOption';
import { ProgressBar } from '../src/components/ProgressBar';
import { ScoreDisplay } from '../src/components/ScoreDisplay';
import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { Button } from '../src/components/Button';
import { useProgress } from '../src/hooks/useProgress';
import { useSettings } from '../src/hooks/useSettings';
import { shuffle } from '../src/utils/shuffle';
import { generateQuizOptions } from '../src/utils/quizHelpers';
import { CategoryId, Flashcard } from '../src/types';
import { Colors } from '../src/constants/colors';
import { playCorrectSound, playIncorrectSound, unloadSounds } from '../src/utils/sounds';

export default function QuizScreen() {
  const { categoryId, customItems } = useLocalSearchParams<{ 
    categoryId: CategoryId;
    customItems?: string;
  }>();
  const router = useRouter();
  const { updateCardProgress, saveSessionResult } = useProgress();
  const { settings } = useSettings();

  const [cards] = useState(() => {
    let filtered = flashcards;
    
    if (categoryId === 'custom' && customItems) {
      const selectedItems = customItems.split(',');
      filtered = flashcards.filter(c => selectedItems.includes(c.answer));
    } else if (categoryId !== 'all') {
      filtered = flashcards.filter(c => c.category === categoryId);
    }

    return shuffle(filtered);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHintOverride, setShowHintOverride] = useState(false);

  useEffect(() => {
    return () => unloadSounds();
  }, []);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    setShowHintOverride(false);
  }, [currentIndex]);

  const options = useMemo(() => {
    if (!currentCard) return [];
    return generateQuizOptions(currentCard, flashcards);
  }, [currentCard]);

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < cards.length) {
      setCurrentIndex(nextIndex);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      // Session complete logic is handled in handleSelectOption for auto-advance
      // But if manual advance is on, we might need it here too.
      completeSession();
    }
  }, [currentIndex, cards.length]);

  const completeSession = useCallback(() => {
    const result = {
      categoryId: (categoryId as CategoryId) || 'all',
      mode: 'quiz' as const,
      score: correctIds.length,
      total: cards.length,
      missedCardIds: incorrectIds,
      completedAt: Date.now(),
    };

    saveSessionResult(result);
    router.replace({
      pathname: '/results',
      params: {
        score: result.score,
        total: result.total,
        missedIds: result.missedCardIds.join(','),
        mode: 'quiz',
        categoryId: result.categoryId,
        customItems,
      },
    });
  }, [correctIds, incorrectIds, cards.length, categoryId, customItems]);

  const handleSelectOption = useCallback(async (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentCard.answer;
    
    // Effects
    if (settings.hapticFeedback) {
      Haptics.notificationAsync(
        isCorrect ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      );
    }
    if (settings.soundEnabled) {
      if (isCorrect) playCorrectSound();
      else playIncorrectSound();
    }

    if (isCorrect) {
      setCorrectIds(prev => [...prev, currentCard.id]);
    } else {
      setIncorrectIds(prev => [...prev, currentCard.id]);
    }

    await updateCardProgress(currentCard.id, isCorrect);

    if (settings.quizAutoAdvance) {
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < cards.length) {
          setCurrentIndex(nextIndex);
          setIsAnswered(false);
          setSelectedAnswer(null);
        } else {
          // Complete session with final updated counts
          const finalCorrect = isCorrect ? [...correctIds, currentCard.id] : correctIds;
          const finalIncorrect = !isCorrect ? [...incorrectIds, currentCard.id] : incorrectIds;
          
          const result = {
            categoryId: (categoryId as CategoryId) || 'all',
            mode: 'quiz' as const,
            score: finalCorrect.length,
            total: cards.length,
            missedCardIds: finalIncorrect,
            completedAt: Date.now(),
          };

          saveSessionResult(result);
          router.replace({
            pathname: '/results',
            params: {
              score: result.score,
              total: result.total,
              missedIds: result.missedCardIds.join(','),
              mode: 'quiz',
              categoryId: result.categoryId,
              customItems,
            },
          });
        }
      }, 1200);
    }
  }, [currentIndex, isAnswered, currentCard, cards.length, correctIds, incorrectIds, categoryId, customItems, settings]);

  if (cards.length === 0) {
    return (
      <ScreenWrapper edges={['left', 'right', 'bottom']}>
        <Text>No cards found for this category.</Text>
      </ScreenWrapper>
    );
  }

  const getOptionState = useCallback((answer: string) => {
    if (!isAnswered) return 'default';
    if (answer === currentCard.answer) return 'correct';
    if (answer === selectedAnswer) return 'incorrect';
    return 'disabled';
  }, [isAnswered, currentCard, selectedAnswer]);

  return (
    <ScreenWrapper edges={['left', 'right', 'bottom']}>
      <ProgressBar current={currentIndex} total={cards.length} />
      <ScoreDisplay correct={correctIds.length} total={correctIds.length + incorrectIds.length} />

      <View style={styles.quizContent}>
        <View style={styles.promptCard}>
          <Text style={styles.promptText}>{currentCard.prompt}</Text>
          
          {isAnswered ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.exampleWord}>{currentCard.exampleWord}</Text>
              <Text style={styles.translation}>"{currentCard.translation}"</Text>
            </>
          ) : (
            (settings.showHints || showHintOverride) && (
              <View style={styles.hintContainer}>
                {showHintOverride ? (
                  <Text style={styles.hintText}>{currentCard.hint}</Text>
                ) : (
                  <TouchableOpacity onPress={() => setShowHintOverride(true)}>
                    <Text style={styles.showHintButton}>Show Hint</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          )}
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <QuizOption
              key={`${currentCard.id}-${option}`}
              label={option}
              onPress={() => handleSelectOption(option)}
              state={getOptionState(option)}
            />
          ))}
        </View>

        {isAnswered && !settings.quizAutoAdvance && (
          <View style={styles.nextButtonContainer}>
            <Button 
              label={currentIndex === cards.length - 1 ? "Finish" : "Next Question"} 
              onPress={currentIndex === cards.length - 1 ? completeSession : goToNext}
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  quizContent: {
    flex: 1,
    marginTop: 10,
  },
  promptCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 180,
    justifyContent: 'center',
    // Subtle shadow
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.ink,
    marginBottom: 15,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.parchmentDark,
    marginBottom: 15,
  },
  exampleWord: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.terracotta,
  },
  translation: {
    fontSize: 16,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  hintContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  showHintButton: {
    fontSize: 14,
    color: Colors.terracotta,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  optionsContainer: {
    width: '100%',
  },
  nextButtonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  }
});
