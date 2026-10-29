/**
 * Pure HTML templates for every page region. No DOM access, so
 * scripts/build-index.mjs can run them in Node and ship finished markup.
 * Region functions take the module namespace exported by js/data.js;
 * the reusable components below take plain values.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

const icon = (id, cls = 'icon') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"></use></svg>`;

const external = (url) => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;
const newTab = '<span class="sr-only"> (opens in a new tab)</span>';

const list = (items, fn) => items.map(fn).join('');
const chips = (items, cls = 'chip') => `<ul class="chips">${list(items, (t) => `<li class="${cls}">${esc(t)}</li>`)}</ul>`;

/* ------------------------------------------------------------ Components --- */

/** Mono kicker + H2, with an optional note or action on the right. */
export function sectionHeader({ id, kicker, title, note = '', aside = '' }) {
  return `
    <header class="section__head reveal">
      <div class="section__titles">
        <p class="kicker">${esc(kicker)}</p>
        <h2 class="section__title" id="${id}-title">${esc(title)}</h2>
      </div>
      ${note ? `<p class="section__note">${esc(note)}</p>` : ''}${aside}
    </header>`;
}

/** Final value is prerendered; main.js counts up to it once in view. */
export function metricCounter(m) {
  const decimals = m.decimals ?? 0;
  const prefix = m.prefix ?? '';
  const suffix = m.suffix ?? '';
  return `
      <li class="metric">
        <p class="metric__key">${esc(m.key)}</p>
        <p class="metric__value" data-count="${m.value}" data-decimals="${decimals}" data-prefix="${esc(prefix)}" data-suffix="${esc(suffix)}">${esc(prefix + m.value.toFixed(decimals) + suffix)}</p>
        <p class="metric__label">${esc(m.label)}</p>
      </li>`;
}

/** The list is rendered twice so translateX(-50%) loops seamlessly; the copy is hidden from AT. */
export function marquee(items, label) {
  const row = (hidden) =>
    `<ul class="marquee__group"${hidden ? ' aria-hidden="true"' : ''}>${list(items, (t) => `<li>${esc(t)}${icon('spark', 'icon marquee__mark')}</li>`)}</ul>`;
  return `
<section class="marquee" aria-label="${esc(label)}">
  <div class="marquee__track">${row(false)}${row(true)}</div>
</section>`;
}

const results = (items, cls) => `
      <dl class="${cls}">
        ${list(items, (r, i) => `<div class="${cls}-item"><dt class="${i === 0 ? 'is-accent' : ''}">${esc(r.value)}</dt><dd>${esc(r.label)}</dd></div>`)}
      </dl>`;

const caseMeta = (c) => `
        <p class="card__meta">
          <span class="card__tags">${c.isNew ? '<span class="pill-new">New</span>' : ''}${esc(c.tags)}</span>
          <span class="card__where">${esc(c.where)}</span>
        </p>`;

const readButton = (c, stretch) =>
  `<button type="button" class="card__go${stretch ? ' card__go--stretch' : ''}" data-case-open="${c.id}" aria-haspopup="dialog">Read the case study<span class="sr-only">: ${esc(c.title)}</span>${icon('arrow')}</button>`;

/** POS UI replicas (sample content), used in the Changelog flow and drawer. */
function posBell(notes, compact) {
  return `
          <div class="pos${compact ? ' pos--compact' : ''}">
            <p class="pos__bar">Notifications<span aria-hidden="true">×</span></p>
            ${list(notes, (n, i) => `
            <div class="pos__note${n.isNew ? ' is-new' : ''}${compact && i === 0 ? ' pos__note--arrive' : ''}">
              <p class="pos__title">${n.isNew ? '<span class="pos__dot"></span>' : ''}<span class="pos__clip">${esc(n.title)}</span></p>
              <p class="pos__desc">${esc(n.desc)}</p>
              <p class="pos__date">${esc(n.date)}</p>
            </div>`)}
          </div>`;
}

