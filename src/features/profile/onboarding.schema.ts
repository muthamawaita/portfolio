import { z } from "zod";

export const onboardingSchema = z.object({
  purpose: z.enum([
    "Developer",
    "Data Analyst",
    "Designer",
    "Photographer",
    "Student",
    "Researcher",
    "Consultant",
    "Business Owner",
    "Freelancer",
    "Other",
  ]),
  template: z.enum(["editorial", "minimal", "bold"]).default("editorial"),
  name: z.string().min(2),
  professionalTitle: z.string().min(2),
  bio: z.string().min(10),
  location: z.string().min(2).optional(),
  profileImageUrl: z.string().url().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  firstProjectTitle: z.string().min(1).optional(),
  firstProjectDescription: z.string().min(1).optional(),
});
