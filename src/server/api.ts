export type ApiSession = {
  userId: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
  tenantId?: string;
  permissions?: string[];
};

export const backendApiCapabilities = [
  "Authenticate users",
  "Authorize actions",
  "Validate requests",
  "Manage database operations",
  "Handle business rules",
  "Process payments",
  "Handle uploads",
  "Publish portfolios",
  "Track analytics",
  "Send notifications",
  "Run background jobs",
] as const;

export const backendApiStatus = {
  ok: true,
  enforced: true,
  capabilities: backendApiCapabilities,
};

export function requireAuth(session: ApiSession | null | undefined): ApiSession {
  if (!session || typeof session !== "object" || !session.userId) {
    throw new Error("Authenticated session required to access this backend resource.");
  }

  return session;
}

export function requirePermission(
  context: Pick<ApiSession, "permissions" | "isAdmin" | "role"> | null | undefined,
  permission: string,
): boolean {
  if (!context) return false;

  const permissions = context.permissions ?? [];
  return context.isAdmin === true || context.role === "admin" || permissions.includes(permission);
}

export function validateRequest<T extends Record<string, unknown>>(
  input: T | null | undefined,
  contract: Record<string, unknown>,
): T {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Request payload is required.");
  }

  for (const key of Object.keys(contract)) {
    if (!(key in input)) {
      throw new Error(`Missing required field: ${key}`);
    }
  }

  for (const [key, expected] of Object.entries(contract)) {
    if (typeof expected === "string" && key.toLowerCase().includes("email")) {
      if (!isValidEmail(expected)) {
        throw new Error(`Invalid email for ${key}.`);
      }
    }
  }

  return input;
}

export function isValidEmail(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function createApiError(message: string, status = 400) {
  return {
    ok: false,
    status,
    message,
  };
}