function posDetail(detail, compact) {
  return `
          <div class="pos pos--detail${compact ? ' pos--compact' : ''}">
            <p class="pos__bar">Notification Details<span aria-hidden="true">×</span></p>
            <div class="pos__body">
              <p class="pos__title">${esc(detail.title)}</p>
              <p class="pos__date">${esc(detail.date)}</p>
              <p class="pos__text">${esc(detail.body)}</p>
            </div>
          </div>`;
}

/** One picture: a real screenshot, or a replica wrapped as role="img" (children are presentational). */
function figureArt(f, d, { compact = false, lazy = true } = {}) {
  if (f.type === 'image') {
    return `<img src="${f.src}" alt="${esc(f.alt)}" width="${f.width}" height="${f.height}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
  }
  const art = f.type === 'posBell'
    ? posBell(compact ? d.posSample.notes.slice(0, 3) : d.posSample.notes, compact)
    : posDetail(d.posSample.detail, compact);
  return `<div class="replica" role="img" aria-label="${esc(f.alt)}">${art}</div>`;
}

/** Numbered 1 → 2 → 3 flow on full-width cards. */
export function flowSteps(steps, d) {
  const mixed = steps.some((s) => s.type !== 'image');
  return `
      <ol class="flow${mixed ? ' flow--replica' : ''}">
        ${list(steps, (s, i) => `
        <li class="flow__item">
          <figure class="flow__step">
            <figcaption class="flow__label"><span class="flow__n" aria-hidden="true">${i + 1}</span><span class="sr-only">Step ${i + 1}: </span>${esc(s.label)}</figcaption>
            <div class="flow__frame">
              ${figureArt(s, d, { compact: true })}
              ${s.live ? '<span class="flow__live"><span class="dot dot--pos pulse" aria-hidden="true"></span>locked</span>' : ''}
            </div>
          </figure>
          ${i < steps.length - 1 ? icon('arrow', 'icon flow__arrow hide-sm') : ''}
        </li>`)}
      </ol>`;
}

/** Tabbed screenshots; main.js auto-advances every 5 s until a tab is clicked. */
export function screenshotViewer(shots, id) {
  return `
      <div class="viewer" data-viewer>
        <div class="viewer__glow" aria-hidden="true"></div>
        <div class="viewer__window">
          <div class="viewer__bar">
            <span class="viewer__lights hide-sm" aria-hidden="true"><span></span><span></span><span></span></span>
            <div class="viewer__tabs" role="group" aria-label="Portal screens">
              ${list(shots, (s, i) => `<button type="button" class="viewer__tab${i === 0 ? ' is-active' : ''}" aria-pressed="${i === 0}" aria-controls="${id}-shot-${i}" data-shot="${i}">${esc(s.label)}<span class="viewer__progress" aria-hidden="true"></span></button>`)}
            </div>
            <span class="viewer__live hide-sm"><span class="dot pulse" aria-hidden="true"></span>live in production</span>
          </div>
          <div class="viewer__stage">
            ${list(shots, (s, i) => `<img class="viewer__shot${i === 0 ? ' is-active' : ''}" id="${id}-shot-${i}" src="${s.src}" alt="${esc(s.alt)}" width="1910" height="993" loading="lazy" decoding="async"${i === 0 ? '' : ' aria-hidden="true"'}>`)}
          </div>
        </div>
        <p class="viewer__foot">
          ${list(shots, (s, i) => `<span class="viewer__caption" data-caption="${i}"${i === 0 ? '' : ' hidden'}>${esc(s.caption)}</span>`)}
          <span class="viewer__note">Sensitive data blurred</span>
        </p>
      </div>`;
}

/** A case-study card: full-width (featured / flow) or small (bento). */
export function projectCard(c, d) {
  if (c.variant === 'small') {
    return `
      <article class="card card--small lift reveal" id="${c.id}" aria-labelledby="${c.id}-title">
        ${caseMeta(c)}
        <h3 class="card__title card__title--small" id="${c.id}-title">${esc(c.title)}</h3>
        <p class="card__summary">${esc(c.summary)}</p>
        ${results(c.results, 'card__results')}
        ${readButton(c, true)}
      </article>`;
  }
  const featured = c.variant === 'featured';
  const stats = c.cardResults || c.results;
  return `
      <article class="card card--full reveal" id="${c.id}" aria-labelledby="${c.id}-title">
        <div class="card__head">
          <div class="card__intro">
            ${caseMeta(c)}
            <h3 class="card__title" id="${c.id}-title">${esc(c.cardTitle || c.title)}</h3>
            <p class="card__summary">${esc(c.summary)}</p>
          </div>
          ${results(stats, 'card__stats')}
        </div>
        ${featured ? screenshotViewer(c.shots, c.id) : flowSteps(c.flow, d)}
        ${featured ? chips(c.features) : `<p class="card__note">${esc(c.flowNote)}</p>`}
        ${readButton(c, !featured)}
      </article>`;
}

/** Drawer content for one case, prerendered into a <template>. */
function caseDrawerBody(c, d, i) {
  const mixed = (c.gallery || []).some((g) => g.type !== 'image');
  const gallery = c.gallery
    ? `
      <section class="drawer__block" aria-label="How it works">
        <p class="drawer__label">How it works</p>
        <div class="gallery${mixed ? ' gallery--replica' : ''}">
          ${list(c.gallery, (g) => `
          <figure class="gallery__item">
            ${figureArt(g, d)}
            <figcaption>${esc(g.label)}</figcaption>
          </figure>`)}
        </div>
        <p class="drawer__fine">${esc(c.galleryNote)}</p>
      </section>`
    : '';
  return `
<template id="tpl-${c.id}" data-tags="${esc(c.tags)}" data-title="${esc(c.title)}" data-index="${i}">
      <div class="drawer__intro">
        <p class="drawer__where">${esc(c.where)}</p>
        <h2 class="drawer__title" id="drawerTitle">${esc(c.title)}</h2>
      </div>
      ${results(c.results, 'drawer__results')}
      ${gallery}
      <section class="drawer__block" aria-labelledby="drawerProblem">
        <h3 class="drawer__label" id="drawerProblem">The problem</h3>
        <p class="drawer__problem">${esc(c.problem)}</p>
      </section>
      <section class="drawer__block" aria-labelledby="drawerDid">
        <h3 class="drawer__label" id="drawerDid">What I did</h3>
        <ol class="drawer__steps">
          ${list(c.steps, (t, n) => `<li><span class="drawer__n" aria-hidden="true">${String(n + 1).padStart(2, '0')}</span><span>${esc(t)}</span></li>`)}
        </ol>
      </section>
      <section class="drawer__block" aria-labelledby="drawerStack">
        <h3 class="drawer__label" id="drawerStack">Stack</h3>
        ${chips(c.stack)}
      </section>
</template>`;
}

/** One dialog shell; main.js fills it from the templates. Hidden until opened. */
export function caseStudyDrawer(d) {
  const total = d.caseStudies.length;
  return `
<div class="drawer" id="caseDrawer" hidden>
  <button type="button" class="drawer__scrim" data-drawer-close tabindex="-1" aria-label="Close case study"></button>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
    <header class="drawer__top">
      <p class="drawer__tags" id="drawerTags"></p>
      <button type="button" class="icon-btn" id="drawerClose" data-drawer-close aria-label="Close case study">${icon('close')}</button>
    </header>
    <div class="drawer__body" id="drawerBody" tabindex="-1"></div>
    <footer class="drawer__foot">
      <button type="button" class="btn btn--ghost btn--sm" data-drawer-step="-1">${icon('arrow-left')}Previous<span class="sr-only"> case study</span></button>
      <span class="drawer__count" id="drawerCount" aria-live="polite">1 / ${total}</span>
      <button type="button" class="btn btn--ghost btn--sm" data-drawer-step="1">Next<span class="sr-only"> case study</span>${icon('arrow')}</button>
    </footer>
  </aside>
</div>
${list(d.caseStudies, (c, i) => caseDrawerBody(c, d, i))}`;
}

/* --------------------------------------------------------------- Regions --- */

const brand = (d) => `<img class="brand__logo" src="${d.profile.logo.src}" width="28" height="28" alt="">`;

export function renderNav(d) {
  const links = (cls) => list(d.nav, (n) => `<li><a class="${cls}" href="#${n.id}" data-nav="${n.id}">${esc(n.label)}</a></li>`);
  return `
<div class="progress" aria-hidden="true"></div>
<header class="nav" id="nav">
  <nav class="nav__bar" aria-label="Primary">
    <a class="brand" href="#top" aria-label="${esc(d.profile.name)}, back to top">${brand(d)}<span>${esc(d.profile.shortName)}</span></a>
    <ul class="nav__links hide-sm" id="navLinks">${links('nav__link')}</ul>
    <div class="nav__actions">
      <a class="btn btn--accent btn--sm" href="#contact">Let’s talk${icon('arrow-ur')}</a>
      <button class="icon-btn show-sm" id="navToggle" type="button" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu">${icon('menu')}</button>
    </div>
  </nav>
  <div class="nav__menu" id="navMenu" hidden>
    <ul>${links('nav__menu-link')}</ul>
  </div>
</header>`;
}

export function renderHero(d) {
  const { hero, statusBoard: sb } = d;
  const words = [...hero.rotating, hero.rotating[0]];
  const bars = Array.from({ length: 60 }, (_, i) =>
    `<span style="--o:${(0.55 + 0.45 * (i / 59)).toFixed(3)};--d:${(1 + i * 0.018).toFixed(3)}s"></span>`).join('');
  return `
<section class="hero" id="top" aria-labelledby="heroTitle">
  <div class="hero__dots" aria-hidden="true"></div>
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="wrap hero__inner">
    <div class="hero__head">
      <p class="hero__kicker fade-up" style="--delay:.2s"><span class="dot pulse" aria-hidden="true"></span>${esc(hero.kicker)}</p>
      <h1 class="hero__title" id="heroTitle">
        <span class="line"><span class="line__in" style="--delay:.3s">${esc(hero.headline)}</span></span>
        <span class="line"><span class="line__in hero__rotate-line" style="--delay:.42s">
          <span class="sr-only">${esc(hero.rotating[0])}</span>
          <span class="rotator" aria-hidden="true"><span class="rotator__inner">${list(words, (w) => `<span>${esc(w)}</span>`)}</span></span>
          <span class="caret" aria-hidden="true"></span>
        </span></span>
      </h1>
    </div>
    <div class="hero__body">
      <div class="hero__copy fade-up" style="--delay:.7s">
        <p class="hero__intro">${hero.introHtml}</p>
        <div class="hero__ctas">
          <a class="btn btn--accent btn--lg btn--down" href="${hero.primaryCta.href}">${esc(hero.primaryCta.label)}${icon('arrow-down')}</a>
          <a class="btn btn--ghost btn--lg" href="${hero.secondaryCta.href}">${esc(hero.secondaryCta.label)}</a>
        </div>
        <p class="hero__facts">${hero.facts.map(esc).join('<span aria-hidden="true">/</span>')}</p>
      </div>
      <div class="hero__board fade-up" style="--delay:.85s">
        <div class="board float">
          <div class="board__top">
            <span class="board__lights" aria-hidden="true"><span></span><span></span><span></span></span>
            <span>${esc(sb.host)}</span>
            <span class="board__live"><span class="dot dot--sm pulse" aria-hidden="true"></span>live</span>
          </div>
          <div class="board__body">
            <p class="board__ok"><span class="board__tick" aria-hidden="true">${icon('check')}</span>${esc(sb.headline)}</p>
            <div>
              <div class="board__bars" aria-hidden="true">${bars}</div>
              <p class="board__axis"><span>${esc(sb.from)}</span><span class="board__axis-mid">uptime</span><span>today</span></p>
            </div>
            <ul class="board__services">
              ${list(sb.services, (s, i) => `<li class="fade-up" style="--delay:${(1.5 + i * 0.1).toFixed(2)}s"><span class="board__svc"><span class="dot dot--xs" aria-hidden="true"></span>${esc(s.name)}</span><span class="board__tag${s.isNew ? ' is-new' : ''}">${esc(s.note)}</span></li>`)}
            </ul>
            <p class="board__cmd fade-in" style="--delay:2.2s">${esc(sb.command)} <span class="accent">${esc(sb.commandResult)}</span><span class="caret caret--text accent" aria-hidden="true">_</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function renderMarquee(d) {
  return marquee(d.tools, 'Tools I run');
}

export function renderMetrics(d) {
  return `
<section class="metrics" aria-label="Key results" data-metrics>
  <ul class="metrics__list">${list(d.metrics, metricCounter)}</ul>
</section>`;
}

export function renderWork(d) {
  const [big, small] = [d.caseStudies.filter((c) => c.variant !== 'small'), d.caseStudies.filter((c) => c.variant === 'small')];
  return `
<section class="section" id="work" aria-labelledby="work-title">
  <div class="wrap">
    ${sectionHeader({ id: 'work', ...d.sections.work })}
    <div class="work">
      ${list(big, (c) => projectCard(c, d))}
      <div class="bento">${list(small, (c) => projectCard(c, d))}</div>
      <div class="shipped reveal">
        <p class="shipped__label">Also shipped</p>
        ${chips(d.alsoShipped, 'chip chip--fill')}
      </div>
    </div>
  </div>
</section>`;
}

export function renderExperience(d) {
  const linkedin = d.socials.find((s) => s.id === 'linkedin');
  const aside = linkedin
    ? `<a class="btn btn--ghost btn--sm" ${external(linkedin.url)}>Full history on LinkedIn${newTab}${icon('arrow-ur')}</a>`
    : '';
  return `
<section class="section" id="experience" aria-labelledby="experience-title">
  <div class="wrap">
    ${sectionHeader({ id: 'experience', ...d.sections.experience, aside })}
    <div class="timeline">
      <div class="timeline__line" aria-hidden="true"><span class="timeline__fill"></span></div>
      <ol>
      ${list(d.experience, (r) => `
      <li class="role reveal">
        <span class="role__node" aria-hidden="true"></span>
        <div class="role__head">
          <p class="role__dates">${esc(r.dates)}</p>
          <h3 class="role__title">${esc(r.role)}</h3>
          <p class="role__company">${esc(r.company)}</p>
          ${r.current ? '<p class="role__now"><span class="dot dot--sm pulse" aria-hidden="true"></span>Current role</p>' : ''}
        </div>
        <ul class="role__points">${list(r.points, (p) => `<li>${esc(p)}</li>`)}</ul>
      </li>`)}
      </ol>
    </div>
  </div>
</section>`;
}

export function renderApproach(d) {
  return `
<section class="section section--approach" id="approach" aria-labelledby="approach-title">
  <div class="wrap">
    ${sectionHeader({ id: 'approach', ...d.sections.approach })}
    <ol class="rules">
      ${list(d.approach, (a, i) => `
      <li class="rule card reveal">
        <p class="rule__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
        <h3 class="rule__title">${esc(a.title)}</h3>
        <p class="rule__body">${esc(a.body)}</p>
        <p class="rule__proof">→ ${esc(a.proof)}</p>
      </li>`)}
    </ol>
  </div>
</section>`;
}

export function renderStack(d) {
  return `
<section class="section" id="stack" aria-labelledby="stack-title">
  <div class="wrap">
    ${sectionHeader({ id: 'stack', ...d.sections.stack })}
    <dl class="stack reveal">
      ${list(d.stack, (g) => `<div class="stack__row"><dt>${esc(g.category)}</dt><dd>${esc(g.tools)}</dd></div>`)}
    </dl>
  </div>
</section>`;
}

export function renderAbout(d) {
  const { about } = d;
  const p = about.portrait;
  return `
<section class="section" id="about" aria-labelledby="about-title">
  <div class="wrap about">
    <div class="about__side reveal">
      <picture class="about__portrait">
        <source type="image/avif" srcset="${p.avif} 560w, ${p.avif2x} 840w" sizes="(max-width: 760px) 100vw, 340px">
        <img src="${p.jpg}" srcset="${p.jpg} 560w, ${p.jpg2x} 840w" sizes="(max-width: 760px) 100vw, 340px" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
      </picture>
      <dl class="about__facts">
        ${list(about.facts, (f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)}
      </dl>
    </div>
    <div class="about__main reveal">
      <h2 class="kicker" id="about-title">${esc(d.sections.about.kicker)}</h2>
      <p class="about__statement">${esc(about.statement)} <span>${esc(about.statementMuted)}</span></p>
      <ul class="about__creds">
        ${list(about.credentials, (c) => `<li><strong>${esc(c.title)}</strong><span>${esc(c.detail)}</span></li>`)}
      </ul>
    </div>
  </div>
</section>`;
}

export function renderContact(d) {
  const { profile, sections } = d;
  const social = (id) => d.socials.find((s) => s.id === id);
  const links = [social('linkedin'), social('github')].filter(Boolean);
  return `
<section class="section section--contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap">
    <div class="contact reveal">
      <div class="contact__badge hide-sm" aria-hidden="true">
        <svg class="spin" viewBox="0 0 132 132" width="132" height="132">
          <defs><path id="contactCircle" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"></path></defs>
          <text><textPath href="#contactCircle" textLength="322" lengthAdjust="spacing">LET’S TALK · LET’S TALK · LET’S TALK ·</textPath></text>
        </svg>
        ${icon('arrow-ur', 'icon contact__badge-arrow')}
      </div>
      <p class="contact__kicker">${esc(sections.contact.kicker)}</p>
      <h2 class="contact__title" id="contact-title">${esc(sections.contact.title)}</h2>
      <div class="contact__row">
        <div class="contact__actions">
          <a class="btn btn--ink btn--xl" href="mailto:${esc(profile.email)}">${esc(profile.email)}${icon('arrow-ur')}</a>
          <button type="button" class="btn btn--outline-ink btn--xl" id="copyEmail" data-email="${esc(profile.email)}">
            ${icon('copy', 'icon copy__idle')}${icon('check', 'icon copy__done')}<span aria-live="polite" data-copy-label>Copy email</span>
          </button>
        </div>
        <ul class="contact__links">
          <li><a href="tel:${esc(profile.phoneHref)}">${esc(profile.phone)}</a></li>
          ${list(links, (s) => `<li><a ${external(s.url)}>${esc(s.label)} ↗${newTab}</a></li>`)}
          <li><a href="${profile.resume}" download>Résumé (PDF)</a></li>
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

export function renderFooter(d) {
  const year = new Date().getFullYear();
  return `
<footer class="footer">
  <div class="wrap footer__row">
    <p class="footer__copy">${brand(d)}© <span data-year>${year}</span> ${esc(d.profile.name)}</p>
    <ul class="footer__socials">
      ${list(d.socials, (s) => `<li><a class="icon-btn" ${external(s.url)} data-social="${s.id}" data-handle="${esc(s.handle)}" aria-label="${esc(s.label)} (opens in a new tab)">${icon(s.id)}</a></li>`)}
    </ul>
    <p class="footer__hint hide-touch">Press <kbd>/</kbd> for shortcuts</p>
    <a class="footer__top" href="#top">Back to top${icon('arrow-up')}</a>
  </div>
  <p class="footer__mark" aria-hidden="true">${esc(d.profile.shortName)}</p>
</footer>`;
}

export const regions = {
  nav: renderNav,
  hero: renderHero,
  marquee: renderMarquee,
  metrics: renderMetrics,
  work: renderWork,
  experience: renderExperience,
  approach: renderApproach,
  stack: renderStack,
  about: renderAbout,
  contact: renderContact,
  footer: renderFooter,
  drawer: caseStudyDrawer,
};
