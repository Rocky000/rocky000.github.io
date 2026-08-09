# CloFix / Cloudflare WAF support ticket

**Subject:** HTTP/2 stream failures on parallel `/partials/*.html` fetches behind WAF (apex `rockibul.info`)

## Summary

Our static portfolio on GitHub Pages works on `https://portfolio.rockibul.info`, but the same origin content behind CloFix on `https://rockibul.info` intermittently fails during page boot. The browser reports `net::ERR_HTTP2_PROTOCOL_ERROR` on multiple `/partials/*.html` requests; the page often stays blank (black) or only shows fragments (e.g. footer).

We confirmed with a single-file static probe (no parallel partial fetches) that **HTML delivery through CloFix works**. The failure correlates with a burst of same-origin HTML fetches at load time (often waiting >15s before failing).

## Evidence

| Case | URL / behavior | Result |
|------|----------------|--------|
| Control (GitHub Pages hostname) | `https://portfolio.rockibul.info` | Portfolio loads |
| CloFix + multi-partial boot | `https://rockibul.info` loading `/partials/*.html` in parallel with cache-bust query params | Random partial failures, `ERR_HTTP2_PROTOCOL_ERROR`, blank page |
| CloFix + static probe | `https://rockibul.info/` single HTML, no `partials/*` fetches | Loads quickly and reliably |

### Browser console (representative)

```
Failed to load resource: net::ERR_HTTP2_PROTOCOL_ERROR
/partials/skills.html?t=…
/partials/credentials.html?t=…
/partials/contact.html?t=…
…

Failed to load page data/partials. TypeError: Failed to fetch
    at fetchPartial (load-partials.js)
```

## What we are asking CloFix to check

1. HTTP/2 multiplexed stream resets or protocol errors between edge and origin (GitHub Pages) for small HTML assets.
2. WAF / bot / rate-limit rules that may throttle or kill parallel same-origin GETs to `/partials/*` (especially with unique `?t=` query strings and `cache: no-store`).
3. Origin or proxy timeouts around **>15 seconds** that abort slow streams.
4. Any difference in policy between apex `rockibul.info` and `portfolio.rockibul.info`.

## Client mitigation (in progress)

We are hardening the site so production no longer depends on ~10 parallel partial HTML fetches at boot (sections inlined into `index.html`). Please still investigate the edge/WAF behavior so other assets and future apps are not affected similarly.

## Contacts / hosts

- Apex (CloFix): `https://rockibul.info/`
- Direct Pages control: `https://portfolio.rockibul.info/`
- Origin: GitHub Pages (`Rocky000/rocky000.github.io`)
