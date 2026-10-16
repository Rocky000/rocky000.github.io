/**
 * Pure HTML templates for every page region. No DOM access, so
 * scripts/build-index.mjs can run them in Node and ship finished markup.
 * Each function takes the module namespace exported by js/data.js.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

const icon = (id, cls = 'icon') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"></use></svg>`;

const external = (url) => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;

const sectionHead = (s, id, extra = '') => `
  <header class="section__head">
    <div>
      ${s.kicker ? `<p class="kicker">${esc(s.kicker)}</p>` : ''}
      <h2 class="section__title" id="${id}-title">${esc(s.title)}</h2>
      ${s.note ? `<p class="section__note">${esc(s.note)}</p>` : ''}
    </div>
    ${extra}
  </header>`;

const chips = (items) =>
  `<ul class="chips">${items.map((t) => `<li class="chip">${esc(t)}</li>`).join('')}</ul>`;

/* Syne's tilde is a near-flat stroke that reads as a dot at display sizes. */
const figure = (value) => esc(value).replace(/~/g, '<span class="approx">~</span>');

const city = (location) => String(location).split(',')[0].trim();

export function renderNav(d) {
  const links = d.nav
    .map((n) => `<li><a class="nav__link" href="#${n.id}" data-nav="${n.id}">${esc(n.label)}</a></li>`)
    .join('');
  return `
<header class="nav" id="nav">
  <div class="wrap nav__inner">
    <a class="nav__brand" href="#home" aria-label="${esc(d.profile.name)}, home">Rockibul<span class="accent">.</span></a>
    <nav class="nav__primary" aria-label="Primary">
      <ul class="nav__links" id="navLinks">${links}</ul>
    </nav>
    <a class="btn btn--ghost btn--sm nav__cta" href="#contact">Get in touch</a>
    <button class="nav__toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu">
      <span class="nav__toggle-bar"></span><span class="nav__toggle-bar"></span><span class="nav__toggle-bar"></span>
    </button>
  </div>
  <div class="nav__menu" id="navMenu" hidden>
    <ul class="wrap nav__menu-list">
      ${links}
      <li><a class="nav__link nav__link--cta" href="#contact">Get in touch</a></li>
    </ul>
  </div>
</header>`;
}

export function renderHero(d) {
  const { hero, profile } = d;
  const p = hero.photo;
  const [roleHead, ...roleRest] = profile.title.split(' & ');
  const roleTail = roleRest.length ? ` &amp; ${esc(roleRest.join(' & '))}` : '';
  return `
<section class="hero" id="home" aria-labelledby="heroTitle">
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <p class="pill"><span class="pill__dot" aria-hidden="true"></span><span class="hide-sm">${esc(hero.eyebrow)}</span><span class="show-sm">${esc(hero.eyebrowShort)}</span></p>
      <h1 class="hero__title" id="heroTitle">
        <span class="hero__id">${esc(profile.name)}<span class="hide-sm"> — </span><span class="show-sm"> · </span>${esc(roleHead)}<span class="hide-sm">${roleTail}</span></span>
        <span class="hero__headline">${esc(hero.headline)} <em class="accent">${esc(hero.headlineAccent)}</em></span>
      </h1>
      <p class="hero__lead">${esc(hero.lead)}<span class="hide-sm">${esc(hero.leadMore)}</span><span class="show-sm">.</span></p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="${hero.primaryCta.href}">${esc(hero.primaryCta.label)} ${icon('arrow')}</a>
        <a class="btn btn--ghost" href="${hero.secondaryCta.href}">${esc(hero.secondaryCta.label)}</a>
      </div>
    </div>
    <div class="hero__aside">
      <picture class="hero__photo">
        <source media="(max-width: 767px)" srcset="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
        <source type="image/avif" srcset="${p.avif} 560w, ${p.avif2x} 840w" sizes="(max-width: 1099px) 280px, 340px">
        <img src="${p.jpg}" srcset="${p.jpg} 560w, ${p.jpg2x} 840w" sizes="(max-width: 1099px) 280px, 340px" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}" fetchpriority="high" decoding="async">
      </picture>
      <p class="hero__now">
        <span><span class="hero__now-label">${esc(hero.current.label)}</span><strong>${esc(hero.current.role)}</strong></span>
        <span class="mono accent">${esc(hero.current.since)}</span>
      </p>
    </div>
  </div>
</section>`;
}

