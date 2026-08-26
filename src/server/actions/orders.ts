"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { requireSession } from "@/server/actions/auth";

const portfolioOrderSchema = z.object({
  fullName: z.string().trim().min(2, "Please add your full name."),
  email: z.string().trim().email("Please add a valid email address."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  industry: z.string().trim().min(2, "Please tell us your industry or field."),
  portfolioGoals: z.string().trim().min(10, "Please describe the main goal for your portfolio."),
  timeline: z.string().trim().min(2, "Please choose a realistic timeline."),
  budget: z.string().trim().min(2, "Please provide your budget range."),
  notes: z.string().trim().min(10, "Please add a few notes for the admin." ).optional().or(z.literal("")),
});

export async function createPortfolioOrder(input: z.input<typeof portfolioOrderSchema>) {
  const user = await requireSession();
  if (!user) return { ok: false, message: "Sign in to place a professional portfolio order." };

  const data = portfolioOrderSchema.parse(input);

  const message = [
    `Portfolio order for: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Industry: ${data.industry}`,
    `Goals: ${data.portfolioGoals}`,
    `Timeline: ${data.timeline}`,
    `Budget: ${data.budget}`,
    `Notes: ${data.notes || "No extra notes provided"}`,
  ].join("\n\n");

  await db.contactLead.create({
    data: {
      name: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      subject: "Professional Portfolio Order",
      service: "Portfolio build and strategy",
      message,
      status: "NEW",
    },
  });

  return {
    ok: true,
    message: "Your portfolio order has been sent to the admin. They will reply with the next steps and discuss your requirements.",
  };
}
