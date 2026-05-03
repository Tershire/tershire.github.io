export const SITE = {
  name: 'Tershire',
  tagline: 'Researcher · Engineer · Explorer',
  description: 'Personal website of Tershire — research, projects, and passions.',
  author: 'Tershire',
  email: 'tershire@gmail.com',
  github: 'https://github.com/tershire',
  profileImage: '/images/profile.jpeg',
  homeBg: '/images/home-bg-day.png',
  homeBgDark: '/images/home-bg-night.png',
};

export const NAV_LINKS = [
  {
    label: 'Research',
    href: '/projects',
    children: [
      { label: 'Projects', href: '/projects' },
      { label: 'Papers', href: '/papers' },
    ],
  },
  {
    label: 'Writing',
    href: '/blog',
    children: [
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    label: 'Interests',
    href: '/interests/music',
    children: [
      { label: 'Music', href: '/interests/music' },
    ],
  },
  {
    label: 'Hobbies',
    href: '/hobbies',
    children: [],
  },
  {
    label: 'About',
    href: '/about',
    children: [],
  },
];
