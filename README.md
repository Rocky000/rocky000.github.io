# Md. Rockibul Islam Khan — cinematic portfolio

A single-page portfolio for a Senior DevOps & Cloud Platform Engineer, built with plain
HTML, CSS, and ES modules. Motion uses [GSAP](https://gsap.com) + [Lenis](https://github.com/darkroomengineering/lenis)
from a CDN through an import map, so there is **no build step and no `npm install`**.

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
| Hero typewriter roles | `js/data.js` → `heroRoles` |
| Hero photo plates / interval | `js/data.js` → `bgSlideshow` |
| Resume text, skills, jobs, projects, socials | `js/data.js` |
| Section shell markup | `partials/<name>.html` |
| Colors / spacing | `css/style.css` |

After editing partials, regenerate the inlined page:

```bash
node scripts/build-index.mjs
```

## Project layout

```
index.html                 generated shell (meta + inlined partials)
partials/                  one HTML file per page region — edit these
css/style.css              cinematic theme, sticky stack, marquee, responsive
js/data.js                 SINGLE EDIT POINT — copy, roles, photos, resume data
js/main.js                 hydrates the DOM, nav, command palette, counters
js/motion.js               Lenis + GSAP ScrollTrigger, cursor, magnetic CTAs
js/bg-slideshow.js         hero Ken Burns plates (not a full-page wallpaper)
assets/img/                hero / project plate photos
assets/resume/             downloadable resume
.github/workflows/         GitHub Pages deployment
```

Press `/` or `Cmd/Ctrl+K` for the command palette (jump, copy email, open socials).

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` publishes the repository as-is on every
push to `main`. There is nothing to compile.
