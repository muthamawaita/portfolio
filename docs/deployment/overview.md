# Deployment overview

## Runtime responsibilities

- Public web application: serve the portfolio website and top-level marketing pages.
- Dashboard and admin applications: authenticated tenant-facing workspaces.
- API layer: business logic, RBAC enforcement, payment callback processing, and file operations.
- Database: permanent system data in MySQL, with Prisma managing schema and migrations.
- Redis: caching, queues, and rate-limit state.
- Object storage: maintain uploaded files outside the application codebase.

## Deployment model

- Use Docker images per runtime component.
- Route public traffic through NGINX or a cloud edge gateway.
- Maintain separate environment configuration for local, staging, and production.
- Keep secrets in environment-based configuration rather than code or browser bundles.

## Operational checks

- Run health checks for API, database, Redis, storage, and queue connectivity.
- Monitor response time, database health, queue delays, and upload failures.
- Schedule migration, backup, and restore processes to avoid service interruption.
