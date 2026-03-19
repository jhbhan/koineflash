import { Flashcard, CategoryId } from '../types';
import { shuffle } from './shuffle';

/**
 * Group categories that are semantically similar.
 * Distractors should preferably come from the same group.
 */
const CATEGORY_GROUPS: Record<string, CategoryId[]> = {
  endings: [
    'noun-1st-decl',
    'noun-2nd-decl',
    'noun-3rd-decl',
    'verb-present-active',
    'verb-mid-pass',
    'verb-imperfect',
    'verb-aorist',
    'verb-future'
  ],
  prepositions: ['preposition'],
};

function getGroup(categoryId: CategoryId): string | null {
  for (const [groupName, categories] of Object.entries(CATEGORY_GROUPS)) {
    if (categories.includes(categoryId)) {
      return groupName;
    }
  }
  return null;
}

/**
 * Generates 4 quiz options: 1 correct + 3 plausible distractors
 */
export function generateQuizOptions(
  correctCard: Flashcard,
  allCards: Flashcard[]
): string[] {
  const currentGroup = getGroup(correctCard.category);

  // 1. Same category distractors (BEST)
  const sameCategory = allCards.filter(
    (c) => c.category === correctCard.category && c.answer !== correctCard.answer
  );

  // 2. Same group distractors (GOOD)
  const sameGroup = currentGroup 
    ? allCards.filter(
        (c) => 
          c.category !== correctCard.category && 
          getGroup(c.category) === currentGroup && 
          c.answer !== correctCard.answer
      )
    : [];

  // 3. Other distractors (BACKUP - but exclude incompatible groups)
  const others = allCards.filter(
    (c) => 
      c.category !== correctCard.category && 
      getGroup(c.category) !== currentGroup &&
      c.answer !== correctCard.answer
  );

  // Heuristic: If the answer is a suffix/ending (starts with - or contains +), 
  // only take distractors that look like suffixes.
  const isEnding = correctCard.answer.startsWith('-') || correctCard.answer.includes('+');
  
  // Heuristic: If the answer is a Case (Dative, Accusative, Genitive, etc.), 
  // only take distractors that are also Cases.
  const CASES = ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative'];
  const isCase = CASES.includes(correctCard.answer);

  // Combine potential distractors in order of priority
  // First, filter ALL potential distractors by these heuristics
  const allPotentials = [...shuffle(sameCategory), ...shuffle(sameGroup), ...shuffle(others)];
  
  const filteredDistractors = allPotentials.filter(c => {
    // Check Ending compatibility
    const targetIsEnding = c.answer.startsWith('-') || c.answer.includes('+');
    if (isEnding !== targetIsEnding) return false;

    // Check Case compatibility
    const targetIsCase = CASES.includes(c.answer);
    if (isCase !== targetIsCase) return false;

    // Additional check: if it's not an ending and not a case, it's likely a translation.
    // Ensure we don't mix translations with cases/endings (already covered by above)
    return true;
  });

  // Final unique distractor answers
  const distractors = filteredDistractors
    .map((c) => c.answer)
    .filter((answer, index, self) => self.indexOf(answer) === index && answer !== correctCard.answer)
    .slice(0, 3);

  // If we still don't have enough (e.g. very unique category), 
  // we might have to take anything, but let's try to stay within the group if possible.
  return shuffle([correctCard.answer, ...distractors]);
}
