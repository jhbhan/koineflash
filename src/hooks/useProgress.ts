import { useState, useEffect, useCallback } from 'react';
import { CardProgress, SessionResult } from '../types';
import * as storage from '../utils/storage';

export function useProgress() {
  const [cardProgress, setCardProgress] = useState<Record<string, CardProgress>>({});
  const [sessionHistory, setSessionHistory] = useState<SessionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [progress, history] = await Promise.all([
        storage.loadCardProgress(),
        storage.loadSessionHistory(),
      ]);
      setCardProgress(progress);
      setSessionHistory(history);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const saveSessionResult = useCallback(async (result: SessionResult) => {
    await storage.saveSessionResult(result);
    setSessionHistory((prev) => [result, ...prev].slice(0, 50));
  }, []);

  const updateCardProgress = useCallback(async (cardId: string, wasCorrect: boolean) => {
    const existing = cardProgress[cardId] || {
      cardId,
      correct: 0,
      incorrect: 0,
      lastSeen: 0,
    };

    const updated: CardProgress = {
      ...existing,
      correct: wasCorrect ? existing.correct + 1 : existing.correct,
      incorrect: wasCorrect ? existing.incorrect : existing.incorrect + 1,
      lastSeen: Date.now(),
    };

    const newProgress = { ...cardProgress, [cardId]: updated };
    setCardProgress(newProgress);
    await storage.saveCardProgress({ [cardId]: updated });
  }, [cardProgress]);

  const resetProgress = useCallback(async () => {
    await storage.clearAllProgress();
    setCardProgress({});
    setSessionHistory([]);
  }, []);

  return {
    cardProgress,
    sessionHistory,
    isLoading,
    saveSessionResult,
    updateCardProgress,
    resetProgress,
    refresh: loadAll,
  };
}
