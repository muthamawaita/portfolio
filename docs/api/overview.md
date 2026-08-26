# API overview

The API layer owns business-state transitions such as authentication, portfolio publishing, order creation, payment confirmation, and permission enforcement.

## Responsibilities

- Validate and sanitize request input.
- Enforce authentication and authorization.
- Coordinate database access through Prisma and service contracts.
- Publish events for notifications, analytics, and queue jobs.
- Keep gateway verification on the server side.

## Guardrails

- Never trust the browser to decide payment success.
- Never determine admin access from the frontend menu alone.
- Keep storage provider details behind the abstraction layer.
