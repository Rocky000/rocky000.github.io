# Portfolio redesign — implementation spec

Source of truth for layout, copy and data: `design-reference.html`.
It is written in a design-tool template format (`<x-dc>`, `<sc-for>`, `<sc-if>`, `{{holes}}`, a `class Component extends DCLogic` block). **Do not ship that runtime.** Translate it into the site's own framework and components. All copy and data live in `renderVals()` at the bottom of that file — extract from there rather than retyping.

## 1. Design tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0B0D` | page background |
| `--surface` | `#111316` | cards |
| `--surface-2` | `#16191D` | inner panels, chips, screenshot frames |
| `--surface-rule` | `#0E1013` | Approach cards, case drawer |
| `--border` | `#1F2328` | card borders |
| `--border-strong` | `#2A2F35` | buttons, chips, dashed dividers |
| `--divider` | `#1C1F23` | section rules |
| `--text` | `#ECEDEE` | primary text |
| `--text-2` | `#C4C8CC` | body in cards, list items |
| `--muted` | `#9BA1A6` | secondary text |
| `--subtle` | `#7D848B` | labels, mono meta (lowest allowed text contrast) |
| `--accent` | `#C6F432` | single accent (lime). Alternates tested: `#5EE6D0`, `#FF8A3D`, `#8AB4FF` |
| `--on-accent` | `#0A0B0D` | text on accent |
| POS orange | `#F39C12` | only inside POS UI replicas |

Type: **Geist** (UI/headings, 300–700) + **Geist Mono** (labels, meta, kickers). **Lexend** only inside the rebuilt POS bell/details replicas.
- H1: `clamp(52px, 8.6vw, 128px)`, weight 600, letter-spacing −0.055em, line-height 1.02
- H2 (section): `clamp(38px, 5.4vw, 72px)`, 600, −0.045em, line-height 1
- Big card title: `clamp(24px, 2.6vw, 34px)`, 600, −0.03em
- Small card title: `clamp(22px, 2vw, 26px)`
- Section kicker: Geist Mono 13px accent, format `01 — Selected work`
- Card meta row: Geist Mono 12px; tags in accent left, `Company · years` in `--subtle` right

Radii: cards 24px · inner frames 12–18px · contact block 32px · pills 999px.
Layout: content `max-width: 1200px`, side padding 24px. Section gap: **128px** top padding on every section (Approach uses 56px because the Experience timeline ends with 72px).
Touch targets ≥ 44px. Focus ring: `2px solid var(--accent)`, offset 3px.

## 2. Page structure (in order)

1. **Scroll progress bar** — 2px accent bar fixed at top, scaleX driven by page scroll.
2. **Nav** — floating glass pill, sticky `top: 16px`. Logo `rk` tile + "rockibul". Links: Work, Experience, Approach, Stack, About (active link highlighted via scroll-spy). "Let's talk" accent button → #contact. ≤760px: links hidden, menu button opens a full-width dropdown panel; tapping a link closes it.
3. **Hero** — kicker pill with pulsing dot · H1 "I make production" + rotating word (boring. / cheaper. / faster. / calmer. → loops) + blinking caret · intro paragraph · CTAs "See the work" (accent) / "Get in touch" (ghost) · mono facts row. Right: floating **status board** (uptime bars grow in, 5 service rows, `$ kubectl get platforms · 5/5 healthy_`). Background: masked dot grid + slow drifting accent glow.
4. **Tool marquee** — infinite horizontal scroll, pauses on hover, edge-faded.
5. **Metrics band** — 4 cells; numbers count up once when scrolled into view (99.95%, −20%, −60%, 30+).
6. **01 — Selected work** ("Six systems I built and run." — newest first):
   - **Support Portal** (featured, full-width): meta row with NEW pill, title + paragraph left, two stats right; tabbed screenshot viewer (7 tabs, auto-advances every 5s with a progress bar under the active tab, clicking a tab stops auto-advance; tabs scroll horizontally on small screens); caption below; feature chips; "Read the case study".
   - **Changelogs** (full-width): header + stats; 3-step flow with arrows: (1) admin form screenshot → (2) POS bell → (3) details. Steps 2–3 are **HTML replicas with sample content**, not screenshots (see §5).
   - **Emergency messages** (full-width): header + stats; 3-step flow of screenshots: send form → POS locked (with pulsing "locked" pill) → message logs.
   - **Bento row**: Jenkins platform · Cost & observability · HIPAA on EKS — 3 equal columns (stack to 1 column ≤900px). Each: meta, title, one-line summary, two results over a dashed divider, "Read the case study".
   - **Also shipped** chip row.
