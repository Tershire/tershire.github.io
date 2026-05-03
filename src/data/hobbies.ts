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
    slug: 'film-photography',
    name: 'Film Photography',
    emoji: '📷',
    type: 'art',
    startYear: 2021,
    endYear: null,
    color: 'rgba(254,243,199,0.7)',
    accent: '#d97706',
    description: "There's something irreplaceable about the deliberateness of shooting on film. I shoot mostly 35mm — Kodak Portra for color, Ilford HP5 for black and white.",
    highlights: ['Pentax K1000', 'Kodak Portra 400', 'Street & landscape', 'Self-developing B&W'],
    hasDetail: true,
  },
  {
    slug: 'rock-climbing',
    name: 'Rock Climbing',
    emoji: '🧗',
    type: 'physical',
    startYear: 2022,
    endYear: null,
    color: 'rgba(209,250,229,0.7)',
    accent: '#059669',
    description: 'Bouldering indoors keeps me sharp during the week; sport climbing outdoors is where I actually feel alive. Currently projecting V7 in the gym.',
    highlights: ['Bouldering V6–V7', 'Sport climbing 5.11', 'La Sportiva Solutions', 'Outdoor crags'],
    hasDetail: true,
  },
  {
    slug: 'mechanical-keyboards',
    name: 'Mechanical Keyboards',
    emoji: '⌨️',
    type: 'tech',
    startYear: 2020,
    endYear: null,
    color: 'rgba(219,234,254,0.7)',
    accent: '#2563eb',
    description: 'The hobby that started as "I just need a better keyboard for coding" and spiraled. I hand-wire custom builds and have opinions about stabilizers.',
    highlights: ['Hand-wired builds', 'Tactile & linear switches', 'KiCAD PCB design', 'Foam dampening mods'],
    hasDetail: false,
  },
  {
    slug: 'espresso',
    name: 'Espresso',
    emoji: '☕',
    type: 'unclassified',
    startYear: 2021,
    endYear: null,
    color: 'rgba(252,231,243,0.7)',
    accent: '#be185d',
    description: 'Single-origin pour-overs on weekdays, weekend espresso ritual with a Gaggia Classic Pro. I track extraction data obsessively.',
    highlights: ['Gaggia Classic Pro', 'Single-origin beans', 'Water chemistry', 'Light roast espresso'],
    hasDetail: false,
  },
  {
    slug: 'reading',
    name: 'Reading',
    emoji: '📚',
    type: 'unclassified',
    startYear: 2015,
    endYear: null,
    color: 'rgba(243,232,255,0.7)',
    accent: '#7c3aed',
    description: 'History of science, philosophy of mind, and good fiction. Currently reading Gödel, Escher, Bach for the third time.',
    highlights: ['History of science', 'Philosophy of mind', 'Douglas Hofstadter', 'Classic sci-fi'],
    hasDetail: false,
  },
  {
    slug: 'cycling',
    name: 'Cycling',
    emoji: '🚴',
    type: 'physical',
    startYear: 2023,
    endYear: null,
    color: 'rgba(236,253,245,0.7)',
    accent: '#10b981',
    description: 'Weekend rides along the Han River and occasional longer gravel routes outside the city. Canyon Grail, aluminum, sensible.',
    highlights: ['Canyon Grail', 'Gravel routes', 'Han River rides', '60–80 km weekends'],
    hasDetail: false,
  },
];

export const TYPE_LABELS: Record<Hobby['type'], string> = {
  tech: 'Tech',
  physical: 'Physical',
  art: 'Art',
  unclassified: 'Unclassified',
};
