# Service Fulfillment

## Purpose

Crown Valet creates revenue opportunities by offering vehicle services while the car is already parked. Service fulfillment must be structured enough for customers to trust it and simple enough for valet teams and partners to execute during real operations.

## Supported Service Categories

### Cleaning

- Exterior wash
- Interior wipe-down
- Vacuum
- Window cleaning
- Premium detail package

### Fuel and Charging

- Gas fill-up
- EV charging
- Hybrid charging or fuel combination where applicable

### Light Maintenance

- Tire pressure check
- Windshield washer fluid
- Basic visual inspection
- Battery check where partner capability exists

### Premium Services

- Full detailing
- Odor treatment
- Ceramic coating partner referral
- Scheduled maintenance pickup and return

## Service Request Lifecycle

### 1. Service Discovery

Customer views available services from the active digital ticket. The catalog should be filtered by:

- Venue
- Operating hours
- Vehicle eligibility
- Partner availability
- Time remaining before expected pickup
- Weather or operational constraints

### 2. Quote and Confirmation

Customer sees:

- Service name
- Description
- Price or estimate
- Expected duration
- Requirements or exclusions
- Cancellation policy
- Proof of completion provided

Customer confirms and authorizes payment.

### 3. Job Creation

The system creates a service job attached to the valet session.

Required job details:

- Ticket ID
- Vehicle details
- Parking location
- Customer request details
- Service instructions
- Price and payment state
- Required proof
- Target completion time
- Assigned staff or partner

### 4. Partner or Staff Acceptance

The assigned service team accepts or rejects the job. Rejection should require a reason and may trigger customer notification or manager review.

### 5. Service In Progress

The service provider marks the job as started. Valet staff should see that pickup may be blocked while the service is active.

### 6. Completion Proof

The provider completes the job and uploads proof such as:

- Before and after photos
- Fuel receipt
- Charging session receipt
- Mileage or fuel level photo
- Completion notes

### 7. Customer Notification

Customer receives completion message with relevant proof and receipt details.

### 8. Revenue Reconciliation

The system records:

- Customer charge
- Venue share
- Partner share
- Platform share
- Taxes and fees
- Refunds or adjustments

## Service Statuses

- Requested
- Pending payment
- Assigned
- Accepted
- Rejected
- In progress
- Blocked
- Completed
- Cancelled
- Refunded

## Operational Rules

### Timing

- Service availability should account for expected pickup time and venue rush periods.
- Managers should be able to pause service ordering during peak traffic or weather events.
- Services with long duration should show clear customer expectations.

### Vehicle Movement

Some services can happen in the parking area. Others may require moving the vehicle to a service location. Any movement outside normal valet flow should be approved and audited.

### Proof Requirements

Proof should match service risk:

- Cleaning: completion photo
- Gas: receipt and fuel level photo
- EV charging: charging session confirmation
- Detailing: before and after photos
- Maintenance: checklist or partner note

### Cancellation

Cancellation rules should depend on service state:

- Before acceptance: usually cancellable.
- After acceptance: may require partner approval.
- After start: may be non-refundable or partially refundable.
- After completion: handled through support or dispute process.

## Partner Management

Partner profiles should include:

- Business name
- Contact information
- Service areas
- Supported venues
- Service catalog
- Hours
- Pricing
- Proof requirements
- SLA targets
- Payout configuration

## Service SLAs

Recommended service-level metrics:

- Acceptance time
- Start time
- Completion time
- On-time completion rate
- Customer rating
- Refund rate
- Dispute rate
- Photo proof compliance

## Customer Experience Guidelines

- Do not offer services that cannot realistically be completed before pickup.
- Make pricing and timing clear before confirmation.
- Notify customers early if the service may delay pickup.
- Show proof of completion for confidence.
- Keep support access visible after service completion.

## Launch Recommendation

Start with services that are easy to fulfill on-site and easy to verify:

1. Exterior wash
2. Interior cleaning
3. Premium detail

Then expand into fuel delivery, EV charging, and light maintenance once partner coordination and audit workflows are proven.
