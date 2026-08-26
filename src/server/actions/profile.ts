"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import { requireSession } from "@/server/actions/auth";
import { getPortfolioPublishingMessage, isPortfolioPublishingAllowed } from "@/server/portfolio-access";

const templateIds = ["editorial", "developer", "analyst", "designer", "minimal", "bold"] as const;

const schema = z.object({
  name: z.string().min(2),
  headline: z.string().min(2),
  bio: z.string().min(20),
  careerBackground: z.string().min(10).optional(),
  specializations: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([]),
  values: z.array(z.string()).default([]),
  photoUrl: z.string().url().or(z.literal("")),
  cvUrl: z.string().url().or(z.literal("")).optional(),
  template: z.enum(templateIds).default("editorial"),
});

export async function updateProfile(input: z.input<typeof schema>) {
  const user = await requireSession();
  if (!user) return { ok: false, message: "Sign in to update your profile." };

  const profile = schema.parse(input);

  const templateContent = {
    name: profile.name,
    headline: profile.headline,
    bio: profile.bio,
    photoUrl: profile.photoUrl,
    template: profile.template,
    templateKey: profile.template,
    careerBackground: profile.careerBackground ?? "",
    specializations: profile.specializations,
    interests: profile.interests,
    technologies: profile.technologies,
    objectives: profile.objectives,
    values: profile.values,
    sectionSummary: {
      hero: profile.headline,
      overview: profile.bio,
      focus: profile.specializations[0] ?? "Professional portfolio",
    },
  };

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { name: profile.name },
    }),
    db.sitePage.upsert({
      where: { tenantId_slug: { tenantId: user.tenantId, slug: "home" } },
      update: { title: "Home", content: templateContent, status: "DRAFT" },
      create: { tenantId: user.tenantId, title: "Home", slug: "home", content: templateContent, status: "DRAFT" },
    }),
  ]);

  revalidatePath(`/p/${user.tenant.slug}`);
  return { ok: true, message: "Draft saved. Publish when you are ready." };
}

export async function publishPortfolio() {
  const user = await requireSession();
  if (!user) return { ok: false, message: "Sign in first." };

  const tenant = await db.tenant.findUnique({
    where: { id: user.tenantId },
    include: { subscription: true },
  });

  const allowed = isPortfolioPublishingAllowed({
    plan: tenant?.plan ?? "FREE",
    subscriptionStatus: tenant?.subscription?.status ?? "INACTIVE",
  });

  if (!allowed) {
    return {
      ok: false,
      message: getPortfolioPublishingMessage({
        plan: tenant?.plan ?? "FREE",
        subscriptionStatus: tenant?.subscription?.status ?? "INACTIVE",
      }),
    };
  }

  await db.sitePage.update({
    where: { tenantId_slug: { tenantId: user.tenantId, slug: "home" } },
    data: { status: "PUBLISHED" },
  });

  revalidatePath(`/p/${user.tenant.slug}`);
  return { ok: true, message: "Portfolio published and ready to share." };
}

