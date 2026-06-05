# User Journeys

## Journey 1: Standard Valet Drop-Off and Pickup

### Actors

- Customer
- Valet attendant
- Valet runner

### Flow

1. Customer arrives at the venue valet stand.
2. Valet attendant opens a new valet session.
3. Attendant captures vehicle details, customer contact, key tag, and condition photos.
4. Customer receives a digital ticket by app, SMS, email, or QR handoff.
5. Runner parks the vehicle and records the parking location.
6. Customer sees the vehicle status update to parked.
7. Customer requests pickup from the mobile app.
8. Pickup request enters the valet queue.
9. Runner retrieves the vehicle and updates status.
10. Customer receives a ready notification.
11. Customer pays, tips, and receives a digital receipt.
12. Attendant confirms vehicle handoff and closes the session.

### Success Criteria

- Customer receives a digital ticket within seconds of check-in.
- Vehicle status history is complete.
- Pickup request is visible to staff immediately.
- Final payment and receipt are attached to the valet session.

## Journey 2: Customer Adds Cleaning Service

### Actors

- Customer
- Valet team
- Cleaning partner
- Venue manager

### Flow

1. Customer checks in vehicle through valet.
2. Customer opens the digital ticket and views available services.
3. Customer selects exterior wash or interior cleaning.
4. App shows price, estimated completion time, and service notes.
5. Customer confirms and pays or authorizes payment.
6. Service request appears in partner task queue.
7. Valet team confirms vehicle is accessible for service.
8. Cleaning partner starts service and updates status.
9. Partner uploads completion photo and notes.
10. Customer receives service completed notification.
11. Venue dashboard records service revenue and completion time.

### Success Criteria

- Service request includes vehicle, location, timing, and proof requirements.
- Customer receives status updates without calling the valet stand.
- Partner completion proof is saved for support and reporting.

## Journey 3: Gas Fill-Up or EV Charging

### Actors

- Customer
- Valet manager
- Fuel or EV charging partner
- Payment provider

### Flow

1. Customer selects gas fill-up or EV charging from the service catalog.
2. App confirms eligibility, price rules, and expected timing.
3. Customer authorizes payment with any required deposit or estimated amount.
4. Valet manager approves vehicle release to partner or internal service team.
5. Partner records mileage, fuel level, or charging start state if required.
6. Partner completes service and uploads receipt or completion proof.
7. Final amount is captured if variable pricing applies.
8. Customer receives itemized receipt.
9. Session audit log records approvals, partner activity, and payment events.

### Success Criteria

- Vehicle movement outside the normal valet area is approved and traceable.
- Variable pricing is reconciled against proof.
- Customer receives clear service details and final receipt.

## Journey 4: Venue Manager Monitors Peak Demand

### Actors

- Venue manager
- Valet manager
- Valet staff

### Flow

1. Venue manager opens dashboard during a busy event or dinner rush.
2. Dashboard shows active vehicles, pickup queue, delayed vehicles, and average wait time.
3. Manager sees pickup wait time rising above target.
4. Valet manager reassigns runners and prioritizes blocked vehicles.
5. Dashboard updates as cars move through retrieval.
6. Manager reviews post-shift report for staffing and bottleneck analysis.

### Success Criteria

- Managers can identify the bottleneck during the rush.
- Staff action is visible in the activity feed.
- Post-shift data supports staffing decisions for future events.

## Journey 5: Damage or Missing Item Dispute

### Actors

- Customer
- Valet manager
- Support administrator

### Flow

1. Customer reports a damage concern or missing item from the app.
2. Support case is attached to the completed valet session.
3. Manager reviews check-in photos, handoff timestamps, staff actions, and internal notes.
4. Customer uploads additional photos or description.
5. Support administrator assigns responsibility, requests more information, or resolves the case.
6. Any refund, credit, or insurance action is recorded.

### Success Criteria

- Evidence is available in one place.
- Sensitive edits are audited.
- Customer receives transparent updates during resolution.

## Journey 6: Venue Onboarding

### Actors

- Crown Valet admin
- Venue owner
- Valet manager
- Service partners

### Flow

1. Admin creates venue profile, branding, parking zones, and operating hours.
2. Admin configures staff roles, service catalog, pricing, taxes, and payment rules.
3. Venue manager validates operational workflow with a test shift.
4. Service partners are invited and assigned to eligible services.
5. Staff are trained on check-in, parking, pickup, service requests, and incident handling.
6. Venue launches with live support and monitoring.

### Success Criteria

- Venue can process test valet sessions before launch.
- Staff understand role-specific workflows.
- Service and payment configuration is verified before customers use the system.
