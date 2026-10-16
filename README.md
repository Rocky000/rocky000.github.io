# Md. Rockibul Islam Khan — portfolio

A single-page portfolio for a Senior DevOps & Cloud Platform Engineer, built with plain
HTML, CSS, and ES modules. There are **no dependencies and no `npm install`**: a small Node
script prerenders the page from `js/data.js`, so every section is in the HTML on first paint
and JavaScript only adds enhancements (mobile menu, active nav, command palette).

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
| Hero headline, lead, CTAs, photo | `js/data.js` → `hero` |
| Metrics band (99.95%, ~20%, …) | `js/data.js` → `highlights` |
| Case studies, approach rules | `js/data.js` → `caseStudies`, `approach` |
| Resume text, skills, jobs, projects, socials | `js/data.js` |
| Section markup | `js/render.js` (one `render*` function per region) |
| Page order / slots | `partials/page.html` |
| Colors / spacing / breakpoints | `css/style.css` |

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
js/data.js                 SINGLE EDIT POINT — copy and resume data
js/render.js               pure HTML templates (run at build time, no DOM)
js/main.js                 enhancements only: menu, active nav, sticky CTA, palette
assets/fonts/              self-hosted Syne + DM Sans (latin, woff2)
assets/img/                headshot (AVIF/JPEG 560/840), icons, photos
assets/resume/             resume PDF
.github/workflows/         GitHub Pages deployment
```

Press `/` or `Cmd/Ctrl+K` for the command palette (jump, copy email, open socials).

## Performance notes

- No render-blocking third parties: fonts are self-hosted, and only Syne is preloaded.
- The hero photo is a 24 KB AVIF with explicit dimensions. Phones skip it entirely.
- All motion respects `prefers-reduced-motion`.
- Hosts that serve this site should send `Cache-Control: public, max-age=31536000, immutable`
  for `/assets/`, `/css/` and `/js/` (URLs are content-hashed) and `no-cache` for `index.html`.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` publishes the repository as-is on every
push to `main`. There is nothing to compile.
