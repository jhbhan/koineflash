import { Flashcard } from '../types';
import { shuffle } from './shuffle';

/**
 * Generates 4 quiz options: 1 correct + 3 plausible distractors
 */
export function generateQuizOptions(
  correctCard: Flashcard,
  allCards: Flashcard[]
): string[] {
  // Distractors from the same category are best
  const sameCategory = allCards.filter(
    (c) => c.category === correctCard.category && c.answer !== correctCard.answer
  );

  // If not enough in same category, take from others
  const others = allCards.filter(
    (c) => c.category !== correctCard.category && c.answer !== correctCard.answer
  );

  const distractors = shuffle([...sameCategory, ...others])
    .map((c) => c.answer)
    // Filter unique answers to avoid duplicate options
    .filter((answer, index, self) => self.indexOf(answer) === index && answer !== correctCard.answer)
    .slice(0, 3);

  return shuffle([correctCard.answer, ...distractors]);
}
