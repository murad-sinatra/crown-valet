# Feature Development Plan

## Purpose

This plan turns the Crown Valet product documentation into an implementation path for the existing Nuxt 3 codebase. It starts from the current landing page and grows the product into a pilot-ready valet operations platform without losing the simple MVP focus defined in `docs/mvp/`.

## Development Principles

- Build the core valet workflow before payments, marketplace services, or native apps.
- Keep the first product web-based in Nuxt 3 with mobile-first customer, staff, and manager screens.
- Run development, database, migrations, seeds, tests, and pilot runtime through Docker containers.
- Record every operational status change as an event so support, reporting, and audit workflows have a trustworthy source.
- Make venue configuration part of the foundation instead of hard-coding pilot assumptions into UI flows.
- Preserve the premium hospitality tone from the landing page while prioritizing speed for curbside staff workflows.

## Product Surfaces

### Public Marketing Site

The existing landing page remains the front door for stakeholders, venues, and early customer interest.

Planned work:

- Convert the single-page content into reusable Nuxt components.
- Align copy with the broader product vision and MVP launch positioning.
- Add calls to action for venue demos, pilot inquiries, and app interest.

### Customer Digital Ticket

The first customer product surface should be a secure mobile web ticket that does not require an app install.

Planned work:

- Add `/ticket/[token]` route for secure ticket access.
- Show venue, ticket number, vehicle summary, current status, and timeline.
- Allow pickup request only when the session is eligible.
- Hide internal staff notes, exact parking details, and sensitive identifiers.
- Add completed, expired, invalid, loading, and error states.

### Staff Operations

The staff product surface should be optimized for fast check-in, parking updates, pickup queue processing, and handoff.

Planned work:

- Add staff authentication and role checks.
- Add active sessions view.
- Add check-in flow for customer contact, vehicle details, ticket number, key tag, and notes.
- Add status controls for checked in, parked, pickup requested, retrieving, ready, completed, cancelled, and flagged.
- Add parking location fields for zone, row, stall, floor, and notes.
- Add pickup queue sorted by request time, priority, and operational status.

### Manager Dashboard

The first dashboard should support live shift supervision, not advanced analytics.

Planned work:

- Add dashboard overview route.
- Show active sessions by status.
- Show pickup queue count and delayed sessions.
- Show daily completed sessions and average pickup wait time.
- Add basic search for active and completed sessions.
- Add manager-only access control.

### Platform Admin

Admin features should begin as seed/configuration data and become UI only when repeated changes require non-engineering access.

Planned work:

- Model venues, staff roles, service availability, operating hours, and pickup rules.
- Seed pilot venue configuration.
- Defer full admin UI until after pilot operations stabilize.

## Build Milestones

### Milestone 1: App Foundation

Goal: prepare the Nuxt app for product routes and shared domain logic.

Scope:

- Establish route groups for marketing, ticket, staff, and dashboard views.
- Add Dockerfile, Docker Compose, and containerized local development workflow.
- Add shared status constants and status transition helpers.
- Add database and Prisma setup.
- Add seed data for one venue, manager, and staff user.
- Document required environment variables.

Exit criteria:

- App runs locally through Docker Compose with seeded pilot data.
- Staff routes are protected.
- Status values are shared by frontend and server code.

### Milestone 2: Valet Session Creation

Goal: let staff create real valet sessions.

Scope:

- Build staff active sessions page.
- Build check-in form.
- Store customer contact, vehicle details, key tag, ticket number, and initial status.
- Generate secure ticket token.
- Create first session event.

Exit criteria:

- Staff can create a session from the browser.
- Session appears in the active list.
- Session has a secure customer ticket link.

### Milestone 3: Customer Ticket Loop

Goal: let customers view ticket status and request pickup.

Scope:

- Build public ticket route.
- Show customer-safe session summary and timeline.
- Add pickup request endpoint.
- Add customer-facing state changes after pickup is requested.

Exit criteria:

- Customer can open a ticket on mobile web.
- Customer can request pickup.
- Staff sees the pickup request in the operations flow.

### Milestone 4: Pickup Queue and Handoff

Goal: complete the valet loop from parked vehicle to handoff.

Scope:

- Build pickup queue.
- Add runner assignment and retrieval states.
- Add ready and completed handoff actions.
- Capture timestamps for pickup requested, retrieval started, ready, and completed.

Exit criteria:

- Staff can process a pickup from request through completion.
- Completed sessions leave the active queue.
- Timeline reflects every major action.

### Milestone 5: Notifications

Goal: send reliable customer messages for the most important workflow events.

Scope:

- Integrate SMS provider or local mock.
- Send ticket link.
- Send pickup confirmation and vehicle ready alerts.
- Log delivery attempts and failures.
- Add resend ticket action.

Exit criteria:

- Local development works without live provider credentials.
- Pilot environment can send real ticket and ready messages.
- Failed notifications are visible to staff or managers.

### Milestone 6: Manager Visibility

Goal: give managers enough operational visibility for a pilot shift.

Scope:

- Build dashboard overview.
- Add active session status counts.
- Add pickup wait time metrics.
- Add delayed and flagged session visibility.
- Add daily session history.

Exit criteria:

- Manager can understand the active shift at a glance.
- Metrics are based on real session events.
- Manager can open session details from dashboard lists.

### Milestone 7: Pilot Hardening

Goal: prepare for simulated shifts and a controlled venue launch.

Scope:

- Add empty, loading, and error states.
- Add responsive QA across staff and ticket screens.
- Add basic accessibility pass.
- Add manual override rules for managers.
- Run simulated shifts from check-in to completion.
- Document known limitations.

Exit criteria:

- Team can run an end-to-end simulated valet shift.
- Pilot checklist is updated with real product readiness.
- Known limitations are explicit before launch.

## Deferred Features

The following features are part of the full product vision but should wait until the valet core is stable:

- Customer accounts and saved vehicles.
- Native mobile app.
- Digital payments, tips, refunds, and receipts.
- Add-on services and partner fulfillment.
- Full venue/admin configuration UI.
- Advanced analytics and multi-location reporting.
- Fuel, EV charging, payout reconciliation, and external partner integrations.

## Engineering Workstreams

### Domain and Data

- Use relational models for venues, users, vehicles, valet sessions, ticket tokens, pickup requests, session events, notifications, and audit records.
- Prefer append-only event records for status history.
- Keep customer-visible ticket data separate from staff-only operational notes.

### Security

- Require staff authentication for operations routes.
- Use role-based access for staff, manager, and future admin roles.
- Use long, random, revocable ticket tokens for customer ticket access.
- Validate status transitions server-side.
- Avoid exposing internal database IDs in public ticket URLs.

### UX and Design

- Use the design system in `docs/product/design-system.md`.
- Prioritize large touch targets and high-contrast status cues for outdoor staff use.
- Preserve a premium tone for customer and venue-facing screens.

### Quality

- Add focused tests around status transitions, ticket access, pickup request creation, and session event creation.
- Add end-to-end coverage once the core loop is implemented.
- Test mobile breakpoints for customer tickets and staff workflows before pilot.

## Suggested First Sprint

The first sprint should produce a thin but real product skeleton:

- Route shell for `/ticket/[token]`, `/staff`, `/staff/check-in`, `/staff/sessions/[id]`, `/staff/pickup-queue`, and `/dashboard`.
- Shared session status definitions.
- Initial Prisma schema and seed data.
- Protected staff layout stub.
- Static ticket, staff, and dashboard screens using the design system.

This creates a structure where future implementation can replace static data with real server routes without rethinking the product surfaces.
