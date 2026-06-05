# MVP Scope

## Goal

Build the first usable Crown Valet product around the core valet workflow: customer drop-off, digital ticket, vehicle status, pickup request, staff queue management, and session closure.

The MVP should be strong enough for a pilot venue to run a simulated or limited live valet operation without relying on paper tickets as the primary workflow.

## Included In MVP

### Customer Digital Ticket

- Customer receives a secure ticket link by SMS, QR code, or manual share.
- Ticket works on mobile web without requiring an app install.
- Ticket shows vehicle details, venue details, current status, timeline, and pickup controls.
- Customer can request pickup from the ticket page.
- Customer can see whether pickup has been requested, retrieval has started, or the car is ready.

### Valet Staff Workflow

- Staff can create a new valet session.
- Staff can capture customer contact, vehicle details, ticket number, and key tag.
- Staff can update vehicle status.
- Staff can record a parking zone or parking location note.
- Staff can view active vehicles and pickup queue.
- Staff can mark a vehicle as ready and close the session.

### Vehicle Status Timeline

- Every important session action creates a timeline event.
- Customer-facing status remains simple and clear.
- Staff-facing timeline keeps enough detail for operational review.

### Pickup Queue

- Customer pickup requests appear in a staff queue.
- Staff can process requests in order.
- Staff can update pickup status to assigned, retrieving, ready, or completed.
- Managers can see delayed or flagged sessions.

### Basic Notifications

- Send the initial digital ticket link.
- Confirm pickup request when customer requests the car.
- Notify customer when the car is ready.
- Log notification attempts for troubleshooting.

### Venue Operations View

- Show active vehicles by status.
- Show pickup queue.
- Show daily session count.
- Show average pickup wait time.
- Show basic session history.

## Explicitly Deferred

These items are part of the broader Crown Valet vision but should not block the first MVP.

### Deferred Product Features

- Customer accounts
- Saved vehicles
- Native iOS or Android app
- Payment processing
- Tips
- Refunds
- Add-on services
- Partner portal
- Gas fill-up
- EV charging
- Photo capture and damage claims
- Advanced support case management
- Multi-location enterprise controls
- Advanced analytics

### Deferred Technical Complexity

- Dedicated microservices
- Complex dispatch optimization
- Real-time GPS tracking
- Partner API integrations
- Automated payout reconciliation
- Enterprise SSO
- Data warehouse

## MVP Status Model

Recommended session statuses:

- checked_in
- being_parked
- parked
- pickup_requested
- runner_assigned
- retrieving
- ready
- completed
- cancelled
- flagged

## Acceptance Criteria

The scope is complete when:

- A staff member can check in a vehicle in under one minute.
- A customer can open a digital ticket without an account.
- A customer can request pickup from the ticket.
- Staff can process pickup requests from a shared queue.
- A manager can see active sessions and basic daily performance.
- Each session has a reliable status timeline.
- The team can complete a full simulated valet shift without manual database edits.
