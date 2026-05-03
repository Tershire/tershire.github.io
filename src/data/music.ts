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
  image?: string;  // path under /public, e.g. '/images/artists/casker.jpg'
}

export const favoriteArtists: Artist[] = [
  {
    slug: 'casker',
    name: 'Casker',
    flag: '🇰🇷',
    country: 'Republic of Korea',
    countryCode: 'KR',
    genre: 'Electronica',
    description: '',
    color: 'rgba(202, 202, 202, 0.6)',
    accent: '#414141e1',
    keyWorks: ['Skylab'],
    image: '/images/artists/casker.webp',
  },
  {
    slug: 'justice',
    name: 'Justice',
    flag: '🇫🇷',
    country: 'France',
    countryCode: 'FR',
    genre: 'Electronica',
    description: '',
    color: 'rgba(202, 202, 202, 0.6)',
    accent: '#414141e1',
    keyWorks: ['†'],
    image: '/images/artists/justice.webp',
  },
  {
    slug: 'kino',
    name: 'Кино',
    flag: '☭',
    country: 'Soviet Union',
    countryCode: '',
    genre: 'Rock',
    description: '',
    color: 'rgba(202, 202, 202, 0.6)',
    accent: '#414141e1',
    keyWorks: ['Группа крови'],
    image: '/images/artists/kino.webp',
  },
  {
    slug: 'jobim',
    name: 'Tom Jobim',
    flag: '🇧🇷',
    country: 'Brazil',
    countryCode: 'BR',
    genre: 'Bossa Nova',
    description: '',
    color: 'rgba(202, 202, 202, 0.6)',
    accent: '#414141e1',
    keyWorks: ['Inédito'],
    image: '/images/artists/jobim.webp',
  },
  {
    slug: 'casiopea',
    name: 'Casiopea',
    flag: '🇯🇵',
    country: 'Japan',
    countryCode: 'JP',
    genre: 'Jazz',
    description: '',
    color: 'rgba(202, 202, 202, 0.6)',
    accent: '#414141e1',
    keyWorks: ['Soundgraphy'],
    image: '/images/artists/casiopea.webp',
  },
  {
    slug: 'tchaikovsky',
    name: 'Pyotr Ilyich Tchaikovsky',
    flag: '🇷🇺',
    country: 'Russian Empire',
    countryCode: 'RU',
    genre: 'Classical',
    description: '',
    color: 'rgba(202, 202, 202, 0.6)',
    accent: '#414141e1',
    keyWorks: ['The Nutcracker'],
    image: '/images/artists/tchaikovsky.webp',
  },
  {
    slug: 'jaeha',
    name: 'Yoo Jae-ha',
    flag: '🇰🇷',
    country: 'Republic of Korea',
    countryCode: 'KR',
    genre: 'Pop',
    description: '',
    color: 'rgba(202, 202, 202, 0.6)',
    accent: '#414141e1',
    keyWorks: ['Because I Love You'],
    image: '/images/artists/jaeha.webp',
  },
];
