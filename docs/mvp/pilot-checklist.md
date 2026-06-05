# MVP Pilot Checklist

## Purpose

This checklist defines what must be true before Crown Valet is tested in a simulated valet shift and before it is used in a controlled first venue pilot.

## Pre-Pilot Product Checklist

- Staff can log in.
- Staff can create a new valet session.
- Staff can enter customer contact details.
- Staff can enter vehicle details.
- Staff can assign or record key tag.
- System generates ticket number.
- System generates secure ticket token.
- Customer ticket link opens on mobile.
- Customer ticket shows correct vehicle and venue details.
- Staff can mark vehicle as parked.
- Staff can add parking location notes.
- Customer can request pickup.
- Pickup request appears in staff queue.
- Staff can mark vehicle as retrieving.
- Staff can mark vehicle as ready.
- Staff can close completed session.
- Customer ticket shows completed state after handoff.
- Session timeline records all major actions.

## Pre-Pilot Technical Checklist

- Production or pilot environment is deployed.
- Database migrations are applied.
- Seed venue exists.
- Staff users are created.
- Environment variables are configured.
- Ticket token generation is secure.
- Staff routes require authentication.
- Customer ticket route does not expose internal IDs.
- Notification provider is configured or intentionally disabled.
- Notification failures are logged.
- App error logging is accessible.
- Backup or export plan exists for pilot data.

## Mobile and Device Checklist

- Customer ticket works on current iPhone Safari.
- Customer ticket works on current Android Chrome.
- Staff check-in works on phone screen.
- Staff pickup queue works on phone screen.
- Venue dashboard works on tablet or laptop.
- Buttons are large enough for outdoor staff use.
- Pages remain readable in bright light.
- Network failure states are understandable.

## Simulated Shift Test

Run a complete simulated shift before involving real customers.

### Test Setup

- At least one venue.
- At least two staff users.
- At least five sample vehicles.
- At least one manager user.
- SMS test number or mocked notification mode.

### Test Flow

1. Staff logs in.
2. Staff checks in five vehicles.
3. Staff sends or opens ticket links.
4. Staff marks vehicles as parked with different parking notes.
5. Customer ticket pages are opened on mobile.
6. Three customers request pickup.
7. Staff processes the pickup queue.
8. One session is flagged as delayed.
9. One vehicle is marked ready.
10. One session is completed.
11. Manager reviews dashboard.
12. Team reviews session timelines.

### Pass Criteria

- No manual database edits are needed.
- Staff can understand the next action on each screen.
- Customer ticket statuses match staff updates.
- Pickup queue ordering is correct.
- Manager can identify active, ready, completed, and flagged sessions.
- Timeline records are accurate enough for operational review.

## Venue Pilot Readiness

Before a real venue launch:

- Venue operating hours are confirmed.
- Parking zones are configured.
- Staff list is confirmed.
- Manager access is confirmed.
- Valet stand device plan is confirmed.
- Backup paper ticket process is defined.
- Customer-facing ticket message is reviewed.
- Pickup area instructions are reviewed.
- Support contact path is defined.
- Pilot start and end times are defined.
- Pilot success metrics are agreed.

## Staff Training Checklist

Train staff on:

- Logging in
- Creating a check-in
- Sending or sharing ticket link
- Updating parked status
- Adding parking location
- Reading pickup queue
- Marking retrieving, ready, and completed
- Flagging a delayed or problem session
- Explaining the digital ticket to customers
- Using the backup process if needed

## Pilot Success Metrics

Track during the pilot:

- Total valet sessions
- Average check-in time
- Digital ticket delivery success rate
- Customer pickup requests through ticket page
- Average pickup wait time
- Number of flagged sessions
- Number of support issues
- Staff adoption feedback
- Customer feedback
- Manager feedback

## Known Limitations To Communicate

For the first MVP pilot, stakeholders should understand:

- No payment or tipping flow yet.
- No customer account or saved vehicle profile yet.
- No add-on services yet.
- No photo capture or damage claim workflow yet.
- No native mobile app yet.
- No advanced analytics yet.
- Location tracking is zone or note based, not live GPS.

## Go or No-Go Criteria

### Go

- Full simulated shift passes.
- Staff can use the system on pilot devices.
- Customer ticket links are reliable.
- Manager dashboard shows correct live state.
- Backup process is ready.

### No-Go

- Staff cannot complete check-in quickly.
- Pickup queue loses or duplicates requests.
- Customer ticket exposes incorrect session data.
- Token security is not ready.
- Team cannot recover from failed notifications.
- Pilot venue has not approved workflow and backup process.
