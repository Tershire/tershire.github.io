export interface Artist {
  slug: string;
  name: string;
  flag: string;
  country: string;
  countryCode: string;
  genre: string;
  description: string;
  color: string;
  accent: string;
  keyWorks: string[];
  image?: string;  // path under /public, e.g. '/images/artists/radiohead.jpg'
}

export const favoriteArtists: Artist[] = [
  {
    slug: 'radiohead',
    name: 'Radiohead',
    flag: '🇬🇧',
    country: 'United Kingdom',
    countryCode: 'GB',
    genre: 'Alternative Rock',
    description: 'Architects of melancholy. Each record is a new universe unto itself.',
    color: 'rgba(219,234,254,0.6)',
    accent: '#1d4ed8',
    keyWorks: ['OK Computer', 'Kid A', 'In Rainbows'],
  },
  {
    slug: 'nujabes',
    name: 'Nujabes',
    flag: '🇯🇵',
    country: 'Japan',
    countryCode: 'JP',
    genre: 'Jazz Hip-Hop',
    description: 'Soulful loops and jazzy samples that feel entirely outside of time.',
    color: 'rgba(254,243,199,0.6)',
    accent: '#d97706',
    keyWorks: ['Metaphorical Music', 'Modal Soul', 'Luv(sic) series'],
  },
  {
    slug: 'bon-iver',
    name: 'Bon Iver',
    flag: '🇺🇸',
    country: 'United States',
    countryCode: 'US',
    genre: 'Indie Folk',
    description: 'Vulnerability and beauty in equal measure — cabin isolation turned into art.',
    color: 'rgba(209,250,229,0.6)',
    accent: '#059669',
    keyWorks: ['For Emma, Forever Ago', 'Bon Iver, Bon Iver', '22, A Million'],
  },
  {
    slug: 'iu',
    name: 'IU',
    flag: '🇰🇷',
    country: 'South Korea',
    countryCode: 'KR',
    genre: 'Pop / R&B',
    description: 'Unmatched craft in Korean pop. Lyrics that land with quiet precision.',
    color: 'rgba(252,231,243,0.6)',
    accent: '#be185d',
    keyWorks: ['Chat-Shire', 'Palette', 'LILAC'],
  },
  {
    slug: 'sigur-ros',
    name: 'Sigur Rós',
    flag: '🇮🇸',
    country: 'Iceland',
    countryCode: 'IS',
    genre: 'Post-Rock / Ambient',
    description: 'Sound as landscape. Music that feels geological in scale and patience.',
    color: 'rgba(243,232,255,0.6)',
    accent: '#7c3aed',
    keyWorks: ['Ágætis byrjun', '( )', 'Takk...'],
  },
  {
    slug: 'nick-drake',
    name: 'Nick Drake',
    flag: '🇬🇧',
    country: 'United Kingdom',
    countryCode: 'GB',
    genre: 'Folk',
    description: 'Intimate fingerpicking and words that feel more relevant with every passing year.',
    color: 'rgba(236,253,245,0.6)',
    accent: '#065f46',
    keyWorks: ['Five Leaves Left', 'Bryter Layter', 'Pink Moon'],
  },
];
