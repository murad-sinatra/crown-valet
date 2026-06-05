# MVP Technical Stack Detail

## Purpose

This document defines the concrete technical stack for the Crown Valet MVP. It expands `docs/mvp/technical-stack.md` into implementation choices for the existing Nuxt 3 codebase.

The MVP should stay simple and containerized: one Nuxt application, server routes for backend behavior, PostgreSQL for durable data, Prisma for schema and migrations, secure ticket tokens for customers, and staff authentication for operational screens. All application services must run through Docker containers.

## Current Repo Baseline

The repository currently contains a Nuxt 3 landing page.

Already present:

- Runtime: Node.js `>=20.19.0`
- Framework: Nuxt `^3.17.7`
- Config: `nuxt.config.ts`
- Package manager: npm, based on `package-lock.json`
- App mode: single Nuxt app with frontend pages and future server routes

To be added during MVP development:

- TypeScript app/domain modules
- Dockerfile and Docker Compose configuration
- Prisma
- PostgreSQL connection
- Staff authentication
- Server-side validation
- Tests
- Notification provider abstraction
- Deployment environment configuration

## Stack Summary

| Area | MVP Choice | Notes |
| --- | --- | --- |
| Application framework | Nuxt 3 | Existing app foundation |
| UI framework | Vue 3 through Nuxt | Use Vue single-file components |
| Language | TypeScript | Keep domain, server, and UI code typed |
| Package manager | npm | Repo already has `package-lock.json` |
| Runtime | Node.js `>=20.19.0` | Match `package.json` engines |
| Container runtime | Docker | Required for local, test, staging, and pilot runs |
| Local orchestration | Docker Compose | App, database, and supporting tools run as services |
| Backend | Nuxt server routes / Nitro | Enough for MVP API endpoints |
| Database | PostgreSQL | Transactional valet/session data |
| ORM and migrations | Prisma | Schema, migrations, typed database access |
| Authentication | Staff auth in Nuxt server layer | Customer accounts deferred |
| Customer access | Secure public ticket tokens | Token grants access to one session |
| Notifications | Mock provider first, SMS provider for pilot | Twilio is the default SMS candidate |
| Email | Optional, deferred unless needed | Resend is the default email candidate |
| File storage | Deferred | Photos and documents are not MVP blockers |
| Hosting | Docker-capable app host plus managed PostgreSQL | Use the same app image pattern across environments |
| Testing | Vitest plus browser/e2e tooling when needed | Add focused tests before broad coverage |
| Observability | Platform logs plus notification logs | Sentry can be added after core loop |

## Containerization Requirement

Docker is required for all MVP development and runtime workflows.

The project should provide:

- `Dockerfile` for the Nuxt application.
- `docker-compose.yml` for local development.
- `.dockerignore` to keep images small and avoid leaking local files.
- Containerized PostgreSQL for local development and tests.
- Containerized commands for Prisma migrations, seeding, tests, and Nuxt development.
- Environment variables loaded into containers instead of relying on host machine state.

Required local services:

- `app`: Nuxt development server and server routes.
- `db`: PostgreSQL database.
- Optional `test`: isolated runner for unit, API, and e2e test commands when useful.

Local development should start from Docker Compose. Developers should not need a host-installed PostgreSQL server or host-running Nuxt process.

Recommended command pattern:

```sh
docker compose up app db
docker compose exec app npm run db:migrate
docker compose exec app npm run db:seed
docker compose exec app npm run test
```

Production and pilot deployments should use a built container image for the Nuxt application. Managed PostgreSQL is acceptable for deployed environments, but the app runtime itself should remain containerized.

## Frontend Stack

### Nuxt 3

Use Nuxt as the single application for:

- Landing page
- Customer digital ticket
- Staff check-in
- Staff active sessions
- Staff pickup queue
- Staff session detail
- Manager dashboard

Use Nuxt pages and layouts for product surfaces:

- `pages/index.vue`
- `pages/ticket/[token].vue`
- `pages/staff/index.vue`
- `pages/staff/check-in.vue`
- `pages/staff/sessions/[id].vue`
- `pages/staff/pickup-queue.vue`
- `pages/dashboard/index.vue`

### Vue Components

Use Vue single-file components for reusable UI.

Initial component set:

- `BaseButton`
- `BaseCard`
- `StatusBadge`
- `MetricCard`
- `SessionTimeline`
- `VehicleSummaryCard`
- `PickupQueueItem`
- `FormField`
- `PageHeader`
- `EmptyState`
- `ErrorState`

