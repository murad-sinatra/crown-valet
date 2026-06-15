---
name: crown-valet-product
description: Guides Crown Valet product development, MVP planning, design system decisions, and feature implementation. Use when changing Crown Valet docs, building valet workflow features, designing product screens, planning MVP scope, or updating AI/project guidance.
---

# Crown Valet Product

## Start Here

Before changing product behavior, UI, or documentation, read the most relevant source documents:

- Product direction: `docs/product/vision.md`, `docs/product/features.md`, `docs/product/requirements.md`
- MVP scope: `docs/mvp/README.md`, `docs/mvp/scope.md`, `docs/mvp/implementation-phases.md`
- Technical direction: `docs/mvp/technical-stack.md`, `docs/mvp/data-schema.md`, `docs/technical/architecture.md`
- Execution plan: `docs/technical/feature-development-plan.md`
- UI guidance: `docs/product/design-system.md`

## Product Principles

- Build the reliable valet loop first: check-in, digital ticket, status visibility, pickup request, pickup queue, handoff, and manager visibility.
- Keep the MVP web-based in the existing Next.js app unless the user asks for a broader architecture change.
- Defer payments, add-on services, native apps, partner workflows, and advanced analytics until the core valet workflow is stable.
- Preserve customer trust by keeping status history, timestamps, and sensitive data boundaries clear.
- Make staff workflows fast, mobile-first, and practical for curbside use.

## Implementation Guidance

When adding product features:

1. Identify the product surface: marketing site, customer ticket, staff operations, manager dashboard, admin, or future partner tools.
2. Confirm the feature belongs in the current MVP. If not, document it as deferred rather than implementing it.
3. Use shared status constants and server-side transition validation for valet session state.
4. Create a session event for every important workflow change.
5. Keep customer ticket data separate from staff-only notes and exact internal location details.
6. Follow `docs/product/design-system.md` for colors, typography, components, responsive behavior, and accessibility.

## UX Defaults

- Customer screens should be calm, premium, and status-focused.
- Staff screens should show the next operational action clearly.
- Dashboard screens should prioritize live shift state over advanced analytics.
- Empty, loading, error, expired, cancelled, delayed, and completed states are required for pilot-facing flows.

## Documentation Updates

When product scope changes:

- Update the source product or MVP document first.
- Update `docs/technical/feature-development-plan.md` if build order, milestones, or deferred scope changes.
- Update `docs/product/design-system.md` when UI tokens, components, or interaction patterns change.
- Keep `docs/README.md` reading order current when adding major documentation.
