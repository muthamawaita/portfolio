"use server";

import { z } from "zod";
import { createProviderCheckout } from "@/server/payments/providers";
import { requireSession } from "@/server/actions/auth";

const checkoutSchema = z.object({ provider: z.enum(["stripe", "paypal", "mpesa"]), phone: z.string().optional(), plan: z.enum(["QUARTERLY", "HALF_YEAR", "ANNUAL"]) });

export async function createCheckoutSession(input: z.input<typeof checkoutSchema>) {
  const checkout = checkoutSchema.parse(input);
  const user = await requireSession();
  if (!user) return { ok: false as const, message: "Please sign in before starting payment." };
  return createProviderCheckout({ ...checkout, email: user.email, tenantSlug: user.tenant.slug, tenantId: user.tenantId });
}
