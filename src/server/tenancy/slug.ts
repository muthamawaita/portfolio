export function toTenantSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "portfolio";
}

export function portfolioUrl(slug: string, baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000") {
  return `${baseUrl.replace(/\/$/, "")}/p/${slug}`;
}