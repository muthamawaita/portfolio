# Architecture

## Product boundaries

- Public portfolio: SEO-friendly, content-driven pages for each tenant.
- Admin CMS: authenticated editing workspace with role-aware actions.
- Tenant layer: resolves a portfolio by account, subdomain, or custom domain.
- Content modules: profile, projects, teaching, resources, certificates, CV, and site settings.
- Infrastructure adapters: database, storage, email, authentication, and audit logging.

## Commercialization path

Keep tenant data isolated by `tenantId`. Add subscriptions, custom domains, branding presets, and onboarding under `src/features/billing`, `src/features/domains`, and `src/features/onboarding` when the first multi-client release is ready.