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

export const collections = { blog, projects, hobbies };
