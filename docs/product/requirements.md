# Product Requirements

## Scope

These requirements describe the full Crown Valet product vision. They are intentionally broader than the current landing page implementation and should guide future mobile, backend, dashboard, and partner development.

## Functional Requirements

### Customer Account

- Customers can create and access an account using phone, email, or approved identity provider.
- Customers can manage personal information, notification preferences, saved vehicles, and payment methods.
- Customers can view current and historical valet sessions.
- Customers can recover an active ticket through verified contact information.

### Valet Session

- Staff can create a valet session at vehicle drop-off.
- Each session must include a unique ticket ID.
- Staff can attach vehicle details, customer details, key tag, photos, notes, and parking location.
- The system must maintain a status timeline for every session.
- Staff can close a session only after vehicle handoff is confirmed.

### Vehicle Tracking and Status

- The system must show a clear vehicle status to customers and staff.
- The system should support approximate parking location by zone, row, floor, stall, or GPS-assisted location.
- Location visibility must be configurable by venue and role.
- The system must record timestamps for key events.

### Pickup Request

- Customers can request immediate pickup from the digital ticket or mobile app.
- Staff can view pickup requests in a queue.
- Managers can prioritize, assign, delay, cancel, or complete pickup requests based on operational rules.
- Customers must receive notifications when retrieval begins and when the vehicle is ready.

### Service Add-Ons

- Customers can view available services by venue and session eligibility.
- Customers can request one or more eligible services.
- The system must create service jobs with price, timing, instructions, vehicle details, and proof requirements.
- Service partners or staff can update service status.
- Customers must receive service status and completion updates.

### Payments

- Customers can pay valet fees, add-ons, tips, and variable service charges.
- The system must support itemized receipts.
- The system should support refunds, partial refunds, discounts, vouchers, corporate billing, and venue-paid sessions.
- Payment events must be auditable.

### Notifications

- The system must support customer notifications through push, SMS, and email.
- Customers can manage preferences where legally and operationally permitted.
- Staff and managers must receive operational alerts for pickup requests, service delays, escalations, and incidents.

### Dashboard and Reporting

- Venue users can view active sessions, status distribution, wait times, revenue, incidents, and service performance.
- Admin users can configure venues, roles, services, pricing, taxes, and branding.
- Reports should be exportable for finance, operations, venues, and partners.

### Support and Incidents

- Customers can create support requests linked to a valet session.
- Staff and admins can review session evidence, photos, notes, messages, payments, and audit logs.
- Refunds, credits, or dispute outcomes must be linked to the support case.

## Non-Functional Requirements

### Reliability

- Core check-in, ticket access, status updates, and pickup queue functions should remain available during peak periods.
- The system should degrade gracefully if third-party services such as SMS, maps, or payments are delayed.
- Critical actions should be retried or queued when network connectivity is unstable.

### Performance

- Check-in flow should be optimized for curbside speed.
- Staff status updates should appear near real time.
- Dashboard views should load quickly for active operations.
- Pickup queue changes should be visible without manual refresh where practical.

### Security

- Use role-based access control for customer, valet, manager, admin, venue, and partner users.
- Protect personal information, payment references, vehicle details, and support records.
- Audit sensitive actions such as refunds, role changes, price overrides, incident edits, and manual status changes.
- Avoid exposing exact vehicle location to unauthorized users.

### Privacy

- Collect only the vehicle and customer data needed for parking, service fulfillment, support, and reporting.
- Provide clear consent for notifications and optional services.
- Apply retention policies for photos, location history, payment references, and support records.
- Keep customer-facing tracking useful without revealing unnecessary operational detail.

### Compliance

- Payment handling should rely on compliant payment providers and avoid storing raw card details.
- SMS and email messaging must respect opt-in, opt-out, and regional consent rules.
- Data handling should support applicable privacy regulations for launch markets.

### Auditability

- Every valet session should have a chronological event history.
- Events should identify actor, timestamp, role, action, and relevant metadata.
- Audit logs should be tamper-resistant for sensitive workflows.

### Accessibility

- Customer app and web ticket experiences should support readable text, clear contrast, screen reader basics, and simple flows.
- Critical notifications should not rely only on color.
- Staff tools should remain usable in outdoor lighting and fast-paced environments.

### Localization and Venue Configuration

- Venue-specific branding, instructions, services, pricing, taxes, operating hours, and policies should be configurable.
- Future versions should support multiple languages, currencies, and regional rules.

## Launch Readiness Requirements

- Pilot venue can onboard staff and process live valet sessions.
- Customer digital ticket works without requiring an app install.
- Payment, pickup, service requests, and notifications are tested end to end.
- Support team can review session history and resolve issues.
- Managers can access daily operational and revenue reports.