Keep components local and practical at first. Extract shared components when the same pattern appears across ticket, staff, and dashboard screens.

### Styling

Use the existing app styling direction and the design tokens from `docs/product/design-system.md`.

MVP styling rules:

- Keep mobile-first layouts for customer and staff screens.
- Use large touch targets for staff workflows.
- Use status labels in addition to color.
- Keep customer ticket screens calm and premium.
- Keep staff screens action-first and readable outdoors.

Do not introduce a large UI framework in the MVP unless the app starts repeating complex primitives that would clearly benefit from one.

## Backend Stack

### Nuxt Server Routes

Use Nuxt server routes for MVP API behavior.

Planned server route groups:

- `/api/staff/sessions`
- `/api/staff/sessions/[id]`
- `/api/staff/pickup-requests`
- `/api/tickets/[token]`
- `/api/tickets/[token]/pickup-request`
- `/api/dashboard/overview`
- `/api/notifications`

Server routes are responsible for:

- Authentication and role checks
- Request validation
- Status transition validation
- Database writes
- Session event creation
- Notification dispatch or mock logging
- Customer-safe response shaping

### Domain Modules

Create shared domain modules for behavior that should not live directly inside page components or individual API handlers.

Recommended modules:

- `server/domain/status.ts`
- `server/domain/tickets.ts`
- `server/domain/session-events.ts`
- `server/domain/pickup-requests.ts`
- `server/domain/notifications.ts`
- `server/utils/auth.ts`
- `server/utils/db.ts`

Shared client-safe constants can live outside `server/` when the UI needs them.

Recommended shared modules:

- `shared/status.ts`
- `shared/status-labels.ts`

## Data Stack

### PostgreSQL

Use PostgreSQL for MVP data because valet sessions, vehicles, pickup requests, ticket tokens, events, staff users, and dashboard metrics are relational and timestamp-heavy.

Preferred local setup:

- PostgreSQL through Docker Compose

Preferred deployed setup:

- Managed PostgreSQL through Neon, Supabase, or another production-ready PostgreSQL provider
- Containerized PostgreSQL only if the hosting environment provides reliable backups, monitoring, and persistence

### Prisma

Use Prisma for:

- Data model definition
- Migrations
- Typed database access
- Seed data

Expected additions:

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `server/utils/db.ts`
- npm scripts for migration and seeding

Recommended scripts:

```json
{
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:deploy": "prisma migrate deploy",
  "db:seed": "prisma db seed",
  "db:studio": "prisma studio"
}
```

### MVP Tables

Implement the schema from `docs/mvp/data-schema.md`:

- `venues`
- `staff_users`
- `customer_contacts`
- `vehicles`
- `valet_sessions`
- `ticket_tokens`
- `parking_locations`
- `pickup_requests`
- `session_events`
- `notification_logs`

Do not add payment, service job, support case, photo, or customer account tables until they are needed.

## Authentication and Access

### Staff and Manager Auth

The MVP needs staff and manager authentication only.

Recommended approach:

- Start with simple email/password or pilot credential authentication.
- Store secure password hashes if passwords are used.
- Use signed HTTP-only cookies for sessions.
- Scope staff users to a venue.
- Require manager role for `/dashboard`.

Possible dependency options:

- Minimal custom auth using Nuxt server routes, secure cookies, and password hashing.
- Nuxt Auth Utils if it fits the implementation cleanly.

Choose the smallest approach that protects staff routes reliably during the pilot.

### Customer Ticket Access

Customers do not have accounts in the MVP.

Use secure ticket tokens:

- Generate long random tokens.
- Store only token hashes in the database.
- Never expose internal session IDs in public URLs.
- Allow token revocation.
- Support expiration where useful.
- Shape ticket responses so only customer-safe fields are returned.

## Validation and Business Rules

Use server-side validation for every write operation.

Validation should cover:

- Required check-in fields
- Phone and email shape
- Ticket token state
- Staff role and venue access
- Allowed valet session status transitions
- Allowed pickup request status transitions
- Duplicate active pickup request prevention
- Customer-safe visibility rules

Recommended validation library:

- Zod, if a dependency is needed for shared schemas and server validation

Avoid relying only on client-side validation.

## Notifications

### MVP Notification Strategy

Start with a provider interface and local mock implementation.

The mock provider should:

- Avoid external credentials in local development.
- Record notification attempts in `notification_logs`.
- Make failures testable.
- Let staff and managers see failed attempts later.

### Pilot SMS Provider

Default SMS candidate:

- Twilio

SMS events:

- Ticket link sent
- Pickup request confirmation
- Vehicle ready alert

