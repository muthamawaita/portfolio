"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { db } from "@/server/db";
import { sendPasswordResetEmail } from "@/server/email/activation-mailer";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const resetRequestSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({ token: z.string().min(32), password: z.string().min(8) });

export async function signIn(input: z.input<typeof loginSchema>) {
  if (!process.env.DATABASE_URL) return { ok: false, message: "Database setup is required before client sign-in can be used." };

  const credentials = loginSchema.parse(input);
  const lowerEmail = credentials.email.toLowerCase();
  const configuredAdmin = getConfiguredAdminCredentials();

  if (configuredAdmin && (await isConfiguredAdminCredentials(lowerEmail, credentials.password))) {
    let user = await db.user.findUnique({ where: { email: configuredAdmin.email.toLowerCase() }, include: { tenant: true } });

    if (!user) {
      const tenant = await db.tenant.create({
        data: {
          name: "JMW Studios Admin",
          slug: "jmw-studios-admin",
          plan: "PROFESSIONAL",
          branding: { create: {} },
          subscription: { create: { plan: "PROFESSIONAL", status: "ACTIVE" } },
          users: {
            create: {
              name: "Administrator",
              email: configuredAdmin.email.toLowerCase(),
              passwordHash: hashPassword(configuredAdmin.password),
              role: "ADMIN",
            },
          },
        },
        include: { users: true },
      });
      const createdAdmin = tenant.users[0];
      if (createdAdmin) {
        user = { ...createdAdmin, tenant } as NonNullable<typeof user>;
      }
    }

    if (!user) return { ok: false, message: "Unable to load the administrator account." };

    const token = randomBytes(32).toString("hex");
    await db.user.update({ where: { id: user.id }, data: { sessionToken: token, sessionExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } });
    (await cookies()).set("portfolio_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
    redirect("/admin");
  }

  const user = await db.user.findUnique({ where: { email: lowerEmail } });
  if (!user?.passwordHash || !verifyPassword(credentials.password, user.passwordHash)) return { ok: false, message: "Email or password is incorrect." };

  const needsOnboarding = await shouldRedirectToPortfolioOnboarding(user.id, user.tenantId);
  const token = randomBytes(32).toString("hex");
  await db.user.update({ where: { id: user.id }, data: { sessionToken: token, sessionExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } });
  (await cookies()).set("portfolio_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });

  if (isAdminRole(user.role)) redirect("/admin");
  if (isStaffRole(user.role)) redirect("/staff");
  redirect(await resolveUserPostLoginRoute(user.role, needsOnboarding));
}

async function shouldRedirectToPortfolioOnboarding(userId: string, tenantId: string) {
  const page = await db.sitePage.findUnique({
    where: { tenantId_slug: { tenantId, slug: "home" } },
  });

  if (!page) return true;

  const content = page.content as Record<string, unknown> | null;
  const headline = String(content?.headline ?? "");
  const bio = String(content?.bio ?? "");

  return headline === "Your professional headline" || bio.includes("Use this space");
}

export async function signOut() {
  const token = (await cookies()).get("portfolio_session")?.value;
  if (token && process.env.DATABASE_URL) await db.user.updateMany({ where: { sessionToken: token }, data: { sessionToken: null, sessionExpires: null } });
  (await cookies()).delete("portfolio_session");
  redirect("/login");
}

export async function requireSession() {
  const token = (await cookies()).get("portfolio_session")?.value;
  if (!token || !process.env.DATABASE_URL) return null;
  return db.user.findFirst({ where: { sessionToken: token, sessionExpires: { gt: new Date() } }, include: { tenant: true } });
}

export async function requireAdminSession() {
  const user = await requireSession();
  if (!user || !isAdminRole(user.role)) return null;

  const configuredAdmin = getConfiguredAdminCredentials();
  if (!configuredAdmin) return user;
  return user.email.toLowerCase() === configuredAdmin.email.toLowerCase() ? user : null;
}

export async function isConfiguredAdminCredentials(email: string, password: string) {
  const configuredAdmin = getConfiguredAdminCredentials();
  return Boolean(configuredAdmin && email.toLowerCase() === configuredAdmin.email.toLowerCase() && password === configuredAdmin.password);
}

export async function resolveUserPostLoginRoute(role: string, needsOnboarding: boolean) {
  if (isAdminRole(role)) return "/admin";
  if (isStaffRole(role)) return "/staff";
  if (needsOnboarding) return "/dashboard/onboarding";
  return "/dashboard";
}

function getConfiguredAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!email || !password) return null;
  return { email, password };
}

function isAdminRole(role: string) {
  return ["ADMIN", "SUPER_ADMIN", "OWNER"].includes(role);
}

function isStaffRole(role: string) {
  return ["STAFF", "SUPPORT", "CONTENT_MANAGER", "TEMPLATE_MANAGER"].includes(role);
}

export async function requestPasswordReset(input: z.input<typeof resetRequestSchema>) {
  const { email } = resetRequestSchema.parse(input);
  if (!process.env.DATABASE_URL) return { ok: false, message: "Database setup is required." };
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { ok: true, message: "If that email has an account, a reset link has been sent." };
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return { ok: false, message: "Password reset email is not configured yet." };
  const token = randomBytes(32).toString("hex");
  await db.user.update({ where: { id: user.id }, data: { passwordResetToken: token, passwordResetExpires: new Date(Date.now() + 1000 * 60 * 60) } });
  try { await sendPasswordResetEmail({ email: user.email, name: user.name ?? "there", token }); }
  catch { await db.user.update({ where: { id: user.id }, data: { passwordResetToken: null, passwordResetExpires: null } }); return { ok: false, message: "We could not send the reset email. Please try again." }; }
  return { ok: true, message: "If that email has an account, a reset link has been sent." };
}

export async function resetPassword(input: z.input<typeof resetPasswordSchema>) {
  const { token, password } = resetPasswordSchema.parse(input);
  const user = await db.user.findUnique({ where: { passwordResetToken: token } });
  if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) return { ok: false, message: "This reset link is invalid or has expired. Request a new one." };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(password), passwordResetToken: null, passwordResetExpires: null, sessionToken: null, sessionExpires: null } });
  return { ok: true, message: "Password updated. You can now sign in." };
}

function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(":"); if (!salt || !hash) return false; const derived = scryptSync(password, salt, 64); return timingSafeEqual(derived, Buffer.from(hash, "hex")); }
