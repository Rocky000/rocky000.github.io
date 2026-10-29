# Md. Rockibul Islam Khan — portfolio

A single-page portfolio for a Senior DevOps & Cloud Platform Engineer, built with plain
HTML, CSS, and ES modules. There are **no dependencies and no `npm install`**: a small Node
script prerenders the page from `js/data.js`, so every section is in the HTML on first paint
and JavaScript only adds enhancements (mobile menu, scroll-spy nav, count-up metrics,
screenshot viewer, case-study drawer, copy email, command palette).

## Running it locally

Because the site uses ES modules, open it over HTTP (not as a file):

```bash
python3 serve.py
```

Then open <http://127.0.0.1:4173> and **hard-refresh** once (`Cmd+Shift+R`) so the browser drops any old cache.

`serve.py` sends `Cache-Control: no-store`, so after that, normal refresh shows your edits.

| What you edit | File |
|---|---|
| Section kickers, titles, notes | `js/data.js` → `sections` |
| Hero headline, rotating words, intro, CTAs | `js/data.js` → `hero` |
| Status board in the hero | `js/data.js` → `statusBoard` |
| Tool marquee | `js/data.js` → `tools` |
| Metrics band (99.95%, −20%, …) | `js/data.js` → `metrics` |
| Case studies (cards + drawer), screenshots | `js/data.js` → `caseStudies` |
| Experience, approach, stack, about, socials | `js/data.js` |
| Components and section markup | `js/render.js` (`projectCard`, `screenshotViewer`, `flowSteps`, `caseStudyDrawer`, … plus one `render*` per region) |
| Page order / slots | `partials/page.html` |
| Colours / type / spacing / breakpoints | `css/style.css` (design tokens on `:root`) |

`js/data.js` is typed with JSDoc (`CaseStudy`, `FlowStep`, …), so editors flag a missing field
without a build step.

After **any** edit to `js/data.js`, `js/render.js`, `partials/` or an asset, rebuild:

```bash
node scripts/build-index.mjs
```

The build fills each `<!-- render:name -->` and `<!-- partial:file -->` slot in
`partials/page.html`, then appends a content hash to every local asset URL
(`css/style.css?v=3f2a…`). Changed files get a new URL, so they can be cached
forever. The build fails if a referenced asset is missing. Commit the regenerated `index.html`.

## Project layout

```
index.html                 GENERATED — do not edit by hand
partials/page.html         page skeleton with render/partial slots
partials/palette.html      command palette shell
partials/icons.html        inline SVG sprite
scripts/build-index.mjs    prerender + head/SEO + asset hashing
css/style.css              design tokens, layout, responsive, reduced motion
js/data.js                 SINGLE EDIT POINT — all copy and data (JSDoc-typed)
js/render.js               pure HTML components/templates (run at build time, no DOM)
js/main.js                 enhancements only: menu, scroll-spy, metrics, viewer, drawer, palette
assets/fonts/              self-hosted Geist, Geist Mono, Lexend (latin, variable woff2)
assets/img/                logo, headshot (AVIF/JPEG 560/840), icons, photos
assets/img/work/           privacy-blurred case-study screenshots (WebP)
assets/resume/             resume PDF
.github/workflows/         GitHub Pages deployment
```

Press `/` or `Cmd/Ctrl+K` for the command palette (jump, copy email, open socials).

## Case-study drawer

Each case study's drawer content is prerendered into a `<template id="tpl-case-…">`; the drawer
clones it on open, so its screenshots load only when needed. Links to `#case-portal`,
`#case-changelog`, `#case-pos`, `#case-jenkins`, `#case-cost` or `#case-hipaa` open that case
directly. Old anchors (`#projects`, `#skills`, `#home`) redirect to their new sections.

## Performance notes

- No render-blocking third parties: fonts are self-hosted, and only Geist is preloaded.
- The About portrait is a 24 KB AVIF with explicit dimensions, lazy-loaded.
- All motion respects `prefers-reduced-motion`.
- Hosts that serve this site should send `Cache-Control: public, max-age=31536000, immutable`
  for `/assets/`, `/css/` and `/js/` (URLs are content-hashed) and `no-cache` for `index.html`.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` publishes the repository as-is on every
push to `main`. There is nothing to compile.