### Optional Email Provider

Email is optional for MVP.

Default email candidate if needed:

- Resend

Push notifications are deferred until native app or PWA work begins.

## Hosting and Environments

### Environments

Use three environment types:

- Local development
- Staging or pilot test
- Production pilot

### Hosting

Recommended app hosting:

- A Docker-capable platform such as Fly.io, Render, Railway, DigitalOcean App Platform, AWS ECS, or another container host

Recommended database hosting:

- Neon, or
- Supabase

Rationale:

- Keeps the Nuxt runtime consistent between local, staging, and pilot environments.
- Preserves a single container build artifact.
- Managed PostgreSQL reduces operational burden.
- Good enough for a controlled pilot.

## Environment Variables

Expected variables:

- `DATABASE_URL`
- `APP_BASE_URL`
- `NUXT_APP_BASE_URL`
- `STAFF_AUTH_SECRET`
- `TICKET_TOKEN_SECRET`
- `SMS_PROVIDER`
- `SMS_PROVIDER_API_KEY`
- `SMS_FROM_NUMBER`
- `EMAIL_PROVIDER`
- `EMAIL_PROVIDER_API_KEY`

Local development should load these values through Docker Compose. SMS and email provider variables may be absent locally when the mock notification provider is enabled.

## Testing Stack

### Unit and Domain Tests

Recommended:

- Vitest

Test first around:

- Status transition rules
- Ticket token creation and lookup
- Customer-safe response shaping
- Pickup request creation rules
- Session event creation

### API Tests

Add tests for write flows once the Nuxt server routes exist:

- Create valet session
- Add parking location
- Request pickup
- Move pickup through retrieving, ready, and completed
- Reject invalid transitions
- Reject duplicate active pickup requests

### End-to-End Tests

Recommended when the core loop is implemented:

- Playwright

Primary e2e scenario:

1. Staff logs in.
2. Staff creates a session.
3. Customer ticket opens.
4. Staff marks vehicle parked.
5. Customer requests pickup.
6. Staff processes pickup queue.
7. Staff marks ready.
8. Staff completes handoff.
9. Dashboard reflects the result.

## Observability and Logs

MVP observability should stay lightweight.

Required:

- App/platform logs from hosting provider
- Database migration history
- Notification logs in `notification_logs`
- Session events in `session_events`

Recommended after the core loop works:

- Sentry for error tracking
- Structured request logs for production pilot debugging

Do not add a full analytics warehouse for the MVP.

## Security Baseline

MVP security requirements:

- Staff routes require authentication.
- Manager dashboard requires manager role.
- Ticket token grants access only to one session.
- Ticket route does not expose internal IDs.
- Staff notes never appear on customer ticket pages.
- Exact internal parking location stays staff-only unless intentionally made customer-safe.
- Status changes are validated server-side.
- Every session write creates a session event.
- Raw payment details are never stored.
- Secrets stay in environment variables.

## Deferred Technology

Do not add these until after MVP validation:

- Native iOS app
- Native Android app
- Push notification infrastructure
- Payment provider integration
- Partner API integrations
- Object storage for photos
- Advanced analytics warehouse
- Data aggregation jobs
- Enterprise SSO
- Multi-tenant admin platform
- Real-time GPS tracking
- Microservice split

## Sprint Mapping

### Sprint 1

Add Dockerfile, Docker Compose, Nuxt route shells, Prisma, PostgreSQL, seed data, shared status constants, protected staff layout, and environment documentation.

### Sprint 2

Use Prisma and server routes to create valet sessions, ticket tokens, customer contacts, vehicles, and first session events.

### Sprint 3

Use public token lookup and customer-safe response shaping for `/ticket/[token]`.

### Sprint 4

Use status transition helpers, pickup request records, parking locations, and event creation to complete the operational loop.

### Sprint 5

Add notification provider abstraction, mock provider, optional Twilio integration, and notification logs.

### Sprint 6

Build dashboard queries from real PostgreSQL data and session events.

### Sprint 7

Add tests, error states, mobile QA, accessibility checks, and pilot readiness validation.

## Open Decisions Before Sprint 1

Confirm these before implementation begins:

- Docker Compose service names, ports, volumes, and local environment file conventions are accepted.
- Staff auth will be minimal custom auth or Nuxt Auth Utils.
- SMS provider will be mocked only at first or Twilio-ready during Sprint 5.
- Deployment target will support a containerized Nuxt app image plus managed PostgreSQL.

Once these are confirmed, development can start with Sprint 1 from `docs/technical/mvp-development-sprints.md`.
