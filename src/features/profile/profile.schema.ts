import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  bio: z.string().min(1),
  careerBackground: z.string().min(1).optional(),
  specializations: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([]),
  values: z.array(z.string()).default([]),
  profileImageUrl: z.string().url().optional(),
  cvUrl: z.string().url().optional(),
});