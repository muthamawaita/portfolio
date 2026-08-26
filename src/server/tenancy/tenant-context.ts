export type TenantContext = { tenantId: string; host: string; };

export function resolveTenant(host: string): TenantContext { return { tenantId: "default", host }; }