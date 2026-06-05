# Design System

## Design Intent

Crown Valet should feel premium, calm, and operationally clear. The visual system needs to work for luxury hospitality customers, fast-moving valet staff, venue managers, and future service partners.

The current landing page establishes the foundation: warm hospitality backgrounds, deep navy surfaces, gold accents, rounded cards, glass-like panels, large type, and mobile-first layouts.

## Product Personality

- Premium: polished, confident, and appropriate for hotels, restaurants, resorts, and luxury venues.
- Clear: status, next action, and responsibility should be obvious at a glance.
- Trustworthy: customers should feel their vehicle is traceable and protected.
- Fast: staff interfaces should reduce decision time during busy curbside operations.
- Configurable: venue branding can be layered in without breaking Crown Valet consistency.

## Color System

### Core Palette

| Token | Value | Usage |
| --- | --- | --- |
| `--color-ink` | `#111827` | Primary text, dark buttons, key UI anchors |
| `--color-navy` | `#141b2f` | Brand mark, premium dark surfaces |
| `--color-navy-soft` | `#29334f` | App preview and elevated dark gradients |
| `--color-gold` | `#f5c76b` | Brand accent, route highlights, active icons |
| `--color-gold-deep` | `#a66f18` | Eyebrows, labels, accent text |
| `--color-paper` | `#fff9ef` | Warm page backgrounds |
| `--color-sand` | `#f7f2ea` | Root background and neutral warmth |
| `--color-muted` | `#596477` | Secondary text |
| `--color-line` | `rgba(17, 24, 39, 0.1)` | Light borders |
| `--color-success-bg` | `#e9f7ef` | Success badges |
| `--color-success` | `#1c7d43` | Success text |

### Status Colors

Use color plus text labels or icons. Never rely on color alone.

| Status | Recommended Treatment |
| --- | --- |
| Checked in | Navy badge with gold accent |
| Parked | Neutral badge with clear timestamp |
| Pickup requested | Gold badge or queue highlight |
| Retrieving | Navy active badge |
| Ready | Success badge |
| Completed | Muted neutral badge |
| Delayed or flagged | Warm warning treatment with explicit reason |
| Cancelled | Muted treatment with audit trail |

## Typography

### Font Stack

Use the existing system stack:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

### Type Scale

- Display: large marketing headlines, `clamp(3.8rem, 8vw, 6.8rem)`, tight line height.
- Section heading: `clamp(2.4rem, 5vw, 4.5rem)`, tight letter spacing.
- Page title: 2rem to 3rem depending on surface.
- Card title: 1.25rem to 1.5rem.
- Body: 1rem to 1.125rem, line height around 1.6.
- Metadata: 0.875rem.
- Eyebrow: uppercase, bold, increased letter spacing.

### Content Rules

- Use short action-first labels for staff workflows.
- Use calm customer language for ticket states: "Your vehicle is being retrieved" instead of internal operational terms.
- Use exact timestamps where trust matters.
- Avoid vague states such as "processing" when a more specific status is available.

## Layout

### Grid and Width

- Use `max-width: 1180px` for marketing and dashboard content.
- Use responsive grids that collapse to one column below 900px.
- Use narrow, focused layouts for mobile ticket and staff task screens.

### Spacing

- Page sections: 72px to 96px vertical spacing on desktop.
- Mobile page padding: 18px to 20px.
- Card gap: 16px to 24px.
- Form field gap: 14px to 18px.
- Action groups: 12px to 16px.

### Surfaces

Use rounded, elevated cards for grouped information:

- Standard card radius: 24px to 30px.
- Large feature or CTA radius: 34px to 42px.
- Mobile app frame radius: 36px to 44px.
- Prefer subtle borders with warm translucent backgrounds.
- Use stronger shadows for marketing depth and lighter shadows for product dashboards.

## Components

### Buttons

Primary buttons:

- Dark navy background.
- White text.
- Rounded pill shape.
- Bold label.
- Minimum touch height of 44px, preferably 48px or larger on mobile.

Secondary buttons:

- Light translucent background.
- Subtle border.
- Dark text.
- Same shape and height as primary buttons.

Destructive or risky actions:

- Avoid making destructive actions look like primary progress actions.
- Require clear labels such as "Cancel pickup" or "Flag issue".

### Cards

Use cards for:

- Active session summaries.
- Vehicle status.
- Pickup queue items.
- Dashboard metrics.
- Service jobs.
- Support and incident context.

Each operational card should make the next action visible without requiring the user to open details.

### Badges

Badges should communicate status, role, priority, or eligibility.

- Use compact rounded pills.
- Pair status color with readable text.
- Keep badge labels consistent with shared status constants.

### Forms

Staff forms should be fast and forgiving:

- Group fields by customer, vehicle, ticket/key, and operational notes.
- Keep required fields obvious.
- Use large inputs and controls for mobile use.
- Validate before submit and keep error copy specific.
- Do not ask staff to enter data that can be generated safely, such as ticket tokens.

### Timeline

The session timeline is central to trust and auditability.

Show:

- Status label.
- Actor or source when appropriate.
- Timestamp.
- Short note or reason when present.

Hide staff-only notes on customer ticket pages.

### Empty and Error States

Operational screens need clear empty states:

- Active sessions: "No active vehicles right now."
- Pickup queue: "No pickup requests waiting."
- Dashboard: "No sessions recorded for this shift yet."
- Ticket error: "This ticket link is invalid or expired."

Errors should include a recovery action when possible.

## Accessibility

- Maintain strong contrast for text, buttons, and status labels.
- Do not communicate status by color alone.
- Use semantic headings and landmarks.
- Keep touch targets at least 44px tall.
- Ensure ticket and staff flows work on mobile screens.
- Support keyboard navigation for dashboard and admin flows.

## Responsive Behavior

### Customer Ticket

- Design mobile-first.
- Keep current status, pickup action, and vehicle summary above the fold.
- Move timeline and support actions below the primary status area.

### Staff Operations

- Design for phone-sized screens first.
- Use stacked cards and persistent primary actions.
- Avoid dense tables for active operational tasks.

### Dashboard

- Desktop can use grids and denser metrics.
- Mobile dashboard should prioritize active issues, queue state, and search.

## Implementation Guidance

- Extract repeated CSS values into design tokens before building many routes.
- Create reusable Vue components for buttons, cards, badges, form fields, timelines, and page shells.
- Keep product components data-driven so status labels and badge variants come from shared domain constants.
- Prefer local component composition over a large component abstraction until repeated patterns are clear.
- Use this document as the source of truth for new product screens.

## Initial Component Backlog

- `BaseButton`
- `BaseCard`
- `StatusBadge`
- `MetricCard`
- `SessionTimeline`
- `VehicleSummaryCard`
- `PickupQueueItem`
- `FormField`
- `PageHeader`
- `EmptyState`
- `ErrorState`
