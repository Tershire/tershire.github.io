export interface Hobby {
  slug: string;
  name: string;
  emoji: string;
  type: 'tech' | 'physical' | 'art' | 'game' | 'unclassified';
  startYear: number;
  endYear: number | null;
  description: string;
  highlights: string[];
  image?: string;
  imagePosition?: string;
  color: string;
  accent: string;
  hasDetail: boolean;
}

export const hobbies: Hobby[] = [
  {
    slug: 'park_sim_game',
    name: 'Amusement Park Simulation Games',
    emoji: '🎢',
    type: 'game',
    startYear: 2010,
    endYear: null,
    color: 'rgba(53, 53, 53, 0.7)',
    accent: '#d3d3d3',
    description: "Architecture & Engineering",
    highlights: ['RollerCoaster Tycoon 3', 'Planet Coaster', 'Planet Coaster 2'],
    hasDetail: false,
    image: '/images/hobbies/park_sim_game.webp',
    imagePosition: 'top',
  },
  {
    slug: 'boxing',
    name: 'Boxing',
    emoji: '🥊',
    type: 'physical',
    startYear: 2025,
    endYear: null,
    color: 'rgba(53, 53, 53, 0.7)',
    accent: '#d3d3d3',
    description: "Martial arts",
    highlights: [''],
    hasDetail: true,
    image: '/images/hobbies/boxing.webp',
    imagePosition: 'top',
  },
  {
    slug: 'piano',
    name: 'Piano',
    emoji: '🎹',
    type: 'art',
    startYear: 2026,
    endYear: null,
    color: 'rgba(53, 53, 53, 0.7)',
    accent: '#d3d3d3',
    description: "Musical instrument",
    highlights: ['Roland FP-30X'],
    hasDetail: true,
    image: '/images/hobbies/piano.webp',
    imagePosition: 'bottom',
  },
];

export const TYPE_LABELS: Record<Hobby['type'], string> = {
  tech: 'Tech',
  physical: 'Physical',
  art: 'Art',
  game: 'Game',
  unclassified: 'Unclassified',
};