export function renderMetrics(d) {
  const items = d.highlights
    .map(
      (h) => `
      <li class="metric">
        <p class="metric__value">${figure(h.value)}</p>
        <p class="metric__label"><span class="hide-sm">${esc(h.label)}</span><span class="show-sm">${esc(h.short)}</span></p>
      </li>`,
    )
    .join('');
  const f = d.hero.featured;
  return `
<section class="metrics" aria-label="Highlights">
  <div class="wrap">
    <ul class="metrics__list">${items}</ul>
    <a class="featured show-sm" href="${f.href}">
      <span><span class="featured__label">${esc(f.label)}</span><strong>${esc(f.title)}</strong></span>
      ${icon('arrow')}
    </a>
  </div>
</section>`;
}

function projectDetail(p, level = 'h4') {
  return `
    <article class="project">
      <p class="project__badge">${esc(p.badge)}</p>
      <${level} class="project__title">${esc(p.title)}</${level}>
      <p class="project__summary">${esc(p.summary)}</p>
      ${chips(p.tags)}
    </article>`;
}

export function renderProjects(d) {
  const byTitle = new Map(d.projects.map((p) => [p.title, p]));
  const cases = d.caseStudies
    .map(
      (c) => `
      <article class="case" id="${c.id}" aria-labelledby="${c.id}-title">
        <p class="case__meta"><span class="accent">${esc(c.tag)}</span><span>${esc(c.org)} · ${esc(c.years)}</span></p>
        <h3 class="case__title" id="${c.id}-title">${esc(c.title)}</h3>
        <dl class="case__body">
          <dt>Problem</dt><dd>${esc(c.problem)}</dd>
          <dt>What I did</dt><dd>${esc(c.did)}</dd>
        </dl>
        <ul class="case__metrics">
          ${c.metrics.map((m) => `<li><strong>${figure(m.value)}</strong><span>${esc(m.label)}</span></li>`).join('')}
        </ul>
        <details class="case__more">
          <summary>Read the case study ${icon('arrow')}</summary>
          <div class="case__detail">
            ${c.projects.map((t) => byTitle.get(t)).filter(Boolean).map((p) => projectDetail(p)).join('')}
          </div>
        </details>
      </article>`,
    )
    .join('');
  const s = d.sections.projects;
  return `
<section class="section" id="projects" aria-labelledby="projects-title">
  <div class="wrap">
    ${sectionHead(s, 'projects')}
    <div class="cases">${cases}</div>
    <details class="all-projects">
      <summary>${esc(s.moreTeaser)} — <span class="link">see all ${d.projects.length} projects</span></summary>
      <div class="all-projects__grid">
        ${d.projects.map((p) => projectDetail(p, 'h3')).join('')}
      </div>
    </details>
  </div>
</section>`;
}

export function renderExperience(d) {
  const linkedin = d.socials.find((s) => s.id === 'linkedin');
  const jobs = d.experience
    .map(
      (job) => `
      <article class="job">
        <header class="job__head">
          ${job.current ? '<p class="badge">Now</p>' : ''}
          <h3 class="job__role">${esc(job.role)}</h3>
          <p class="job__company">${esc(job.company)}</p>
          <p class="job__meta">${esc(city(job.location))} · ${esc(job.period)}</p>
        </header>
        <div class="job__body">
          <ul class="job__highlights">${job.highlightsHtml.map((h) => `<li>${h}</li>`).join('')}</ul>
          <details class="job__all">
            <summary>All responsibilities (${job.bullets.length})</summary>
            <ul class="job__bullets">${job.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          </details>
        </div>
      </article>`,
    )
    .join('');
  const extra = linkedin
    ? `<a class="link link--icon section__aside" ${external(linkedin.url)}>${icon('linkedin')}Full history on LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>`
    : '';
  return `
<section class="section" id="experience" aria-labelledby="experience-title">
  <div class="wrap">
    ${sectionHead(d.sections.experience, 'experience', extra)}
    <div class="jobs">${jobs}</div>
  </div>
</section>`;
}

export function renderApproach(d) {
  const cards = d.approach
    .map(
      (a, i) => `
      <li class="rule">
        <p class="rule__num mono accent">${String(i + 1).padStart(2, '0')}</p>
        <h3 class="rule__title">${esc(a.title)}</h3>
        <p class="rule__body">${esc(a.body)}</p>
        <p class="rule__proof mono">→ ${esc(a.proof)}</p>
      </li>`,
    )
    .join('');
  return `
<section class="section" id="approach" aria-labelledby="approach-title">
  <div class="wrap">
    ${sectionHead(d.sections.approach, 'approach')}
    <ol class="rules">${cards}</ol>
  </div>
</section>`;
}

export function renderSkills(d) {
  const cards = d.skills
    .map(
      (s) => `
      <li class="skill">
        <h3 class="skill__title">${icon(s.icon)}${esc(s.category)}</h3>
        ${chips(s.items)}
      </li>`,
    )
    .join('');
  return `
<section class="section" id="skills" aria-labelledby="skills-title">
  <div class="wrap">
    ${sectionHead(d.sections.skills, 'skills')}
    <ul class="skills">${cards}</ul>
  </div>
</section>`;
}

