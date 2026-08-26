"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, requireDatabaseUrl } from "@/server/db";
import { requireSession } from "@/server/actions/auth";

const projectInput = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  type: z.string().min(2),
  summary: z.string().min(10),
  problem: z.string().min(10).optional().default(""),
  objective: z.string().min(5).optional().default(""),
  solution: z.string().min(5).optional().default(""),
  client: z.string().optional().default(""),
  role: z.string().optional().default(""),
  completedDate: z.string().optional().default(""),
  dataset: z.string().min(5).optional().default(""),
  tools: z.string().min(1),
  process: z.string().min(1),
  challenges: z.string().optional().default(""),
  findings: z.string().min(5).optional().default(""),
  impact: z.string().min(5).optional().default(""),
  metric: z.string().optional().default(""),
  metricLabel: z.string().optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  coverImage: z.string().url().or(z.literal("")).optional().default(""),
});

const parseCsvList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export async function createProject(input: z.input<typeof projectInput>) {
  requireDatabaseUrl();
  const user = await requireSession();
  if (!user) return { ok: false, message: "Sign in to create a project." };

  const project = projectInput.parse(input);
  const saved = await db.project.create({
    data: {
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      status: project.status,
      tenantId: user.tenantId,
      content: {
        type: project.type,
        problem: project.problem,
        objective: project.objective,
        solution: project.solution,
        client: project.client,
        role: project.role,
        completedDate: project.completedDate,
        dataset: project.dataset,
        tools: parseCsvList(project.tools),
        process: parseCsvList(project.process),
        challenges: parseCsvList(project.challenges),
        findings: project.findings,
        impact: project.impact,
        metric: project.metric,
        metricLabel: project.metricLabel,
        coverImage: project.coverImage,
        gallery: [],
      },
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${saved.slug}`);
  return { ok: true, slug: saved.slug };
}
