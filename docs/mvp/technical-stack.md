# MVP Technical Stack

## Stack Decision

Use the existing Nuxt 3 project as the MVP application foundation. The first version should be a web-based product with mobile-optimized screens for customers, staff, and managers.

All MVP development and runtime workflows must run through Docker containers. Local development should use Docker Compose for the Nuxt app, PostgreSQL, Prisma commands, seeds, and tests.

This approach keeps the pilot build small while preserving a path to split into dedicated backend services and native mobile apps later.

## Recommended MVP Stack

### Frontend

- Nuxt 3
- Vue components
- Server-rendered or hybrid pages where useful
- Mobile-first responsive layouts

Use Nuxt for:

- Landing page
- Customer digital ticket
- Staff check-in interface
- Pickup queue
- Venue operations dashboard

### Backend

- Nuxt server routes for MVP API endpoints
- Server-side validation for all write operations
- Shared status transition helpers
- Event creation on every important state change
- Containerized Nuxt/Nitro runtime

This is enough for the MVP. A separate API service can be introduced later if integrations, native apps, or scaling needs justify it.

### Containers

Required for MVP:

- Dockerfile for the Nuxt application
- Docker Compose for local app and database services
- Containerized PostgreSQL for local development and tests
- Containerized Prisma migration and seed commands
- Containerized test commands
- Environment variables passed into containers

Developers should not need to run PostgreSQL, Nuxt, migrations, seeds, or tests directly on the host machine.

### Database

Use a relational database for MVP data.

Recommended option:

- PostgreSQL

Why:

- Strong fit for sessions, vehicles, staff, tickets, events, and reporting.
- Easy to model relationships.
- Reliable for audit-style event records.
- Works well with future payments and service marketplace data.

### ORM and Migrations

Recommended option:

- Prisma

Why:

- Clear schema definition.
- Type-safe database access.
- Good migration workflow.
- Fits TypeScript and Nuxt development.

### Authentication

MVP recommendation:

- Staff and manager authentication only.
- Customer ticket access through secure public token.

Staff auth options:

- Simple email/password for first internal testing.
- Magic link or one-time code for pilot if SMS/email provider is ready.

Customer auth:

- No customer account in MVP.
- Ticket token grants access to one active session.
- Token should be long, random, unguessable, and revocable.

### Notifications

MVP recommendation:

- SMS first for ticket delivery and ready alerts.
- Email optional.
- Push notifications deferred until native app or PWA work begins.

Provider options:

- Twilio for SMS
- Resend or SendGrid for email

Notification events:

- Ticket created
- Pickup requested confirmation
- Vehicle ready

### Hosting

Recommended MVP options:

- Docker-capable hosting for the Nuxt application container
- Supabase, Neon, or managed PostgreSQL for database

Why:

- Same app runtime model from local development through pilot deployment.
- Good developer experience through Docker Compose.
- Enough for a pilot.
- Easy environment variable management.

### File Storage

Defer photo upload for MVP unless required by the pilot venue.

If needed:

- Use S3-compatible object storage.
- Store only URLs and metadata in the database.

### Observability

Minimum MVP needs:

- Application error logs
- Database migration history
- Notification delivery logs
- Basic request logging for operational debugging

Future:

- Structured logging
- Error tracking
- Performance monitoring
- Analytics warehouse

## Environment Configuration

Expected environments:

- Local development
- Staging or pilot test
- Production pilot

Each environment should run the app as a container. Local development should use Docker Compose. Staging and production pilot should use a built application image.

Key environment variables:

- DATABASE_URL
- APP_BASE_URL
- STAFF_AUTH_SECRET
- TICKET_TOKEN_SECRET if token signing is used
- SMS_PROVIDER_API_KEY
- SMS_FROM_NUMBER
- EMAIL_PROVIDER_API_KEY if email is enabled

## MVP Route Groups

Suggested Nuxt route organization:

- `/` for landing page
- `/ticket/[token]` for customer digital ticket
- `/staff` for active sessions
- `/staff/check-in` for new valet session
- `/staff/sessions/[id]` for vehicle detail
- `/staff/pickup-queue` for queue processing
- `/dashboard` for venue manager overview

Suggested server route organization:

- `/api/staff/sessions`
- `/api/staff/sessions/[id]`
- `/api/staff/pickup-requests`
- `/api/tickets/[token]`
- `/api/tickets/[token]/pickup-request`
- `/api/dashboard/overview`
- `/api/notifications`

## Security Rules

- Staff routes require authentication.
- Manager dashboard requires manager role.
- Customer ticket route uses token access only.
- Ticket token should not expose internal database IDs.
- Staff notes should never appear on customer ticket pages.
- Status changes should be validated server-side.
- Every session write should create a session event.

## Deferred Technical Work

- Native mobile app architecture
- Push notification setup
- Payment provider integration
- Partner API integrations
- Advanced analytics stack
- Enterprise multi-tenant controls
- Real-time GPS tracking
