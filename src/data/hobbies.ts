export interface Hobby {
  slug: string;
  name: string;
  emoji: string;
  type: 'tech' | 'physical' | 'art' | 'unclassified';
  startYear: number;
  endYear: number | null;
  description: string;
  highlights: string[];
  image?: string;
  color: string;
  accent: string;
  hasDetail: boolean;
}

export const hobbies: Hobby[] = [
  {
    slug: 'boxing',
    name: 'Boxing',
    emoji: '🥊',
    type: 'physical',
    startYear: 2025,
    endYear: null,
    color: 'rgba(172, 172, 172, 0.7)',
    accent: '#8b8b8b',
    description: "Martial arts.",
    highlights: [''],
    hasDetail: true,
  },
  {
    slug: 'piano',
    name: 'Piano',
    emoji: '🎹',
    type: 'art',
    startYear: 2026,
    endYear: null,
    color: 'rgba(78, 0, 0, 0.7)',
    accent: '#8b8b8b',
    description: "Musical instrument.",
    highlights: ['Roland FP-30X'],
    hasDetail: true,
  },
];

export const TYPE_LABELS: Record<Hobby['type'], string> = {
  tech: 'Tech',
  physical: 'Physical',
  art: 'Art',
  unclassified: 'Unclassified',
};
