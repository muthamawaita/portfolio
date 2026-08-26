"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import { requireSession } from "@/server/actions/auth";

const onboardingActionSchema = z.object({
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
  location: z.string().min(2).optional().or(z.literal("")),
  profileImageUrl: z.string().url().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  firstProjectTitle: z.string().min(1).optional().or(z.literal("")),
  firstProjectDescription: z.string().min(1).optional().or(z.literal("")),
});

export async function saveOnboarding(input: z.input<typeof onboardingActionSchema>) {
  const user = await requireSession();
  if (!user) return { ok: false, message: "Please sign in to continue onboarding." };

  const onboarding = onboardingActionSchema.parse(input);

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { name: onboarding.name },
    }),
    db.sitePage.upsert({
      where: { tenantId_slug: { tenantId: user.tenantId, slug: "home" } },
      update: {
        title: "Home",
        content: {
          name: onboarding.name,
          headline: onboarding.professionalTitle,
          bio: onboarding.bio,
          photoUrl: onboarding.profileImageUrl,
          template: onboarding.template,
          specializations: onboarding.skills,
          interests: [onboarding.purpose],
          location: onboarding.location || "",
          purpose: onboarding.purpose,
        },
        status: "DRAFT",
      },
      create: {
        tenantId: user.tenantId,
        title: "Home",
        slug: "home",
        content: {
          name: onboarding.name,
          headline: onboarding.professionalTitle,
          bio: onboarding.bio,
          photoUrl: onboarding.profileImageUrl,
          template: onboarding.template,
          specializations: onboarding.skills,
          interests: [onboarding.purpose],
          location: onboarding.location || "",
          purpose: onboarding.purpose,
        },
        status: "DRAFT",
      },
    }),
  ]);

  if (onboarding.firstProjectTitle && onboarding.firstProjectTitle.trim()) {
    await db.project.create({
      data: {
        tenantId: user.tenantId,
        title: onboarding.firstProjectTitle,
        slug: onboarding.firstProjectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-first-project",
        summary: onboarding.firstProjectDescription || onboarding.bio,
        content: {
          description: onboarding.firstProjectDescription || onboarding.bio,
          status: "DRAFT",
        },
        status: "DRAFT",
      },
    });
  }

  revalidatePath(`/p/${user.tenant.slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-portfolio");
  return { ok: true, message: "Your onboarding details have been saved." };
}
