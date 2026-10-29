I'm redesigning my portfolio site (this repo). The full design handoff is in `design/portfolio-redesign/`:

- `DESIGN_SPEC.md` — tokens, page structure, interactions, motion, content rules
- `design-reference.html` — the approved design. It's written in a design-tool template format (`<x-dc>`, `<sc-for>`, `{{holes}}`, a `DCLogic` class). Treat it as a visual + content reference only; do NOT copy that runtime into the site. All copy and data are in `renderVals()` at the bottom of that file.
- `assets/` — screenshots that are already privacy-blurred. Use only these.

Please:

1. First, explore the repo and tell me the framework, styling approach, and how the current page is structured. Then propose a plan (components to create/replace, where tokens and data will live, where assets go) and wait for my OK before editing.
2. Rebuild the home page to match the design in this repo's existing stack and conventions:
   - Put design tokens in one place (CSS variables / theme config) and the case-study / experience / stack content in a typed data file, not hard-coded in markup.
   - Build reusable components: SectionHeader, ProjectCard (full-width + small variants), ScreenshotViewer (tabs + auto-advance), FlowSteps, CaseStudyDrawer, MetricCounter, Marquee.
   - Keep my existing SEO tags, analytics and any routes that aren't the home page.
3. Match the interactions in DESIGN_SPEC.md §2–§4 exactly, including: scroll-spy nav, mobile menu, count-up metrics, screenshot auto-advance that stops on click, case drawer (Esc / ←→ / focus return / scroll lock), Copy email, and `prefers-reduced-motion`.
4. Accessibility: real buttons/links, 44px touch targets, visible focus ring, alt text from the reference, text contrast ≥ 4.5:1.
5. Responsive: check 1440, 1024, 768 and 390 widths; no horizontal scroll.
6. When done, run the build and lint, start the dev server, and give me a short checklist of anything you couldn't match or that needs my input (portrait, LinkedIn/GitHub URLs, Support Portal stack — see §6).

Work on a new branch `redesign/portfolio` and commit in logical steps.
