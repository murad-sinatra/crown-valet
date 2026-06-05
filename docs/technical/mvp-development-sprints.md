# MVP Development Sprint Plan

## Purpose

This plan turns the Crown Valet MVP docs into a step-by-step development sequence. It is the working plan to follow before writing product code.

The goal is to build the reliable valet loop first:

1. Staff checks in a vehicle.
2. Customer receives a secure digital ticket.
3. Staff records status and parking location.
4. Customer requests pickup from the ticket page.
5. Staff processes the pickup queue.
6. Manager sees live operational state.
7. Every important action creates a session event.

## Current Priority

Build a pilot-ready web MVP in the existing Nuxt 3 app. Keep the first version mobile-friendly, operationally clear, and scoped to a single pilot venue.

Do not start payments, add-on services, native mobile apps, partner workflows, advanced analytics, or full admin configuration until the core valet workflow passes a simulated shift.

Use `docs/technical/mvp-technical-stack-detail.md` as the implementation reference for framework, database, authentication, hosting, testing, and integration choices.

## Delivery Rules

- Work from the existing Nuxt 3 app.
- Run the app, database, migrations, seeds, and tests through Docker containers.
- Use Docker Compose as the required local development workflow.
- Use PostgreSQL and Prisma for the MVP data layer.
- Protect staff and dashboard routes.
- Use secure public ticket tokens for customer ticket access.
- Validate status transitions on the server.
- Create a session event for every important workflow action.
- Keep staff-only notes and exact internal parking details off customer ticket pages.
- Follow `docs/product/design-system.md` for product screens.
- Keep each sprint demoable, even if some screens use limited data at first.

## Backlog Organization

Use these workstreams to keep tasks organized during development.

### Product Surfaces

- Marketing site: keep current landing page stable unless MVP navigation or positioning needs minor updates.
- Customer ticket: `/ticket/[token]`.
- Staff operations: `/staff`, `/staff/check-in`, `/staff/sessions/[id]`, `/staff/pickup-queue`.
- Manager dashboard: `/dashboard`.
- Admin configuration: seed data first, admin UI later.

### Engineering Lanes

- Domain and data: Prisma schema, migrations, seed data, status constants, transition helpers.
- Auth and access: staff login, route protection, manager role checks, ticket token lookup.
- API routes: session creation, status updates, ticket reads, pickup requests, queue updates, dashboard overview.
- UI components: app shell, buttons, cards, status badges, form fields, timeline, empty states, error states.
- Notifications: local mock first, provider integration when the core loop works.
- Quality: unit tests for domain logic, API tests for write flows, end-to-end tests for the full valet loop.
- Pilot readiness: mobile QA, accessibility pass, simulated shift, known limitations, backup process.

## Sprint 0: Planning and Repo Preparation

### Goal

Make the repo ready for focused MVP implementation.

### Tasks

- Confirm the MVP scope from `docs/mvp/scope.md`.
- Confirm the seven build phases from `docs/mvp/implementation-phases.md`.
- Confirm the detailed stack choices from `docs/technical/mvp-technical-stack-detail.md`.
- Review current Nuxt app structure before adding routes.
- Confirm Docker Compose service names, ports, volumes, and local environment file conventions.
- Confirm whether staff auth starts as simple pilot credentials or a provider-backed flow.
- Confirm whether notifications start as mocked SMS only.
- Create a development checklist from this plan.

### Done When

- MVP scope is accepted.
- Deferred features are understood.
- First implementation sprint can begin without unresolved product questions.

## Sprint 1: App Foundation

### Goal

Create the product skeleton, shared domain definitions, data foundation, and protected route shells.

### Build

- Add route shells for:
  - `/ticket/[token]`
  - `/staff`
  - `/staff/check-in`
  - `/staff/sessions/[id]`
  - `/staff/pickup-queue`
  - `/dashboard`
