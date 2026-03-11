# Task: Build a Koine Greek Grammar Flashcard App

## Overview
Build a **React Native Expo** mobile app for practicing Koine Greek noun declensions and verb conjugations. The app runs on both **iOS and Android**. It helps students drill grammatical endings through flashcards and multiple-choice quizzes, with progress saved locally using AsyncStorage.

---

## Platform & Tech Stack

- **Framework**: React Native with [Expo](https://expo.dev/) (SDK 51+)
- **Navigation**: Expo Router (file-based routing) or React Navigation — your choice
- **Local Storage**: `@react-native-async-storage/async-storage` for persisting progress across sessions. **Do NOT use `localStorage`** — that is web-only and will not work in React Native.
- **Animations**: `react-native-reanimated` for card flip and transition animations
- **Icons**: `@expo/vector-icons` (Ionicons or MaterialCommunityIcons)
- **Fonts**: Load custom fonts via `expo-font` — use a serif/classical feel (e.g. `Crimson Pro` or `IM Fell English` from Google Fonts via expo-google-fonts, or fall back to system serif)
- **Gestures**: `react-native-gesture-handler` (swipe to next card)
- **TypeScript**: Yes — use `.tsx` files throughout
- **Target**: iOS + Android (no web target required, but don't break it)

### Key dependencies
```json
{
  "expo": "~51.0.0",
  "react-native": "0.74.x",
  "@react-native-async-storage/async-storage": "^1.23.1",
  "react-native-reanimated": "~3.10.0",
  "react-native-gesture-handler": "~2.16.0",
  "expo-font": "~12.0.0",
  "expo-linear-gradient": "~13.0.0",
  "@expo/vector-icons": "^14.0.0",
  "expo-router": "~3.5.0",
  "react-native-safe-area-context": "^4.10.1",
  "react-native-screens": "^3.31.1"
}
```

---

## Project Structure

Use a clean, scalable folder structure:

```
/app                        ← Expo Router screens
  _layout.tsx               ← Root layout (navigation shell)
  index.tsx                 ← Home / category select screen
  flashcard.tsx             ← Flashcard drill screen
  quiz.tsx                  ← Quiz (multiple choice) screen
  results.tsx               ← Results summary screen

/src
  /components               ← Reusable UI components
    CategoryCard.tsx
    FlashCard.tsx
    ProgressBar.tsx
    ScoreDisplay.tsx
    QuizOption.tsx
    ResultsSummary.tsx
    Button.tsx              ← General-purpose reusable button
    ScreenWrapper.tsx       ← Safe area + background wrapper

  /data
    flashcards.ts           ← All card data (typed)
    categories.ts           ← Category metadata

  /hooks
    useProgress.ts          ← AsyncStorage read/write for progress
    useFlashcardSession.ts  ← Session state: current index, correct, missed
    useQuizSession.ts       ← Quiz state: options generation, scoring

  /constants
    colors.ts               ← Color palette
    typography.ts           ← Font sizes, weights, families
    layout.ts               ← Spacing, border radius, card dimensions

  /utils
    shuffle.ts              ← Fisher-Yates shuffle
    storage.ts              ← Typed AsyncStorage helpers (get/set/clear)
    quizHelpers.ts          ← Generate wrong answer options

  /types
    index.ts                ← Shared TypeScript types/interfaces
```

---

## TypeScript Types

Define these in `/src/types/index.ts`:

```ts
export type CategoryId =
  | 'noun-1st-decl'
  | 'noun-2nd-decl'
  | 'noun-3rd-decl'
  | 'verb-present-active'
  | 'verb-mid-pass'
  | 'verb-imperfect'
  | 'verb-aorist'
  | 'verb-future'
  | 'all';

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
  categoryId: CategoryId;
  mode: 'flashcard' | 'quiz';
  score: number;
  total: number;
  missedCardIds: string[];
  completedAt: number;
}
```

---

## Local Storage with AsyncStorage

Use `@react-native-async-storage/async-storage` for all persistence.

Create typed helpers in `/src/utils/storage.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CARD_PROGRESS: 'card_progress',
  SESSION_HISTORY: 'session_history',
  SETTINGS: 'settings',
} as const;

// Save per-card progress (keyed by cardId)
export async function saveCardProgress(progress: Record<string, CardProgress>): Promise<void>

// Load per-card progress
export async function loadCardProgress(): Promise<Record<string, CardProgress>>

// Save session result to history
export async function saveSessionResult(result: SessionResult): Promise<void>

// Load last N session results
export async function loadSessionHistory(limit?: number): Promise<SessionResult[]>

// Clear all progress (reset)
export async function clearAllProgress(): Promise<void>
```

- Always wrap AsyncStorage calls in try/catch
- Parse/stringify JSON for objects
- Provide sensible defaults when keys are missing

### What to persist:
- **Per-card progress**: how many times each card was answered correctly/incorrectly (across all sessions)
- **Session history**: last 10 session results
- **Settings**: shuffle preference, last used category

### What NOT to persist:
- In-progress session state (current card index, current session's correct/wrong) — keep this in component state only

---

## Component Architecture & Rendering Guidelines

### Guiding principles
- Each component has a **single responsibility**
- **Reusable components** live in `/src/components` and accept props — they do not read from AsyncStorage directly
- **Screens** in `/app` handle data fetching, session state, and pass data down
- Use `useReducer` for complex session state (flashcard session, quiz session) instead of many scattered `useState` calls
- Use `useMemo` and `useCallback` **only where there is a genuine render cost** — do not wrap every function or value as a habit

### When to use useMemo
- ✅ Filtering/shuffling the full card list from static data on mount (runs once per category change)
- ✅ Deriving quiz options (generating 4 choices involves array operations on each card change)
- ❌ Do NOT memoize static data, simple string concatenations, or cheap derived values

### When to use useCallback
- ✅ `renderItem` prop passed to `FlatList` (category grid, missed cards list)
- ✅ Callbacks passed down to `React.memo`-wrapped children where the parent re-renders frequently
- ❌ Do NOT wrap simple inline handlers like `() => navigation.goBack()` or `() => setFlipped(true)`

### When to use React.memo
- ✅ `QuizOption` — rendered in a list, receives stable props, re-renders would be costly
- ✅ `CategoryCard` — rendered in a grid, only needs to re-render when its own data changes
- ❌ Do NOT wrap every component. `ProgressBar`, `ScoreDisplay`, and `Button` render cheaply and don't need it.

### State ownership
- `FlashCard` manages its own flip animation state internally — do not lift flip state to the screen
- Session progress (correctIds, incorrectIds, currentIndex) lives in the screen via `useReducer`
- Global settings (shuffle, last category) live in AsyncStorage, loaded once in the home screen

---

## Reusable Components

### `<Button />`
General-purpose button used everywhere.
```tsx
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: string; // Ionicons name
  fullWidth?: boolean;
}
```

### `<ScreenWrapper />`
Wraps every screen with `SafeAreaView`, background color, and optional `ScrollView`.
```tsx
interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
}
```

### `<ProgressBar />`
Horizontal bar showing position in the deck.
```tsx
interface ProgressBarProps {
  current: number;   // 0-based index
  total: number;
  showLabel?: boolean;
}
```
Animate width change with reanimated `useSharedValue`.

### `<ScoreDisplay />`
Shows live correct/total during a session.
```tsx
interface ScoreDisplayProps {
  correct: number;
  total: number;
  streak?: number;
}
```

### `<CategoryCard />`
Tappable card for category selection screen. Wrap in `React.memo`.
```tsx
interface CategoryCardProps {
  category: Category;
  cardCount: number;
  bestScore?: number;     // percentage from stored history, if any
  onPress: () => void;
}
```

### `<FlashCard />`
The main study card. Manages its own flip state internally.
```tsx
interface FlashCardProps {
  card: Flashcard;
  onCorrect: () => void;
  onIncorrect: () => void;
  showHint?: boolean;
}
```
- Front: shows `prompt`
- Back: shows `answer`, `exampleWord`, `translation`
- Flip animation: use `react-native-reanimated` `useSharedValue` + `useAnimatedStyle` with `rotateY`
- After flip: show "✓ Got it" and "✗ Missed it" buttons
- Swipe right = correct, swipe left = missed (use `react-native-gesture-handler`)
- Reset flip state when `card.id` changes (use `useEffect` watching `card.id`)

### `<QuizOption />`
Single multiple-choice answer button. Wrap in `React.memo`.
```tsx
interface QuizOptionProps {
  label: string;
  onPress: () => void;
  state: 'default' | 'correct' | 'incorrect' | 'disabled';
}
```
Animate background color change on selection.

### `<ResultsSummary />`
End-of-session results panel.
```tsx
interface ResultsSummaryProps {
  score: number;
  total: number;
  missedCards: Flashcard[];
  onRetryMissed: () => void;
  onBackToMenu: () => void;
  mode: 'flashcard' | 'quiz';
}
```

---

## Screens

### Home Screen (`/app/index.tsx`)
- App title + subtitle
- Grid of `<CategoryCard>` components (2 columns) using `FlatList`
- Each card shows: category name, card count, best score (from AsyncStorage)
- Tapping a category navigates to a mode-select bottom sheet or inline toggle: **Flashcard** vs **Quiz**
- "Study All" button prominent at top

### Flashcard Screen (`/app/flashcard.tsx`)
Receives `categoryId` as a route param.

State (use `useReducer`):
```ts
type FlashcardAction =
  | { type: 'FLIP' }
  | { type: 'MARK_CORRECT' }
  | { type: 'MARK_INCORRECT' }
  | { type: 'NEXT' }
  | { type: 'TOGGLE_HINT' }
  | { type: 'COMPLETE' };

interface FlashcardState {
  cards: Flashcard[];       // shuffled deck for this session
  currentIndex: number;
  isFlipped: boolean;
  showHint: boolean;
  correctIds: string[];
  incorrectIds: string[];
  isComplete: boolean;
}
```

UI flow:
1. Show `<ProgressBar>` + `<ScoreDisplay>` at top
2. Show `<FlashCard>` for current card
3. After marking, auto-advance after 500ms (or immediately on swipe)
4. On completion: save progress to AsyncStorage, navigate to Results

### Quiz Screen (`/app/quiz.tsx`)
Receives `categoryId` as a route param.

- Generates 4 answer options per card: 1 correct + 3 wrong (pulled from same category or adjacent categories)
- Wrong answers should be plausible (other endings from the same paradigm group)
- State tracks: `selectedAnswer`, `isAnswered`, `score`, `currentIndex`
- On answer: highlight correct green, wrong red, then auto-advance after 1200ms
- On completion: save result to AsyncStorage, navigate to Results

### Results Screen (`/app/results.tsx`)
Receives `score`, `total`, `missedCardIds`, `mode`, `categoryId` as route params.

- Show circular score indicator with percentage
- Encouraging message:
  - < 60%: "Keep practicing! Every master was once a beginner. 💪"
  - 60–84%: "Good work! You're building solid foundations. 📖"
  - 85–100%: "Excellent! Ὁ λόγος σου ἰσχυρός ἐστιν! 🏆"
- List missed cards: show prompt → correct answer
- Buttons: **Retry Missed**, **Study Again**, **Back to Menu**

---

## Custom Hook: `useProgress`

Location: `/src/hooks/useProgress.ts`

```ts
export function useProgress() {
  // Loads card progress from AsyncStorage on mount
  return {
    cardProgress: Record<string, CardProgress>,
    sessionHistory: SessionResult[],
    isLoading: boolean,
    saveSessionResult: (result: SessionResult) => Promise<void>,
    updateCardProgress: (cardId: string, wasCorrect: boolean) => Promise<void>,
    resetProgress: () => Promise<void>,
  };
}
```

Use this hook in screens only, not in leaf components.

---

## Data: Grammar Content

### NOUNS — Declension Endings

#### First Declension (Feminine, -η / -α stems)

| Case | Singular | Plural |
|------|----------|--------|
| Nominative | -η / -α | -αι |
| Genitive | -ης / -ας | -ων |
| Dative | -ῃ / -ᾳ | -αις |
| Accusative | -ην / -αν | -ας |
| Vocative | -η / -α | -αι |

Example words: **ἀρχή** (beginning/rule), **ἡμέρα** (day)

#### Second Declension (Masculine -ος, Neuter -ον)

| Case | Masc Sg | Masc Pl | Neut Sg | Neut Pl |
|------|---------|---------|---------|---------|
| Nominative | -ος | -οι | -ον | -α |
| Genitive | -ου | -ων | -ου | -ων |
| Dative | -ῳ | -οις | -ῳ | -οις |
| Accusative | -ον | -ους | -ον | -α |
| Vocative | -ε | -οι | -ον | -α |

Example words: **λόγος** (word), **ἔργον** (work/deed)

#### Third Declension (Consonant stems — basic patterns)

| Case | Singular | Plural |
|------|----------|--------|
| Nominative | varies | -ες / -α |
| Genitive | -ος | -ων |
| Dative | -ι | -σι(ν) |
| Accusative | -α | -ας / -α |
| Vocative | varies | -ες / -α |

Example words: **σάρξ** (flesh), **πνεῦμα** (spirit)

### VERBS — Present Active Indicative (λύω)

| Person | Singular | Plural |
|--------|----------|--------|
| 1st | -ω | -ομεν |
| 2nd | -εις | -ετε |
| 3rd | -ει | -ουσι(ν) |

### VERBS — Present Middle/Passive Indicative

| Person | Singular | Plural |
|--------|----------|--------|
| 1st | -ομαι | -ομεθα |
| 2nd | -ῃ / -ει | -εσθε |
| 3rd | -εται | -ονται |

### VERBS — Imperfect Active Indicative

| Person | Singular | Plural |
|--------|----------|--------|
| 1st | -ον | -ομεν |
| 2nd | -ες | -ετε |
| 3rd | -ε(ν) | -ον |

Note: Add ε- augment prefix to stem (e.g., λύω → ἔλυον)

### VERBS — Aorist Active Indicative (1st aorist / sigmatic)

| Person | Singular | Plural |
|--------|----------|--------|
| 1st | -σα | -σαμεν |
| 2nd | -σας | -σατε |
| 3rd | -σε(ν) | -σαν |

### VERBS — Future Active Indicative

| Person | Singular | Plural |
|--------|----------|--------|
| 1st | -σω | -σομεν |
| 2nd | -σεις | -σετε |
| 3rd | -σει | -σουσι(ν) |

---

## Flashcard Data (hardcode in `/src/data/flashcards.ts`)

Build a complete array of at least 60 cards covering all paradigms above. Example entries:

```ts
export const flashcards: Flashcard[] = [
  // 1st Declension — η-stem
  { id: "1d-eta-nom-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Nominative Singular", answer: "-η", hint: "Subject form", exampleWord: "ἀρχή", translation: "beginning" },
  { id: "1d-eta-gen-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Genitive Singular", answer: "-ης", hint: "Possession / 'of'", exampleWord: "ἀρχῆς", translation: "of a beginning" },
  { id: "1d-eta-dat-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Dative Singular", answer: "-ῃ", hint: "To/for — note iota subscript", exampleWord: "ἀρχῇ", translation: "to/for a beginning" },
  { id: "1d-eta-acc-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Accusative Singular", answer: "-ην", hint: "Direct object", exampleWord: "ἀρχήν", translation: "beginning (direct obj)" },
  { id: "1d-eta-voc-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Vocative Singular", answer: "-η", hint: "Direct address — same as nominative", exampleWord: "ἀρχή", translation: "O beginning!" },
  { id: "1d-nom-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Nominative Plural", answer: "-αι", hint: "All 1st decl use -αι here", exampleWord: "ἀρχαί", translation: "beginnings" },
  { id: "1d-gen-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Genitive Plural", answer: "-ων", hint: "Shared with 2nd decl gen. pl.", exampleWord: "ἀρχῶν", translation: "of beginnings" },
  { id: "1d-dat-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Dative Plural", answer: "-αις", hint: "Ends in -αις", exampleWord: "ἀρχαῖς", translation: "to/for beginnings" },
  { id: "1d-acc-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Accusative Plural", answer: "-ας", hint: "Short alpha", exampleWord: "ἀρχάς", translation: "beginnings (pl obj)" },
  { id: "1d-alpha-nom-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Nominative Singular", answer: "-α", hint: "Pure alpha stem (after ρ, ε, ι)", exampleWord: "ἡμέρα", translation: "day" },
  { id: "1d-alpha-gen-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Genitive Singular", answer: "-ας", hint: "Alpha remains throughout", exampleWord: "ἡμέρας", translation: "of a day" },
  { id: "1d-alpha-dat-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Dative Singular", answer: "-ᾳ", hint: "Alpha with iota subscript", exampleWord: "ἡμέρᾳ", translation: "to/for a day" },
  { id: "1d-alpha-acc-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Accusative Singular", answer: "-αν", hint: "Alpha + nu", exampleWord: "ἡμέραν", translation: "day (direct obj)" },

  // 2nd Declension — Masculine
  { id: "2d-m-nom-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Nominative Singular", answer: "-ος", hint: "Subject form", exampleWord: "λόγος", translation: "word" },
  { id: "2d-m-gen-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Genitive Singular", answer: "-ου", hint: "Of / possession", exampleWord: "λόγου", translation: "of a word" },
  { id: "2d-m-dat-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Dative Singular", answer: "-ῳ", hint: "Omega with iota subscript", exampleWord: "λόγῳ", translation: "to/for a word" },
  { id: "2d-m-acc-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Accusative Singular", answer: "-ον", hint: "Direct object", exampleWord: "λόγον", translation: "word (direct obj)" },
  { id: "2d-m-voc-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Vocative Singular", answer: "-ε", hint: "Epsilon — unique to vocative sg.", exampleWord: "λόγε", translation: "O word!" },
  { id: "2d-m-nom-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Nominative Plural", answer: "-οι", hint: "Like Greek 'they'", exampleWord: "λόγοι", translation: "words" },
  { id: "2d-m-gen-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Genitive Plural", answer: "-ων", hint: "Shared across declensions", exampleWord: "λόγων", translation: "of words" },
  { id: "2d-m-dat-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Dative Plural", answer: "-οις", hint: "Omicron + iota + sigma", exampleWord: "λόγοις", translation: "to/for words" },
  { id: "2d-m-acc-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Accusative Plural", answer: "-ους", hint: "Long ou sound", exampleWord: "λόγους", translation: "words (pl obj)" },

  // 2nd Declension — Neuter
  { id: "2d-n-nom-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Nominative Singular", answer: "-ον", hint: "Same as masc. accusative sg.", exampleWord: "ἔργον", translation: "work/deed" },
  { id: "2d-n-acc-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Accusative Singular", answer: "-ον", hint: "Nom = Acc for neuter always", exampleWord: "ἔργον", translation: "work/deed (obj)" },
  { id: "2d-n-nom-pl",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Nominative/Accusative Plural", answer: "-α", hint: "Neuter pl. nom/acc always ends in -α", exampleWord: "ἔργα", translation: "works/deeds" },
  { id: "2d-n-gen-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Genitive Singular", answer: "-ου", hint: "Same as masculine genitive sg.", exampleWord: "ἔργου", translation: "of a work" },
  { id: "2d-n-dat-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Dative Singular", answer: "-ῳ", hint: "Same as masculine dative sg.", exampleWord: "ἔργῳ", translation: "to/for a work" },

  // 3rd Declension
  { id: "3d-gen-sg",      category: "noun-3rd-decl", prompt: "3rd Decl. — Genitive Singular", answer: "-ος", hint: "Key identifier for 3rd decl.", exampleWord: "σαρκός", translation: "of flesh" },
  { id: "3d-dat-sg",      category: "noun-3rd-decl", prompt: "3rd Decl. — Dative Singular", answer: "-ι", hint: "Simple iota", exampleWord: "σαρκί", translation: "to/for flesh" },
  { id: "3d-acc-sg",      category: "noun-3rd-decl", prompt: "3rd Decl. — Accusative Singular", answer: "-α", hint: "Short alpha", exampleWord: "σάρκα", translation: "flesh (obj)" },
  { id: "3d-nom-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. Masc/Fem — Nominative Plural", answer: "-ες", hint: "Epsilon + sigma", exampleWord: "σάρκες", translation: "flesh (pl)" },
  { id: "3d-gen-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. — Genitive Plural", answer: "-ων", hint: "Shared ending across all declensions", exampleWord: "σαρκῶν", translation: "of flesh (pl)" },
  { id: "3d-dat-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. — Dative Plural", answer: "-σι(ν)", hint: "Sigma + iota + moveable nu", exampleWord: "σαρξίν", translation: "to/for flesh (pl)" },
  { id: "3d-acc-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. Masc/Fem — Accusative Plural", answer: "-ας", hint: "Alpha + sigma", exampleWord: "σάρκας", translation: "flesh (pl obj)" },
  { id: "3d-neut-nom-pl", category: "noun-3rd-decl", prompt: "3rd Decl. Neuter — Nominative/Accusative Plural", answer: "-α", hint: "Like all neuter plurals", exampleWord: "πνεύματα", translation: "spirits" },
  { id: "3d-neut-gen-sg", category: "noun-3rd-decl", prompt: "3rd Decl. Neuter (πνεῦμα) — Genitive Singular", answer: "-ατος", hint: "Stem expands: πνευματ-", exampleWord: "πνεύματος", translation: "of a spirit" },

  // Present Active Indicative
  { id: "vpa-1sg", category: "verb-present-active", prompt: "Present Active — 1st Singular (I ___)", answer: "-ω", hint: "Omega — the dictionary form", exampleWord: "λύω", translation: "I loose" },
  { id: "vpa-2sg", category: "verb-present-active", prompt: "Present Active — 2nd Singular (You ___)", answer: "-εις", hint: "Epsilon + iota + sigma", exampleWord: "λύεις", translation: "You loose" },
  { id: "vpa-3sg", category: "verb-present-active", prompt: "Present Active — 3rd Singular (He/She/It ___)", answer: "-ει", hint: "Epsilon + iota (no sigma)", exampleWord: "λύει", translation: "He/she looses" },
  { id: "vpa-1pl", category: "verb-present-active", prompt: "Present Active — 1st Plural (We ___)", answer: "-ομεν", hint: "Omicron + men", exampleWord: "λύομεν", translation: "We loose" },
  { id: "vpa-2pl", category: "verb-present-active", prompt: "Present Active — 2nd Plural (You all ___)", answer: "-ετε", hint: "Epsilon + te", exampleWord: "λύετε", translation: "You all loose" },
  { id: "vpa-3pl", category: "verb-present-active", prompt: "Present Active — 3rd Plural (They ___)", answer: "-ουσι(ν)", hint: "Ou + si + moveable nu", exampleWord: "λύουσιν", translation: "They loose" },

  // Present Middle/Passive
  { id: "vmp-1sg", category: "verb-mid-pass", prompt: "Present Mid/Pass — 1st Singular", answer: "-ομαι", hint: "Omicron + mai", exampleWord: "λύομαι", translation: "I am loosed" },
  { id: "vmp-2sg", category: "verb-mid-pass", prompt: "Present Mid/Pass — 2nd Singular", answer: "-ῃ", hint: "Eta with iota subscript (contracted)", exampleWord: "λύῃ", translation: "You are loosed" },
  { id: "vmp-3sg", category: "verb-mid-pass", prompt: "Present Mid/Pass — 3rd Singular", answer: "-εται", hint: "Epsilon + tai", exampleWord: "λύεται", translation: "He/she is loosed" },
  { id: "vmp-1pl", category: "verb-mid-pass", prompt: "Present Mid/Pass — 1st Plural", answer: "-ομεθα", hint: "Omicron + metha", exampleWord: "λυόμεθα", translation: "We are loosed" },
  { id: "vmp-2pl", category: "verb-mid-pass", prompt: "Present Mid/Pass — 2nd Plural", answer: "-εσθε", hint: "Epsilon + sthe", exampleWord: "λύεσθε", translation: "You all are loosed" },
  { id: "vmp-3pl", category: "verb-mid-pass", prompt: "Present Mid/Pass — 3rd Plural", answer: "-ονται", hint: "Omicron + ntai", exampleWord: "λύονται", translation: "They are loosed" },

  // Imperfect Active
  { id: "via-1sg", category: "verb-imperfect", prompt: "Imperfect Active — 1st Singular", answer: "ἔ- + stem + -ον", hint: "Augment + secondary ending", exampleWord: "ἔλυον", translation: "I was loosing" },
  { id: "via-2sg", category: "verb-imperfect", prompt: "Imperfect Active — 2nd Singular", answer: "ἔ- + stem + -ες", hint: "Augment + es", exampleWord: "ἔλυες", translation: "You were loosing" },
  { id: "via-3sg", category: "verb-imperfect", prompt: "Imperfect Active — 3rd Singular", answer: "ἔ- + stem + -ε(ν)", hint: "Augment + en", exampleWord: "ἔλυε(ν)", translation: "He/she was loosing" },
  { id: "via-1pl", category: "verb-imperfect", prompt: "Imperfect Active — 1st Plural", answer: "ἔ- + stem + -ομεν", hint: "Like present but with augment", exampleWord: "ἐλύομεν", translation: "We were loosing" },
  { id: "via-2pl", category: "verb-imperfect", prompt: "Imperfect Active — 2nd Plural", answer: "ἔ- + stem + -ετε", hint: "Augment + ete", exampleWord: "ἐλύετε", translation: "You all were loosing" },
  { id: "via-3pl", category: "verb-imperfect", prompt: "Imperfect Active — 3rd Plural", answer: "ἔ- + stem + -ον", hint: "Same ending as 1sg — context distinguishes", exampleWord: "ἔλυον", translation: "They were loosing" },

  // Aorist Active
  { id: "vaa-1sg", category: "verb-aorist", prompt: "1st Aorist Active — 1st Singular", answer: "-σα", hint: "Sigma + alpha", exampleWord: "ἔλυσα", translation: "I loosed" },
  { id: "vaa-2sg", category: "verb-aorist", prompt: "1st Aorist Active — 2nd Singular", answer: "-σας", hint: "Sigma + alpha + sigma", exampleWord: "ἔλυσας", translation: "You loosed" },
  { id: "vaa-3sg", category: "verb-aorist", prompt: "1st Aorist Active — 3rd Singular", answer: "-σε(ν)", hint: "Sigma + epsilon", exampleWord: "ἔλυσε(ν)", translation: "He/she loosed" },
  { id: "vaa-1pl", category: "verb-aorist", prompt: "1st Aorist Active — 1st Plural", answer: "-σαμεν", hint: "Sigma + alpha + men", exampleWord: "ἐλύσαμεν", translation: "We loosed" },
  { id: "vaa-2pl", category: "verb-aorist", prompt: "1st Aorist Active — 2nd Plural", answer: "-σατε", hint: "Sigma + alpha + te", exampleWord: "ἐλύσατε", translation: "You all loosed" },
  { id: "vaa-3pl", category: "verb-aorist", prompt: "1st Aorist Active — 3rd Plural", answer: "-σαν", hint: "Sigma + alpha + nu", exampleWord: "ἔλυσαν", translation: "They loosed" },

  // Future Active
  { id: "vfa-1sg", category: "verb-future", prompt: "Future Active — 1st Singular", answer: "-σω", hint: "Sigma + omega", exampleWord: "λύσω", translation: "I will loose" },
  { id: "vfa-2sg", category: "verb-future", prompt: "Future Active — 2nd Singular", answer: "-σεις", hint: "Sigma + eis", exampleWord: "λύσεις", translation: "You will loose" },
  { id: "vfa-3sg", category: "verb-future", prompt: "Future Active — 3rd Singular", answer: "-σει", hint: "Sigma + ei", exampleWord: "λύσει", translation: "He/she will loose" },
  { id: "vfa-1pl", category: "verb-future", prompt: "Future Active — 1st Plural", answer: "-σομεν", hint: "Sigma + omen", exampleWord: "λύσομεν", translation: "We will loose" },
  { id: "vfa-2pl", category: "verb-future", prompt: "Future Active — 2nd Plural", answer: "-σετε", hint: "Sigma + ete", exampleWord: "λύσετε", translation: "You all will loose" },
  { id: "vfa-3pl", category: "verb-future", prompt: "Future Active — 3rd Plural", answer: "-σουσι(ν)", hint: "Sigma + ousi", exampleWord: "λύσουσιν", translation: "They will loose" },
];
```

---

## Design Direction

- **Aesthetic**: Warm, scholarly — aged parchment tones with clean modern typography
- **Color palette** (define in `/src/constants/colors.ts`):
  ```ts
  export const Colors = {
    parchment: '#F5E6C8',
    parchmentDark: '#E8D5A3',
    ink: '#1a0a00',
    inkLight: '#3d2b1f',
    terracotta: '#C0622A',
    gold: '#B8922A',
    successGreen: '#2E7D32',
    errorRed: '#C62828',
    cardBg: '#FFFDF5',
    screenBg: '#FAF0DC',
    border: '#D4B896',
    textMuted: '#7a5c3a',
  };
  ```
- **Typography**: `Crimson Pro` or `IM Fell English` via expo-google-fonts. Fall back to `Georgia` / `serif`. Greek characters must render cleanly in the same font.
- **Card shadow**: Use `elevation` (Android) and `shadowColor/shadowOffset/shadowOpacity/shadowRadius` (iOS)
- **Animations**:
  - Card flip: `react-native-reanimated` `rotateY` with `backfaceVisibility: 'hidden'`
  - Progress bar: animated width using `useSharedValue`
  - Correct answer: brief scale bounce

---

## Navigation Flow

```
Home (category grid)
  └─► [tap category] → Mode select (sheet or inline toggle)
        ├─► Flashcard Screen (categoryId)
        │     └─► Results Screen (score, missedIds, mode)
        │           ├─► Retry Missed → Flashcard Screen (missedIds only)
        │           └─► Home
        └─► Quiz Screen (categoryId)
              └─► Results Screen (score, missedIds, mode)
```

---

## Final Implementation Notes

- All flashcard data is **hardcoded** in `/src/data/flashcards.ts` — no API calls needed
- Greek characters use **precomposed Unicode (NFC)** — not combining diacritics
- Test layout on both **iOS and Android** — handle safe area insets for both platforms
- Keep component files focused — if a file exceeds ~150 lines, consider splitting it
- All screens export a **default component**; all reusable components are **named exports**
- Write clean, readable code — this project may be extended later (e.g. adding participles, subjunctive mood)
- Include a **"Reset Progress"** option accessible from the home screen or a settings modal

---

*Build this as a complete, multi-file React Native Expo project using TypeScript.*