export function renderAbout(d) {
  const { profile, education, certifications, awards } = d;
  const [degree, ...otherEdu] = education.items;
  const short = (school) => (school.match(/\(([^)]+)\)/) || [])[1] || school;
  const award = awards[0];
  const facts = [
    ['Based in', profile.location],
    ['Current role', d.hero.current.role],
    ['Focus', 'AWS · Kubernetes · CI/CD · IaC'],
    ['Also does', 'Full-stack real-time systems'],
  ];
  return `
<section class="section" id="about" aria-labelledby="about-title">
  <div class="wrap">
    ${sectionHead(d.sections.about, 'about')}
    <div class="about">
      <article class="about__card">
        <p class="about__lead">${esc(profile.lead)}</p>
        <p class="about__body">${esc(profile.summary)}</p>
        <dl class="about__facts">
          ${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
      </article>
      <aside class="creds" id="credentials" aria-labelledby="credentials-title">
        <h3 class="creds__title" id="credentials-title">Credentials</h3>
        <ul class="creds__list">
          <li><strong>${esc(degree.degree.replace(' in ', ' '))}</strong><span>${esc(short(degree.school))} · ${esc(degree.period.replace(/\s+/g, ''))}</span></li>
          ${award ? `<li><strong>${esc(award.title)}</strong><span>${esc(award.detail.split(' — ')[0])} · ${esc(award.date)}</span></li>` : ''}
          <li><strong>${esc(certifications.status.split(' / ').pop())}: ${esc(certifications.items.map((c) => c.code).join(' · '))}</strong><span>${esc(certifications.items.map((c) => c.name).join(', '))}</span></li>
        </ul>
        ${
          otherEdu.length
            ? `<details class="creds__more"><summary>Earlier education</summary><ul class="creds__list">${otherEdu
                .map((e) => `<li><strong>${esc(e.degree)}</strong><span>${esc(e.school)} · ${esc(e.period)}</span></li>`)
                .join('')}</ul></details>`
            : ''
        }
      </aside>
    </div>
  </div>
</section>`;
}

export function renderContact(d) {
  const { profile, sections } = d;
  const linkedin = d.socials.find((s) => s.id === 'linkedin');
  return `
<section class="section section--contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap">
    <div class="cta-band">
      <div class="cta-band__copy">
        <h2 class="cta-band__title" id="contact-title">${esc(sections.contact.title)}</h2>
        <p class="cta-band__note">${esc(sections.contact.note)}</p>
        <ul class="cta-band__meta">
          <li><a href="mailto:${esc(profile.email)}">${icon('mail')}<span>${esc(profile.email)}</span></a></li>
          <li><a href="tel:${esc(profile.phoneHref)}">${icon('phone')}<span>${esc(profile.phone)}</span></a></li>
          <li><span>${icon('pin')}<span>${esc(profile.location)}</span></span></li>
        </ul>
      </div>
      <div class="cta-band__actions">
        <a class="btn btn--dark btn--lg" href="mailto:${esc(profile.email)}">Send an email</a>
        ${linkedin ? `<a class="link link--dark link--icon" ${external(linkedin.url)}>${icon('linkedin')}Connect on LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

export function renderFooter(d) {
  const year = new Date().getFullYear();
  const links = d.socials
    .map(
      (s) =>
        `<li><a class="footer__social" ${external(s.url)} data-social="${s.id}" data-handle="${esc(s.handle)}" aria-label="${esc(s.label)}">${icon(s.id, 'icon icon--social')}<span class="sr-only">${esc(s.label)} (opens in a new tab)</span></a></li>`,
    )
    .join('');
  return `
<footer class="footer">
  <div class="wrap footer__inner">
    <p class="footer__name">© <span data-year>${year}</span> ${esc(d.profile.name)}</p>
    <ul class="footer__links">${links}</ul>
    <p class="footer__meta hide-touch">Press <kbd>/</kbd> for shortcuts</p>
  </div>
</footer>`;
}

export function renderStickyCta(d) {
  return `
<div class="sticky-cta" id="stickyCta">
  <a class="btn btn--ghost" href="${d.hero.secondaryCta.href}">Say hi</a>
  <a class="btn btn--primary" href="${d.hero.primaryCta.href}">${esc(d.hero.primaryCta.label)}</a>
</div>`;
}

export const regions = {
  nav: renderNav,
  hero: renderHero,
  metrics: renderMetrics,
  projects: renderProjects,
  experience: renderExperience,
  approach: renderApproach,
  skills: renderSkills,
  about: renderAbout,
  contact: renderContact,
  footer: renderFooter,
  stickyCta: renderStickyCta,
};
