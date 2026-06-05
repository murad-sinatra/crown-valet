# Valet Operations

## Operating Model

Crown Valet supports the full lifecycle of a valet session, from curbside check-in through vehicle handoff. The goal is to make every vehicle traceable, every staff action visible, and every customer update timely.

## Roles

### Greeter or Check-In Attendant

- Welcomes customer.
- Creates valet session.
- Captures customer and vehicle information.
- Records condition photos and notes.
- Assigns key tag and digital ticket.

### Runner

- Parks and retrieves vehicles.
- Updates vehicle location and status.
- Responds to pickup assignments.
- Flags delays, blocked vehicles, or access issues.

### Valet Manager

- Monitors active sessions and staff workload.
- Manages pickup queue and escalations.
- Resolves customer issues.
- Coordinates service partners.
- Reviews shift reporting.

### Venue Manager

- Reviews operational performance and customer experience.
- Monitors revenue, service adoption, and complaints.
- Coordinates venue policies with valet management.

## Standard Session Lifecycle

### 1. Arrival and Greeting

Customer arrives at the valet stand. Staff confirms whether the customer is a guest, resident, visitor, event attendee, or VIP.

Operational needs:

- Keep curbside interaction short.
- Confirm contact method for digital ticket.
- Identify special handling requirements.

### 2. Vehicle Check-In

Staff creates a new valet session and records:

- Customer name or phone number
- Vehicle make, model, color, and plate
- Key tag
- Ticket ID
- Condition photos
- Existing damage notes
- Mileage or fuel level when required
- Special notes such as child seat, oversized vehicle, manual transmission, or restricted access

The customer receives a digital ticket immediately.

### 3. Vehicle Parking

Runner moves the vehicle to a parking area and records:

- Parking zone, floor, row, stall, or approximate GPS point
- Time parked
- Runner assignment
- Any access issues or blocked-in notes

The customer status changes to parked when the vehicle is secure.

### 4. Active Session

During the active session:

- Customer can view status.
- Customer can request add-on services.
- Staff can update notes or status.
- Manager can monitor active cars and exceptions.

### 5. Pickup Request

Customer requests pickup through the app, digital ticket link, or valet stand. The request enters the pickup queue.

Queue should show:

- Request time
- Ticket ID
- Customer name or identifier
- Vehicle details
- Parking location
- Priority or VIP status
- Service status blockers
- Assigned runner

### 6. Retrieval

Runner accepts or receives assignment, retrieves vehicle, and updates status.

Possible statuses:

- Pickup requested
- Runner assigned
- Retrieving
- Delayed
- Ready

Delay reasons should be structured when possible:

- Vehicle blocked
- Key issue
- Payment required
- Service still in progress
- Customer not at pickup point
- Manager assistance needed

### 7. Payment and Handoff

Customer pays outstanding balance and tip if applicable. Staff confirms handoff and closes the session.

Closure should record:

- Handoff time
- Staff member
- Payment status
- Receipt status
- Any final notes

## Operational Exceptions

### Lost Ticket

Staff verifies identity through phone, email, vehicle information, and manager approval. Ticket recovery should be audited.

### Lost Key

Manager creates incident, notifies customer, locks ticket status, and records resolution steps.

### Damage Claim

Manager reviews check-in photos, handoff notes, staff activity, and vehicle timeline. Support case is attached to the session.

### Blocked Vehicle

Runner flags vehicle as blocked and manager reassigns staff or updates customer ETA.

### Service Delay

If an add-on service delays pickup, customer receives an update and manager decides whether to complete, cancel, or partially refund the service.

## Shift Management

Managers should be able to review:

- Staff on shift
- Cars checked in per staff member
- Cars retrieved per runner
- Average check-in time
- Average pickup time
- Delayed pickups
- Incidents
- Tips and service revenue

## Recommended Status Model

- Draft
- Checked in
- Being parked
- Parked
- Service requested
- Service in progress
- Service completed
- Pickup requested
- Runner assigned
- Retrieving
- Ready
- Completed
- Cancelled
- Incident hold

## Operational KPIs

- Check-in duration
- Pickup wait time
- Queue length by time of day
- Delayed pickup count
- Staff actions per shift
- Incident count
- Digital ticket adoption
- Add-on service adoption
- Customer satisfaction score
