"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";

const pageSchema = z.object({ tenantId: z.string().min(1), title: z.string().min(1), slug: z.string().min(1), content: z.string().min(1), status: z.enum(["DRAFT", "PUBLISHED"]), seoTitle: z.string().optional(), seoDescription: z.string().optional() });

export async function saveSitePage(input: z.input<typeof pageSchema>) {
  const page = pageSchema.parse(input);
  const saved = await db.sitePage.upsert({ where: { tenantId_slug: { tenantId: page.tenantId, slug: page.slug } }, update: { title: page.title, content: JSON.parse(page.content), status: page.status, seoTitle: page.seoTitle, seoDescription: page.seoDescription }, create: { tenantId: page.tenantId, title: page.title, slug: page.slug, content: JSON.parse(page.content), status: page.status, seoTitle: page.seoTitle, seoDescription: page.seoDescription } });
  revalidatePath(`/p/${page.slug}`);
  revalidatePath("/admin/pages");
  return { ok: true, id: saved.id };
}