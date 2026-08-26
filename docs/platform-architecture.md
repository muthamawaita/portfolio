# Portfolio platform architecture

## Public website

- `/` — platform homepage
- `/about`, `/skills`, `/projects`, `/experience`, `/education`, `/certifications`
- `/services`, `/services/[slug]`, `/portfolio`, `/blog`, `/contact`, `/hire-me`, `/pricing`

## Portfolio builder

- Account flow: `/signup`, `/client-login`, `/activate`, `/forgot-password`, `/reset-password`
- Builder landing: `/studio`
- Authenticated workspace: `/admin` (existing editor modules for profile, projects, pages, resume, media, settings, users, and audit log)
- Public portfolio URL: `/u/[username]`; the existing tenant-aware `/p/[slug]` URL remains supported during migration.

## Marketplace and orders

The marketplace model starts at `/services` and service details use `/services/[slug]`. The existing payment provider and webhook layer remains the integration point for checkout. Order assignment, delivery, revisions, messages, and reviews are the next database-backed marketplace modules; they should be built as state transitions rather than as independent page flags.

## Platform administration and RBAC

Use roles rather than route-specific checks:

- Visitor, Registered User, Customer
- Freelancer/Staff, Support Agent, Content Manager, Finance Admin
- Admin, Super Admin

Permissions should be capability strings such as `users.view`, `portfolios.suspend`, `orders.assign`, `payments.view`, and `reports.view`. The route proxy only performs an optimistic session redirect; layouts and server actions must make the authoritative permission decision.

This separates the portfolio owner workspace from future platform operations screens for users, orders, payments, reports, system configuration, and audit logs.
