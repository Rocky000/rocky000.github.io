# Md. Rockibul Islam Khan — 3D Portfolio

A single-page portfolio for a Senior DevOps & Cloud Platform Engineer, built with plain
HTML, CSS, and ES modules. The 3D work is [Three.js](https://threejs.org) loaded from a
CDN through an import map, so there is **no build step and no `npm install`**.

## Running it locally

Because the site uses ES modules and HTML partials, open it over HTTP (not as a file):

```bash
python3 serve.py
```

Then open <http://127.0.0.1:4173> and **hard-refresh** once (`Cmd+Shift+R`) so the browser drops any old cache.

`serve.py` sends `Cache-Control: no-store`, so after that, normal refresh shows your edits.

| What you edit | File |
|---|---|
| Section kickers, titles, notes | `js/data.js` → `sections` |
| Deck card size / angle / depth | `js/data.js` → `deckSettings` |
| Background photos / interval | `js/data.js` → `bgSlideshow` |
| Resume text, skills, jobs, projects, socials | `js/data.js` |
| Section shell / deck markup | `partials/<name>.html` |
| Colors / spacing | `css/style.css` |

## Project layout

```
index.html                 thin shell (meta + mount points + bg layers)
partials/                  one HTML file per page region — edit these
  icons.html               SVG icon sprite
  nav.html                 top nav + social rail
  hero.html                hero section
  about.html               about section
  skills.html              skills section
  experience.html          experience section
  projects.html            projects section
  credentials.html         education / certs / awards
  contact.html             contact section
  footer.html              footer
css/style.css              theme, layout, responsive rules, CSS 3D effects
js/data.js                 SINGLE EDIT POINT — sections, deckSettings, bgSlideshow, resume copy
js/load-partials.js        fetches and injects partials into the shell
js/main.js                 fills partials with data, nav, reveal, decks
js/bg-slideshow.js         full-viewport photo background crossfade
js/carousel-3d.js          landscape CSS-3D decks (skills, experience, projects, credentials)
js/scene-hero.js           WebGL particle field + wireframe core
assets/img/                optimized photos (background slideshow)
assets/resume/             downloadable resume
.github/workflows/         GitHub Pages deployment
```

## Editing content

| What you want to change | Where to edit |
|---|---|
| Section layout / headings / structure | `partials/<section>.html` |
| Resume text, skills, jobs, projects, socials | `js/data.js` |
| Rotating page background | `js/data.js` → `bgSlideshow` |
| Colors, spacing, responsive rules | `css/style.css` |
| Hero 3D scene | `js/scene-hero.js` |

Nearly all copy is data-driven. To change the summary, skills, jobs, projects,
certifications, or social links, edit [`js/data.js`](js/data.js). To change the
rotating background, edit `bgSlideshow.images` / `intervalMs` / `crossfadeMs` and
drop new files into `assets/img/`. Photos are background-only — there is no
foreground photo UI.

## The 3D pieces

**Hero** (`js/scene-hero.js`) — a 2,600-point particle field rendered with a custom shader,
plus a wireframe icosahedron wrapped in three orbiting rings. The whole group parallaxes
with the pointer and the camera eases back as you scroll.

**Background slideshow** (`js/bg-slideshow.js`) — scenic photos crossfade behind the whole
page. Respects `prefers-reduced-motion` by holding the first image.

The hero scene:

- falls back gracefully (CSS veil only) when WebGL is unavailable,
- stops its render loop when the tab is hidden or the canvas scrolls out of view,
- respects `prefers-reduced-motion` by rendering a single static frame,
- reduces particle counts on small screens.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` publishes the repository as-is on every
push to `main`. There is nothing to compile.

1. Create a repository on GitHub (for example `rocky000/portfolio`).
2. Push this directory to it.
3. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The site then goes live at `https://rocky000.github.io/portfolio/`. Naming the repository
`rocky000.github.io` instead publishes it at the root domain. All asset paths are relative,
so either option works without changes.
