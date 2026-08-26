import { z } from "zod";

export const createProjectDto = z.object({
  title: z.string().trim().min(3, "Project title is required."),
  description: z.string().trim().min(20, "Project description is required."),
  category: z.string().trim().min(2, "Project category is required."),
  technologies: z.array(z.string().trim().min(1)).min(1, "Add at least one technology."),
});

export const registerUserDto = z.object({
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  username: z.string().trim().min(3, "Username is required."),
  email: z.string().trim().email("Valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  acceptTerms: z.boolean().refine((value) => value, "You must accept the terms."),
});

export const updateProfileDto = z.object({
  name: z.string().trim().min(2, "Name is required."),
  headline: z.string().trim().min(2, "Headline is required."),
  bio: z.string().trim().min(30, "Bio must be at least 30 characters."),
  technologies: z.array(z.string().trim()).default([]),
  interests: z.array(z.string().trim()).default([]),
});

export type CreateProjectDto = z.infer<typeof createProjectDto>;
export type RegisterUserDto = z.infer<typeof registerUserDto>;
export type UpdateProfileDto = z.infer<typeof updateProfileDto>;
