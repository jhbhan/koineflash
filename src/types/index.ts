export type CategoryId =
  | 'noun-1st-decl'
  | 'noun-2nd-decl'
  | 'noun-3rd-decl'
  | 'verb-present-active'
  | 'verb-mid-pass'
  | 'verb-imperfect'
  | 'verb-aorist'
  | 'verb-future'
  | 'preposition'
  | 'all'
  | 'custom';

export interface Flashcard {
  id: string;
  category: CategoryId;
  prompt: string;       // e.g. "1st Decl. η-stem — Genitive Singular"
  answer: string;       // e.g. "-ης"
  hint: string;         // shown before reveal
  exampleWord: string;  // e.g. "ἀρχῆς"
  translation: string;  // e.g. "of a beginning"
}

export interface Category {
  id: CategoryId;
  label: string;        // e.g. "1st Declension"
  description: string;  // e.g. "η and α stem nouns"
  meaning?: string;     // e.g. "I am loosing" (English equivalent)
  icon: string;         // Ionicons name
  color: string;        // accent color for this category
}

export interface CardProgress {
  cardId: string;
  correct: number;      // lifetime correct count
  incorrect: number;    // lifetime incorrect count
  lastSeen: number;     // timestamp
}

export interface SessionResult {
  categoryId: CategoryId | 'custom';
  mode: 'flashcard' | 'quiz';
  score: number;
  total: number;
  missedCardIds: string[];
  completedAt: number;
}

export interface CustomSet {
  id: string;
  name: string;
  items: string[];
  createdAt: number;
}

export interface AppSettings {
  hapticFeedback: boolean;
  soundEnabled: boolean;
  showHints: boolean;
  quizAutoAdvance: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:mm
}
