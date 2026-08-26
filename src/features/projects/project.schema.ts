import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  type: z.string().min(1),
  summary: z.string().min(1),
  problem: z.string().min(1),
  objective: z.string().min(1).optional().or(z.literal("")),
  solution: z.string().min(1).optional().or(z.literal("")),
  client: z.string().optional().or(z.literal("")),
  role: z.string().optional().or(z.literal("")),
  completedDate: z.string().optional().or(z.literal("")),
  dataset: z.string().min(1).optional().or(z.literal("")),
  tools: z.array(z.string()).default([]),
  process: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  findings: z.string().optional().or(z.literal("")),
  impact: z.string().optional().or(z.literal("")),
  metric: z.string().optional().or(z.literal("")),
  metricLabel: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  coverImage: z.string().url().or(z.literal("")),
});

export type ProjectInput = z.infer<typeof projectSchema>;