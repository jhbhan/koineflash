import { Category } from '../types';
import { Colors } from '../constants/colors';

export const categories: Category[] = [
  {
    id: 'noun-1st-decl',
    label: '1st Declension',
    description: 'η and α stem nouns (mostly feminine)',
    icon: 'female-outline',
    color: Colors.terracotta,
  },
  {
    id: 'noun-2nd-decl',
    label: '2nd Declension',
    description: 'Masculine (-ος) and Neuter (-ον) nouns',
    icon: 'male-outline',
    color: Colors.gold,
  },
  {
    id: 'noun-3rd-decl',
    label: '3rd Declension',
    description: 'Consonant stems and varied patterns',
    icon: 'body-outline',
    color: Colors.inkLight,
  },
  {
    id: 'verb-present-active',
    label: 'Present Active',
    description: 'Standard active voice verb patterns',
    meaning: 'e.g. "I loose" or "I am loosing"',
    icon: 'flash-outline',
    color: Colors.successGreen,
  },
  {
    id: 'verb-mid-pass',
    label: 'Present Mid/Pass',
    description: 'Middle and passive voice verb patterns',
    meaning: 'e.g. "I am being loosed"',
    icon: 'repeat-outline',
    color: Colors.terracotta,
  },
  {
    id: 'verb-imperfect',
    label: 'Imperfect Active',
    description: 'Past ongoing action patterns',
    meaning: 'e.g. "I was loosing"',
    icon: 'time-outline',
    color: Colors.ink,
  },
  {
    id: 'verb-aorist',
    label: 'Aorist Active',
    description: 'Past completed action (sigmatic aorist)',
    meaning: 'e.g. "I loosed"',
    icon: 'checkmark-done-outline',
    color: Colors.errorRed,
  },
  {
    id: 'verb-future',
    label: 'Future Active',
    description: 'Action that will happen',
    meaning: 'e.g. "I will loose"',
    icon: 'trending-up-outline',
    color: Colors.gold,
  },
  {
    id: 'preposition',
    label: 'Prepositions',
    description: 'Common prepositions and their cases',
    icon: 'link-outline',
    color: Colors.inkLight,
  },
];