- Add Dockerfile for the Nuxt application.
- Add Docker Compose for local app and PostgreSQL services.
- Add `.dockerignore`.
- Add containerized commands for development, migrations, seeding, and tests.
- Add shared valet session status constants:
  - `checked_in`
  - `being_parked`
  - `parked`
  - `pickup_requested`
  - `runner_assigned`
  - `retrieving`
  - `ready`
  - `completed`
  - `cancelled`
  - `flagged`
- Add server-side status transition helper.
- Add Prisma and database connection.
- Create initial schema for:
  - venues
  - staff users
  - customer contacts
  - vehicles
  - valet sessions
  - ticket tokens
  - parking locations
  - pickup requests
  - session events
  - notification logs
- Add seed data for one venue, one manager, and at least one staff user.
- Add product layout stubs for customer, staff, and dashboard screens.
- Document required environment variables.

### Quality Checks

- App runs locally.
- App runs through Docker Compose.
- Database runs through Docker Compose locally.
- Migrations apply cleanly.
- Seed data loads.
- Staff routes are not publicly accessible.
- Status constants are shared by client and server code.

### Demo

Show all new route shells, seeded venue data, and protected staff route behavior.

## Sprint 2: Staff Check-In

### Goal

Let staff create real valet sessions from the browser.

### Build

- Build staff active sessions page.
- Build mobile-first check-in form.
- Capture required fields:
  - customer phone
  - vehicle make
  - vehicle model
  - vehicle color
  - license plate
  - key tag
- Capture optional MVP fields:
  - customer name
  - vehicle notes
  - parking zone
  - staff notes
- Generate ticket number.
- Generate secure customer ticket token.
- Store customer contact, vehicle, session, token, and initial event.
- Build staff session detail page.
- Show customer-safe ticket link for staff to share manually.

### Quality Checks

- Required fields validate before submit.
- Staff can create a session in under one minute.
- New session appears in active sessions.
- Session has a ticket number and secure token.
- Timeline includes `session_created`.

### Demo

Create a session from `/staff/check-in`, open it from `/staff`, and confirm the timeline started.

## Sprint 3: Customer Digital Ticket

### Goal

Give customers a secure mobile ticket that works without an account.

### Build

- Implement `/ticket/[token]` lookup.
- Show customer-safe fields only:
  - venue name
  - ticket number
  - vehicle summary
  - current customer-facing status
  - last updated time
  - visible timeline events
  - pickup instructions
- Add invalid, expired, completed, loading, and error states.
- Add pickup request button only when session status allows pickup.
- Keep staff notes, internal IDs, and exact staff-only location details hidden.

### Quality Checks

- Valid token opens the correct ticket.
- Invalid token shows safe error copy.
- Ticket works on mobile width.
- Customer timeline matches visible session events.
- Pickup button appears only for eligible sessions.

### Demo

Create a staff session, open the ticket link, and verify the customer view shows the right status.

## Sprint 4: Parking Status and Pickup Queue

### Goal

Complete the operational loop from parked vehicle to pickup handoff.

### Build

- Add parking location form to staff session detail.
- Add status update controls for:
  - being parked
  - parked
  - flagged
  - cancelled
- Implement customer pickup request endpoint.
- Create pickup request records.
- Update valet session status to `pickup_requested`.
- Build staff pickup queue sorted by request time.
- Add queue item detail or inline queue actions.
- Add runner assignment.
- Add status transitions:
  - runner assigned
  - retrieving
  - ready
  - completed
  - cancelled
- Capture timestamps for pickup requested, assigned, retrieving, ready, and completed.
- Create session events for each status change.

### Quality Checks

- Staff can mark a vehicle parked and add location notes.
- Customer can request pickup from the ticket page.
- Pickup request appears in the staff queue.
- Staff can move request through retrieving, ready, and completed.
- Customer ticket reflects pickup changes.
- Completed session leaves active queue.
- Duplicate active pickup requests are blocked.

### Demo

Run the first full internal loop: check in, open ticket, mark parked, request pickup, process queue, mark ready, complete session.

## Sprint 5: Basic Notifications

### Goal

Send or mock the most important customer messages and log every attempt.

### Build

