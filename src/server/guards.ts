export type GuardContext = {
  isAuthenticated?: boolean;
  user?: {
    id?: string;
    roles?: string[];
    permissions?: string[];
  } | null;
  request?: {
    headers?: Headers | Record<string, string | undefined>;
    ip?: string;
  };
};

const rateLimitBuckets = new Map<string, number[]>();

export function authGuard(context: GuardContext | null | undefined): boolean {
  return Boolean(context?.isAuthenticated && context.user?.id);
}

export function roleGuard(context: GuardContext | null | undefined, role: string): boolean {
  return Boolean(context?.user?.roles?.includes(role));
}

export function permissionGuard(
  context: GuardContext | null | undefined,
  permission: string,
): boolean {
  return Boolean(context?.user?.permissions?.includes(permission));
}

export function throttlingGuard(
  context: GuardContext | null | undefined,
  options?: { maxRequests?: number; windowMs?: number; key?: string },
): boolean {
  const maxRequests = options?.maxRequests ?? 60;
  const windowMs = options?.windowMs ?? 60_000;
  const key = options?.key ?? context?.request?.ip ?? "global";
  const now = Date.now();
  const requests = rateLimitBuckets.get(key) ?? [];
  const recent = requests.filter((timestamp) => now - timestamp < windowMs);

  if (recent.length >= maxRequests) {
    rateLimitBuckets.set(key, recent);
    return false;
  }

  recent.push(now);
  rateLimitBuckets.set(key, recent);
  return true;
}

export function createRouteGuardResult(ok: boolean, reason?: string) {
  return {
    ok,
    reason: reason ?? (ok ? "allowed" : "blocked"),
  };
}
