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

## Sprint Implementation Checklist

Use this checklist as the active build tracker. Checked items are already represented in the current repo; unchecked items remain to be built or verified.

### Sprint 0: Planning and Repo Preparation

- [x] Confirm MVP scope from `docs/mvp/scope.md`.
- [x] Confirm the seven build phases from `docs/mvp/implementation-phases.md`.
- [x] Confirm detailed stack choices from `docs/technical/mvp-technical-stack-detail.md`.
- [x] Review current Nuxt app structure before adding routes.
- [x] Confirm Docker Compose service names, ports, volumes, and local environment file conventions.
- [x] Confirm staff auth starts as a simple protected-route shell before the final auth flow.
- [x] Confirm notifications start with mocked provider configuration.
- [x] Create a development checklist from this plan.
- [x] MVP scope is accepted for implementation work.
- [x] Deferred features are understood.
- [x] First implementation sprint can begin without unresolved product questions.

### Sprint 1: App Foundation

- [x] Add route shell for `/ticket/[token]`.
- [x] Add route shell for `/staff`.
- [x] Add route shell for `/staff/check-in`.
- [x] Add route shell for `/staff/sessions/[id]`.
- [x] Add route shell for `/staff/pickup-queue`.
- [x] Add route shell for `/dashboard`.
- [x] Add Dockerfile for the Nuxt application.
- [x] Add Docker Compose for local app and PostgreSQL services.
- [x] Add `.dockerignore`.
- [x] Add containerized commands for development, migrations, seeding, and tests.
- [x] Add shared `checked_in` valet session status.
- [x] Add shared `being_parked` valet session status.
- [x] Add shared `parked` valet session status.
- [x] Add shared `pickup_requested` valet session status.
- [x] Add shared `runner_assigned` valet session status.
- [x] Add shared `retrieving` valet session status.
- [x] Add shared `ready` valet session status.
- [x] Add shared `completed` valet session status.
- [x] Add shared `cancelled` valet session status.
- [x] Add shared `flagged` valet session status.
- [x] Add server-side status transition helper.
- [x] Add Prisma and database connection.
- [x] Create initial schema for venues.
- [x] Create initial schema for staff users.
- [x] Create initial schema for customer contacts.
- [x] Create initial schema for vehicles.
- [x] Create initial schema for valet sessions.
- [x] Create initial schema for ticket tokens.
- [x] Create initial schema for parking locations.
- [x] Create initial schema for pickup requests.
- [x] Create initial schema for session events.
- [x] Create initial schema for notification logs.
- [x] Add seed data for one venue, one manager, and at least one staff user.
- [x] Add product layout stubs for customer, staff, and dashboard screens.
- [x] Document required environment variables.
- [x] App runs through Docker Compose.
- [x] Database runs through Docker Compose locally.
- [ ] Verify migrations apply cleanly from a fresh database.
- [ ] Verify seed data loads from a fresh database.
- [x] Staff routes are not publicly accessible.
- [x] Status constants are shared by client and server code.

### Sprint 2: Staff Check-In

- [x] Add staff active sessions page shell.
- [x] Add mobile-first check-in form shell.
- [x] Build real mobile-first check-in form.
- [x] Capture required customer phone.
- [x] Capture required vehicle make.
- [x] Capture required vehicle model.
- [x] Capture required vehicle color.
- [x] Capture required license plate.
- [x] Capture required key tag.
- [x] Capture optional customer name.
- [x] Capture optional vehicle notes.
- [x] Capture optional parking zone.
- [x] Capture optional staff notes.
- [x] Generate ticket number.
- [x] Generate secure customer ticket token.
- [x] Store customer contact, vehicle, session, token, and initial event.
- [x] Add staff session detail page shell.
- [x] Build real staff session detail page.
- [x] Show customer-safe ticket link for staff to share manually.
- [x] Validate required fields before submit.
- [ ] Confirm staff can create a session in under one minute.
- [x] Show new session in active sessions.
- [ ] Confirm session has a ticket number and secure token.
- [x] Add `session_created` timeline event.

### Sprint 3: Customer Digital Ticket