- Add notification service interface.
- Add local/mock notification provider for development.
- Add provider configuration for pilot SMS if credentials are available.
- Send or mock:
  - ticket link
  - pickup request confirmation
  - vehicle ready alert
- Record notification attempts in `notification_logs`.
- Add visible failure state for staff or manager.
- Add resend ticket action.

### Quality Checks

- Local development works without live provider credentials.
- Notification attempts are logged.
- Failed notifications are visible.
- Staff can resend a ticket link.
- Ready notification is triggered when vehicle becomes ready.

### Demo

Create a session, send or mock the ticket link, request pickup, mark ready, and inspect notification logs.

## Sprint 6: Manager Dashboard

### Goal

Give managers enough visibility to supervise a pilot shift.

### Build

- Build dashboard overview route.
- Add active sessions by status.
- Add pickup queue summary.
- Add delayed and flagged sessions.
- Add completed sessions today.
- Add average pickup wait time.
- Add basic session search or history.
- Add manager-only route access.
- Link dashboard items to session detail.

### Quality Checks

- Manager can see active operational state at a glance.
- Metrics come from real session data.
- Manager can open a session from dashboard lists.
- Daily history includes completed sessions.
- Flagged sessions are obvious.

### Demo

Run several sample sessions and show dashboard counts, queue status, flagged sessions, and completed history.

## Sprint 7: Pilot Hardening

### Goal

Prepare for simulated shifts and a controlled first venue pilot.

### Build

- Add missing empty states.
- Add missing loading states.
- Add clear error states.
- Add manager manual override rules where needed.
- Run mobile responsiveness pass for ticket and staff screens.
- Run basic accessibility pass.
- Add focused tests around:
  - status transitions
  - ticket token access
  - pickup request creation
  - session event creation
- Add end-to-end test for the full valet loop if tooling supports it.
- Update pilot checklist with actual readiness.
- Document known limitations.

### Quality Checks

- Full simulated shift passes without manual database edits.
- Staff flows work on phone screens.
- Customer ticket works on mobile Safari and Chrome.
- Manager can identify and resolve a flagged session.
- Common errors have understandable messages.
- Known limitations are documented before pilot.

### Demo

Run the simulated shift from `docs/mvp/pilot-checklist.md` and record pass/fail notes.

## First Internal Demo Target

The first meaningful demo should happen after Sprint 4.

It must show:

1. Staff creates a valet session.
2. Customer ticket link opens.
3. Staff marks vehicle parked.
4. Customer requests pickup.
5. Pickup appears in staff queue.
6. Staff marks retrieving.
7. Staff marks ready.
8. Staff completes handoff.
9. Timeline shows all major actions.

This proves the core valet loop before notifications and dashboards are polished.

## Definition of Ready for Implementation

Before starting Sprint 1, confirm:

- MVP scope is accepted.
- Staff auth approach is chosen.
- Docker Compose local workflow is accepted.
- Notification provider is mocked or chosen.
- The first pilot venue assumptions are acceptable.
- Deferred features remain deferred.

## Definition of Done for the MVP

The MVP is done when:

- A staff member can check in a vehicle in under one minute.
- A customer can open a digital ticket without an account.
- A customer can request pickup from the ticket.
- Staff can process pickup requests from a shared queue.
- A manager can see active sessions and basic daily performance.
- Each session has a reliable status timeline.
- Notification attempts are logged.
- A full simulated valet shift completes without manual database edits.
- The pilot checklist has no blocking no-go items.

## Deferred Until After MVP

- Customer accounts and saved vehicles.
- Native iOS or Android app.
- Payments, tips, refunds, and receipts.
- Add-on services.
- Partner portal.
- Gas fill-up.
- EV charging.
- Photo capture and damage claims.
- Advanced support case management.
- Full admin UI.
- Multi-location enterprise controls.
- Advanced analytics.
- Real-time GPS tracking.

## Approval Gate

Stop here before implementation.

The next step is for the owner to review this plan and explicitly approve development to begin. After approval, start with Sprint 1: App Foundation.