7. **02 — Experience** — vertical timeline; line fills with accent as you scroll; "Current role" pill on Katria.
8. **03 — Approach** — 3 rule cards (outlined numbers 01–03, title, body, accent proof line).
9. **04 — Stack** — table rows: mono category + tools; row hover highlights category in accent.
10. **05 — About** — portrait placeholder (4:5), facts, statement paragraph, credentials list.
11. **06 — Contact** — accent block, rotating "LET'S TALK" badge (hidden ≤760px), H2 "Let's make your production boring.", email button + **Copy email** button (shows "Copied" for 2s), phone/LinkedIn/GitHub.
12. **Footer** — © line, "Back to top", giant outlined "rockibul" wordmark.

## 3. Case study drawer

- Opens from any project card (whole card is clickable for the small/full-width cards; the Support Portal card opens only from its button so its tabs stay usable).
- Right-side panel `width: min(620px, 100%)`, dim + blur scrim; scrim click closes.
- Content: tags, company/years, title, two result tiles, **How it works** gallery (where present), The problem, What I did (numbered), Stack chips.
- Footer: Previous / `n / 6` / Next — order matches the page order.
- Keyboard: **Esc** closes, **←/→** previous/next. Focus moves to the close button on open and returns to the triggering card on close. Lock page scroll while open. `role="dialog"`, `aria-modal="true"`.

## 4. Motion

- Easing everywhere: `cubic-bezier(.16,1,.3,1)`.
- Hero load: lines slide up (staggered 0.3s / 0.42s), body fades up at 0.7s, status board at 0.85s, bars grow staggered from 1.0s.
- Scroll reveals: fade-up 20px using CSS scroll-driven animations (`animation-timeline: view()`), wrapped in `@supports` so unsupported browsers just show content.
- Hover: project cards — accent-tinted border + soft top glow; **small bento cards also lift 4px**; big cards and Approach cards do not lift. Approach outlined numbers turn accent on hover. Buttons lift 2px; arrow icons nudge.
- Honour `prefers-reduced-motion: reduce` — disable all animation/transition, show final metric values, stop screenshot auto-advance.

## 5. Content rules

- **Sensitive data is already blurred in `assets/`** (endpoints, handlers, request IDs, IPs, device IDs, cities, colleague names/emails, partner names, internal error codes). Use these files only — never the original screenshots.
- POS bell + details in the Changelog card are rebuilt in HTML with **sample** notes (Split Bill by Seat, Quick Discount Shortcut, Faster Table Transfer, Kitchen Notes on Receipts). Keep the "sample changelogs" footnote.
- Emergency-message screenshots show test messages; keep the "test messages · emails and screen names blurred" note.

## 6. Still to fill in (owner)

- Real portrait (4:5) for About.
- Real LinkedIn and GitHub profile URLs (currently placeholders to the site home pages).
- Support Portal tech stack (drawer currently lists UX design / Frontend / Backend / Role-based access).
- Confirm the Changelog stack (currently WebSocket, Node.js, React, AWS).

## 7. Assets

| File | Used in |
|---|---|
| `assets/support-portal/overview.webp` … `guide.webp` (7) | Support Portal viewer tabs, in order: overview, logs, detail, incidents, traffic, devices, guide. Drawer gallery uses overview, detail, guide. |
| `assets/changelog/admin-form.webp` | Changelog step 1 |
| `assets/emergency-messages/1-send.webp`, `2-pos-locked.webp`, `3-logs.webp` | Emergency flow + drawer gallery |