- [x] Add `/ticket/[token]` route shell.
- [ ] Implement `/ticket/[token]` lookup.
- [ ] Show venue name.
- [ ] Show ticket number.
- [ ] Show vehicle summary.
- [ ] Show current customer-facing status.
- [ ] Show last updated time.
- [ ] Show visible timeline events.
- [ ] Show pickup instructions.
- [ ] Add invalid token state.
- [ ] Add expired token state.
- [ ] Add completed session state.
- [ ] Add loading state.
- [ ] Add error state.
- [ ] Add pickup request button only when session status allows pickup.
- [ ] Keep staff notes hidden from customer ticket pages.
- [ ] Keep internal IDs hidden from customer ticket pages.
- [ ] Keep exact staff-only location details hidden from customer ticket pages.
- [ ] Verify valid token opens the correct ticket.
- [ ] Verify invalid token shows safe error copy.
- [ ] Verify ticket works on mobile width.
- [ ] Verify customer timeline matches visible session events.
- [ ] Verify pickup button appears only for eligible sessions.

### Sprint 4: Parking Status and Pickup Queue

- [ ] Add parking location form to staff session detail.
- [ ] Add status update controls for being parked.
- [ ] Add status update controls for parked.
- [ ] Add status update controls for flagged.
- [ ] Add status update controls for cancelled.
- [ ] Implement customer pickup request endpoint.
- [x] Add pickup request schema.
- [ ] Create pickup request records from customer action.
- [ ] Update valet session status to `pickup_requested`.
- [x] Add staff pickup queue route shell.
- [ ] Build real staff pickup queue sorted by request time.
- [ ] Add queue item detail or inline queue actions.
- [ ] Add runner assignment.
- [x] Add `runner_assigned` status transition definition.
- [x] Add `retrieving` status transition definition.
- [x] Add `ready` status transition definition.
- [x] Add `completed` status transition definition.
- [x] Add `cancelled` status transition definition.
- [x] Add timestamp fields for pickup requested, assigned, retrieving, ready, and completed.
- [x] Add session event schema.
- [ ] Create session events for each status change.
- [ ] Verify staff can mark a vehicle parked and add location notes.
- [ ] Verify customer can request pickup from the ticket page.
- [ ] Verify pickup request appears in the staff queue.
- [ ] Verify staff can move request through retrieving, ready, and completed.
- [ ] Verify customer ticket reflects pickup changes.
- [ ] Verify completed session leaves active queue.
- [ ] Block duplicate active pickup requests.

### Sprint 5: Basic Notifications

- [ ] Add notification service interface.
- [ ] Add local/mock notification provider for development.
- [x] Add mock notification provider environment configuration.
- [x] Add provider configuration fields for pilot SMS credentials.
- [ ] Send or mock ticket link.
- [ ] Send or mock pickup request confirmation.
- [ ] Send or mock vehicle ready alert.
- [x] Add `notification_logs` schema.
- [ ] Record notification attempts in `notification_logs`.
- [ ] Add visible failure state for staff or manager.
- [ ] Add resend ticket action.
- [ ] Verify local development works without live provider credentials.
- [ ] Verify notification attempts are logged.
- [ ] Verify failed notifications are visible.
- [ ] Verify staff can resend a ticket link.
- [ ] Verify ready notification is triggered when vehicle becomes ready.

### Sprint 6: Manager Dashboard

- [x] Add dashboard overview route shell.
- [ ] Add active sessions by status.
- [ ] Add pickup queue summary.
- [ ] Add delayed and flagged sessions.
- [ ] Add completed sessions today.
- [ ] Add average pickup wait time.
- [ ] Add basic session search or history.
- [x] Protect dashboard route behind staff session middleware.
- [ ] Add manager-only route access.
- [ ] Link dashboard items to session detail.
- [ ] Verify manager can see active operational state at a glance.
- [ ] Verify metrics come from real session data.
- [ ] Verify manager can open a session from dashboard lists.
- [ ] Verify daily history includes completed sessions.
- [ ] Verify flagged sessions are obvious.

### Sprint 7: Pilot Hardening

- [ ] Add missing empty states.
- [ ] Add missing loading states.
- [ ] Add clear error states.
- [ ] Add manager manual override rules where needed.
- [ ] Run mobile responsiveness pass for ticket and staff screens.
- [ ] Run basic accessibility pass.
- [x] Add focused tests around status transitions.
- [ ] Add focused tests around ticket token access.
- [ ] Add focused tests around pickup request creation.
- [ ] Add focused tests around session event creation.
- [ ] Add end-to-end test for the full valet loop if tooling supports it.
- [ ] Update pilot checklist with actual readiness.
- [ ] Document known limitations.
- [ ] Verify full simulated shift passes without manual database edits.
- [ ] Verify staff flows work on phone screens.
- [ ] Verify customer ticket works on mobile Safari and Chrome.
- [ ] Verify manager can identify and resolve a flagged session.
- [ ] Verify common errors have understandable messages.
- [ ] Verify known limitations are documented before pilot.

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
