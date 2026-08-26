import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email(),
});

export const createProjectSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  category: z.string().min(2),
  featured: z.boolean().optional(),
});

export const createPublicPortfolioSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  bio: z.string().min(10),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
