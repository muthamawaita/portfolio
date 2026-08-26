"use server";

import { randomBytes, scryptSync } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/server/db";
import { toTenantSlug } from "@/server/tenancy/slug";

const accountSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
type AccountResult = { ok: true; tenantSlug: string } | { ok: false; message: string };
function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }

export async function createAccount(input: z.input<typeof accountSchema>): Promise<AccountResult> {
  if (!process.env.DATABASE_URL) return { ok: false, message: "Database setup is required. Copy .env.example to .env.local, add DATABASE_URL, then restart the server." };
  const account = accountSchema.parse(input); const email = account.email.toLowerCase();
  if (await db.user.findUnique({ where: { email } })) return { ok: false, message: "An account with this email already exists. Please sign in instead." };
  const tenantSlug = `${toTenantSlug(account.name)}-${randomBytes(2).toString("hex")}`; const sessionToken = randomBytes(32).toString("hex");
  const tenant = await db.tenant.create({ data: { name: `${account.name}'s Portfolio`, slug: tenantSlug, plan: "FREE", branding: { create: {} }, subscription: { create: { plan: "FREE", status: "INACTIVE" } }, pages: { create: { title: "Home", slug: "home", status: "DRAFT", content: { name: account.name, headline: "Your professional headline", bio: "Use this space to introduce the value you bring, the work you care about, and the opportunities you are looking for.", photoUrl: "", template: "editorial" } } }, users: { create: { name: account.name, email, passwordHash: hashPassword(account.password), sessionToken, sessionExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), role: "CUSTOMER" } } } });
  (await cookies()).set("portfolio_session", sessionToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return { ok: true, tenantSlug: tenant.slug };
}
