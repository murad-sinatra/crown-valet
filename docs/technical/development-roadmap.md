# Development Roadmap

## Roadmap Strategy

Crown Valet should be built in phases so the team can validate operational workflows before investing heavily in advanced marketplace and analytics features. The first goal is a reliable digital valet experience at a pilot venue. Later phases expand into service add-ons, dashboards, partner operations, and multi-location scale.

## Phase 0: Product and Design Foundation

### Objectives

- Finalize product scope for pilot and full platform vision.
- Define brand, UX patterns, and key workflows.
- Prepare technical architecture and delivery plan.

### Deliverables

- Product requirements
- User journey maps
- Wireframes for customer ticket, valet check-in, pickup queue, and dashboard
- Initial data model
- Technical architecture decisions
- Pilot venue workflow assumptions

### Exit Criteria

- Stakeholders agree on pilot scope.
- Development team can estimate implementation.
- Pilot venue workflow is documented.

## Phase 1: Digital Ticket and Valet Core

### Objectives

- Replace paper ticket dependency with digital valet sessions.
- Give staff a simple check-in and status workflow.
- Give customers basic ticket visibility.

### Features

- Venue setup basics
- Staff login and roles
- Vehicle check-in
- Digital ticket generation
- Customer ticket web link
- Vehicle status timeline
- Parking location notes
- Basic pickup request
- Pickup queue
- Session closure
- Basic support notes

### Technical Work

- Backend API foundation
- Relational database
- Authentication and role-based access
- Photo upload storage
- SMS or email ticket delivery
- Staff web or mobile-first operations interface

### Exit Criteria

- Pilot venue can process real valet sessions.
- Customer can receive ticket and request pickup.
- Staff can manage active vehicles and close sessions.

## Phase 2: Payments, Tips, and Receipts

### Objectives

- Enable digital payment and tipping.
- Reduce manual payment friction at pickup.
- Create clear financial records.

### Features

- Payment provider integration
- Valet fee payment
- Tip flow
- Receipts
- Refund basics
- Payment status in staff tools
- Revenue reporting basics

### Technical Work

- Payment intent and capture flow
- Webhooks from payment provider
- Receipt generation
- Refund workflow
- Financial event audit logging

### Exit Criteria

- Customers can pay and tip digitally.
- Managers can see payment status.
- Finance can review transaction history.

## Phase 3: Customer Mobile App

### Objectives

- Move from ticket link to richer customer experience.
- Support saved vehicles, history, and push notifications.

### Features

- Customer account
- Saved vehicles
- Active valet session view
- Push notifications
- Visit history
- Receipts
- Support access
- Optional ticket sharing

### Technical Work

- Mobile app foundation
- Customer authentication
- Push notification integration
- API expansion for customer profiles and vehicles

### Exit Criteria

- Repeat customers can use a richer app experience.
- Ticket link remains available for one-time users.

## Phase 4: Service Add-Ons

### Objectives

- Launch revenue-generating services attached to active valet sessions.
- Prove operational fulfillment and customer demand.

### Features

- Service catalog
- Service eligibility rules
- Cleaning and detailing requests
- Service job queue
- Partner or staff assignment
- Service status updates
- Completion proof photos
- Add-on payments
- Service revenue reporting

### Technical Work

- Service marketplace domain
- Partner role permissions
- Job status workflow
- Proof attachment handling
- Revenue share metadata

### Exit Criteria

- Customers can purchase add-on services.
- Staff and partners can complete jobs with proof.
- Venue can see service revenue and completion performance.

## Phase 5: Venue and Admin Dashboards

### Objectives

- Give venues and internal admins full visibility and configuration control.
- Support more complex venue operations.

### Features

- Live active vehicle dashboard
- Pickup wait time dashboard
- Staff activity dashboard
- Incident dashboard
- Venue configuration
- Pricing configuration
- Service configuration
- Role management
- Reporting exports

### Technical Work

- Dashboard frontend
- Reporting queries and aggregates
- Admin permission model
- Configuration management
- Export pipeline

### Exit Criteria

- Venue managers can monitor operations without staff assistance.
- Admins can configure venues and users without engineering support.

## Phase 6: Fuel, EV Charging, and Partner Marketplace

### Objectives

- Expand from simple on-site services to partner-driven services.
- Support variable pricing and stricter proof requirements.

### Features

- Gas fill-up
- EV charging
- Partner portal
- Partner acceptance and rejection
- Variable final pricing
- Receipt and proof requirements
- Partner payout reconciliation
- SLA tracking

### Technical Work

- Partner management
- Variable payment capture
- Payout and reconciliation reporting
- Advanced proof workflows
- Vehicle movement approval workflow

### Exit Criteria

- Partner services can be fulfilled with traceability.
- Variable charges can be reconciled and reported.

## Phase 7: Multi-Location Scale and Analytics

### Objectives

- Support larger venue groups and valet operators.
- Turn operational data into business intelligence.

### Features

- Multi-location reporting
- Benchmarking across venues
- Event-based reporting
- Staffing recommendations
- Service conversion analytics
- Customer satisfaction analysis
- Enterprise account controls

### Technical Work

- Analytics store or reporting layer
- Data aggregation jobs
- Multi-tenant performance optimization
- Advanced permissions
- Enterprise exports and integrations

### Exit Criteria

- Multi-location operators can manage performance across venues.
- Platform can support growth without manual reporting.

## Cross-Cutting Workstreams

### Design and User Research

- Test curbside staff workflows.
- Validate customer ticket and pickup flows.
- Review venue dashboard needs with managers.

### Security and Compliance

- Role-based access control
- Payment compliance through provider
- Privacy and retention policies
- Audit logs

### Quality Assurance

- End-to-end tests for check-in, pickup, payment, services, and support.
- Load testing for event pickup spikes.
- Mobile usability testing in real valet environments.

### Operations Enablement

- Staff training materials
- Venue onboarding checklist
- Support playbooks
- Partner service SOPs

## Suggested MVP Definition

Even though the full vision is broad, the recommended first live MVP is:

- Venue setup
- Staff check-in
- Digital ticket
- Vehicle status
- Parking location
- Pickup request
- Pickup queue
- Basic notifications
- Session closure
- Basic reporting

Payments and service add-ons can follow once the core valet workflow is stable.
