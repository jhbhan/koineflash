import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { flashcards } from '../src/data/flashcards';
import { ResultsSummary } from '../src/components/ResultsSummary';
import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { CategoryId } from '../src/types';

export default function ResultsScreen() {
  const { score, total, missedIds, mode, categoryId, customEndings } = useLocalSearchParams<{
    score: string;
    total: string;
    missedIds: string;
    mode: 'flashcard' | 'quiz';
    categoryId: CategoryId;
    customEndings?: string;
  }>();
  
  const router = useRouter();

  const missedCardsList = useMemo(() => {
    if (!missedIds) return [];
    const ids = missedIds.split(',');
    return flashcards.filter((c) => ids.includes(c.id));
  }, [missedIds]);

  const handleRetryMissed = () => {
    router.replace({
      pathname: mode === 'quiz' ? '/quiz' : '/flashcard',
      params: { 
        categoryId,
        missedIds,
        customEndings,
      },
    });
  };

  const handleBackToMenu = () => {
    router.dismissAll();
    router.replace('/');
  };

  return (
    <ScreenWrapper scrollable edges={['left', 'right', 'bottom']}>
      <ResultsSummary
        score={parseInt(score || '0', 10)}
        total={parseInt(total || '0', 10)}
        missedCards={missedCardsList}
        onRetryMissed={handleRetryMissed}
        onBackToMenu={handleBackToMenu}
        mode={mode || 'flashcard'}
      />
    </ScreenWrapper>
  );
}
