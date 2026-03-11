import React, { useReducer, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { flashcards } from '../src/data/flashcards';
import { FlashCard } from '../src/components/FlashCard';
import { ProgressBar } from '../src/components/ProgressBar';
import { ScoreDisplay } from '../src/components/ScoreDisplay';
import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { useProgress } from '../src/hooks/useProgress';
import { shuffle } from '../src/utils/shuffle';
import { CategoryId, Flashcard } from '../src/types';

type FlashcardAction =
  | { type: 'MARK_CORRECT' }
  | { type: 'MARK_INCORRECT' }
  | { type: 'NEXT' }
  | { type: 'START_RETRY'; missedCards: Flashcard[] };

interface FlashcardState {
  cards: Flashcard[];
  currentIndex: number;
  correctIds: string[];
  incorrectIds: string[];
  isComplete: boolean;
}

function flashcardReducer(state: FlashcardState, action: FlashcardAction): FlashcardState {
  switch (action.type) {
    case 'MARK_CORRECT': {
      const card = state.cards[state.currentIndex];
      return {
        ...state,
        correctIds: [...state.correctIds, card.id],
      };
    }
    case 'MARK_INCORRECT': {
      const card = state.cards[state.currentIndex];
      return {
        ...state,
        incorrectIds: [...state.incorrectIds, card.id],
      };
    }
    case 'NEXT': {
      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.cards.length;
      return {
        ...state,
        currentIndex: isComplete ? state.currentIndex : nextIndex,
        isComplete,
      };
    }
    case 'START_RETRY': {
      return {
        cards: action.missedCards,
        currentIndex: 0,
        correctIds: [],
        incorrectIds: [],
        isComplete: false,
      };
    }
    default:
      return state;
  }
}

export default function FlashcardScreen() {
  const { categoryId, missedIds, customItems } = useLocalSearchParams<{ 
    categoryId: CategoryId; 
    missedIds?: string;
    customItems?: string;
  }>();
  const router = useRouter();
  const { updateCardProgress, saveSessionResult } = useProgress();

  const initialCards = useMemo(() => {
    let filtered = flashcards;

    if (missedIds) {
      filtered = flashcards.filter(c => missedIds.split(',').includes(c.id));
    } else if (categoryId === 'custom' && customItems) {
      const selectedItems = customItems.split(',');
      filtered = flashcards.filter(c => selectedItems.includes(c.answer));
    } else if (categoryId !== 'all') {
      filtered = flashcards.filter(c => c.category === categoryId);
    }
    
    return shuffle(filtered);
  }, [categoryId, missedIds, customItems]);

  const [state, dispatch] = useReducer(flashcardReducer, {
    cards: initialCards,
    currentIndex: 0,
    correctIds: [],
    incorrectIds: [],
    isComplete: false,
  });

  useEffect(() => {
    if (state.isComplete) {
      const result = {
        categoryId: (categoryId as CategoryId) || 'all',
        mode: 'flashcard' as const,
        score: state.correctIds.length,
        total: state.cards.length,
        missedCardIds: state.incorrectIds,
        completedAt: Date.now(),
      };
      
      saveSessionResult(result);
      
      router.replace({
        pathname: '/results',
        params: {
          score: result.score,
          total: result.total,
          missedIds: result.missedCardIds.join(','),
          mode: 'flashcard',
          categoryId: result.categoryId,
          customItems,
        },
      });
    }
  }, [state.isComplete]);

  const handleCorrect = async () => {
    const card = state.cards[state.currentIndex];
    dispatch({ type: 'MARK_CORRECT' });
    await updateCardProgress(card.id, true);
    setTimeout(() => dispatch({ type: 'NEXT' }), 300);
  };

  const handleIncorrect = async () => {
    const card = state.cards[state.currentIndex];
    dispatch({ type: 'MARK_INCORRECT' });
    await updateCardProgress(card.id, false);
    setTimeout(() => dispatch({ type: 'NEXT' }), 300);
  };

  if (state.cards.length === 0) {
    return (
      <ScreenWrapper edges={['left', 'right', 'bottom']}>
        <Text>No cards found for this category.</Text>
      </ScreenWrapper>
    );
  }

  const currentCard = state.cards[state.currentIndex];

  return (
    <ScreenWrapper edges={['left', 'right', 'bottom']}>
      <ProgressBar current={state.currentIndex} total={state.cards.length} />
      <ScoreDisplay 
        correct={state.correctIds.length} 
        total={state.correctIds.length + state.incorrectIds.length} 
      />
      
      <View style={styles.cardContainer}>
        <FlashCard
          key={currentCard.id}
          card={currentCard}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
});
