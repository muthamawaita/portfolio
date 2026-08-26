"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, requireDatabaseUrl } from "@/server/db";

const resumeSchema = z.object({ tenantId: z.string().min(1), template: z.enum(["editorial", "classic", "minimal"]), content: z.string().min(20) });

export async function saveResume(input: z.input<typeof resumeSchema>) {
  requireDatabaseUrl();
  const resume = resumeSchema.parse(input);
  const saved = await db.resume.upsert({ where: { tenantId: resume.tenantId }, update: { template: resume.template, content: JSON.parse(resume.content) }, create: { tenantId: resume.tenantId, template: resume.template, content: JSON.parse(resume.content) } });
  revalidatePath("/cv");
  revalidatePath("/admin/resume");
  return { ok: true, id: saved.id };
}
