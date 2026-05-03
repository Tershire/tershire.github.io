import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    readingTime: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const hobbies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/hobbies' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    type: z.enum(['album', 'EP', 'single', 'track', 'compilation']),
    releaseDate: z.string(),
    country: z.string(),
    countryCode: z.string(),
    flag: z.string(),
    description: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    tags: z.array(z.string()).default([]),
    color: z.string().optional(),
    accent: z.string().optional(),
    image: z.string().optional(),
    spotifyUrl: z.string().optional(),
    appleMusicUrl: z.string().optional(),
    youtubeUrl: z.string().optional(),
  }),
});

export const collections = { blog, projects, hobbies, music };
