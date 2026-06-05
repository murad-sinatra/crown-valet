# PowerPoint Export Notes

## Source File

The stakeholder deck content is maintained in [crown-valet-stakeholder-deck.md](crown-valet-stakeholder-deck.md).

## Recommended Export Approach

The current deck is written in Markdown so stakeholders can review the message before visual design work begins. After content approval, convert it into `.pptx` using one of these approaches:

1. Presentation software import: copy each slide section into PowerPoint, Keynote, or Google Slides.
2. Markdown-to-slides tooling: convert the Markdown into slides with a tool such as Marp or Pandoc.
3. Custom generated deck: use a script or presentation library to generate a branded `.pptx`.

## Slide Design Direction

### Visual Style

- Premium hospitality look.
- Clean dark or neutral background with gold, black, white, and deep navy accents.
- Large titles and short supporting copy.
- Minimal clutter.
- Use vehicle, valet, city, hotel, and service imagery where appropriate.

### Suggested Visuals

- Slide 2: Before/after comparison of manual valet versus digital valet.
- Slide 4: Product ecosystem diagram.
- Slide 5: Customer journey timeline.
- Slide 6: Valet team workflow.
- Slide 7: Dashboard mockup.
- Slide 8: Service marketplace cards.
- Slide 13: Architecture diagram.
- Slide 14: Roadmap timeline.
- Slide 16: Metrics dashboard.

## PowerPoint Structure

Create one PowerPoint slide for each `## Slide` section in the Markdown deck.

Recommended layout:

- Slide title at top.
- One central message per slide.
- No more than 3 to 6 bullets per content-heavy slide.
- Use icons or simple diagrams instead of dense paragraphs where possible.
- Keep the deck stakeholder-friendly and avoid implementation details unless the audience asks.

## Brand Notes

Suggested brand language:

- Premium
- Reliable
- Connected
- Effortless
- Transparent
- Hospitality-first

Avoid language that makes the platform sound like a parking utility only. Crown Valet should be positioned as a guest experience and operations platform.

## Export Checklist

- All slide titles match the Markdown source.
- The problem, solution, customer flow, venue value, revenue model, and roadmap are easy to follow.
- Technical details are summarized visually.
- The pilot MVP is clear.
- Next steps are action-oriented.
- The final `.pptx` uses consistent fonts, spacing, colors, and icon style.

## Future Automation Option

If the team wants repeatable exports, add a script that converts the Markdown deck into `.pptx` and stores generated files in a dedicated output folder. Generated `.pptx` files should be treated as build artifacts unless the team decides to version them.
