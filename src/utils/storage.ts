import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardProgress, SessionResult, CustomSet, AppSettings } from '../types';

const KEYS = {
  CARD_PROGRESS: 'card_progress',
  SESSION_HISTORY: 'session_history',
  SETTINGS: 'settings',
  CUSTOM_SETS: 'custom_sets',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  hapticFeedback: true,
  soundEnabled: true,
  showHints: true,
  quizAutoAdvance: true,
  dailyReminder: false,
  reminderTime: '10:00',
};

// Settings
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Save custom sets
export async function saveCustomSet(set: CustomSet): Promise<void> {
  try {
    const existing = await loadCustomSets();
    const updated = [set, ...existing.filter(s => s.id !== set.id)];
    await AsyncStorage.setItem(KEYS.CUSTOM_SETS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving custom set:', error);
  }
}

// Load custom sets
export async function loadCustomSets(): Promise<CustomSet[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.CUSTOM_SETS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading custom sets:', error);
    return [];
  }
}

// Delete custom set
export async function deleteCustomSet(id: string): Promise<void> {
  try {
    const existing = await loadCustomSets();
    const updated = existing.filter(s => s.id !== id);
    await AsyncStorage.setItem(KEYS.CUSTOM_SETS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting custom set:', error);
  }
}

// Save per-card progress (keyed by cardId)
export async function saveCardProgress(progress: Record<string, CardProgress>): Promise<void> {
  try {
    const existing = await loadCardProgress();
    const merged = { ...existing, ...progress };
    await AsyncStorage.setItem(KEYS.CARD_PROGRESS, JSON.stringify(merged));
  } catch (error) {
    console.error('Error saving card progress:', error);
  }
}

// Load per-card progress
export async function loadCardProgress(): Promise<Record<string, CardProgress>> {
  try {
    const data = await AsyncStorage.getItem(KEYS.CARD_PROGRESS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading card progress:', error);
    return {};
  }
}

// Save session result to history
export async function saveSessionResult(result: SessionResult): Promise<void> {
  try {
    const history = await loadSessionHistory();
    const newHistory = [result, ...history].slice(0, 50); // Keep last 50
    await AsyncStorage.setItem(KEYS.SESSION_HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving session result:', error);
  }
}

// Load session history
export async function loadSessionHistory(limit?: number): Promise<SessionResult[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SESSION_HISTORY);
    const history: SessionResult[] = data ? JSON.parse(data) : [];
    return limit ? history.slice(0, limit) : history;
  } catch (error) {
    console.error('Error loading session history:', error);
    return [];
  }
}

// Clear all progress (reset)
export async function clearAllProgress(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEYS.CARD_PROGRESS, KEYS.SESSION_HISTORY, KEYS.SETTINGS]);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
}
