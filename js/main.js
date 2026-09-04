import { initBgSlideshow } from './bg-slideshow.js';
import { initMotion, typeRoles } from './motion.js';

let sections;
let profile;
let socials;
let stats;
let skills;
let experience;
let projects;
let education;
let certifications;
let awards;
let bgSlideshow;
let navItems;
let heroRoles;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const icon = (id, cls = 'icon') =>
  `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"></use></svg>`;

function renderHero() {
  $('#heroLocation').textContent = `Available from ${profile.location}`;
  $('#heroName').textContent = profile.name;
  const typeEl = $('#heroType');
  if (typeEl) typeEl.textContent = heroRoles?.[0] || profile.title;
  $('#heroTagline').textContent = profile.tagline;
  const lead = $('#aboutLead');
  if (lead) lead.textContent = profile.lead || profile.tagline;
  const aboutSummary = $('#aboutSummary');
  if (aboutSummary) {
    // Keep a tighter on-page summary; full resume prose stays in data.js.
    aboutSummary.textContent = profile.summary;
  }
  $('#footerName').textContent = `© ${new Date().getFullYear()} ${profile.name}`;

  const navEmail = $('#navEmail');
  if (navEmail) navEmail.href = `mailto:${profile.email}`;

  wireResumeLinks();

  $('#heroStats').innerHTML = stats
    .map(
      (s) => `
      <li class="hero__stat">
        <p class="hero__stat-value accent" data-count="${s.value}" data-suffix="${s.suffix}" data-decimals="${s.decimals ?? 0}">0${s.suffix}</p>
        <p class="hero__stat-label">${s.label}</p>
      </li>`,
    )
    .join('');
}

function wireResumeLinks() {
  const resumeUrl = `${profile.resume}?v=${profile.resumeVersion ?? '1'}`;
  const fileName = 'Rockibul_Islam_Khan_Resume.pdf';

  [$('#heroResume'), $('#contactResume')].filter(Boolean).forEach((el) => {
    el.href = resumeUrl;
    el.removeAttribute('download');
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  const downloadLink = $('#contactResumeDownload');
  if (!downloadLink) return;

  downloadLink.href = resumeUrl;
  downloadLink.removeAttribute('download');
  downloadLink.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(resumeUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Resume fetch failed (${res.status})`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.warn('Resume download failed; opening in a new tab instead.', err);
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    }
  });
}

function renderNav() {
  $('#navLinks').innerHTML = navItems
    .map((n) => `<a class="nav__link" href="#${n.id}" data-nav="${n.id}">${n.label}</a>`)
    .join('');
}

function renderSocials() {
  $('#footerSocials').innerHTML = socials
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}" title="${s.label}">${icon(s.id)}</a>`,
    )
    .join('');

  $('#contactSocials').innerHTML = socials
    .map(
      (s) => `
      <a class="social-card" href="${s.url}" target="_blank" rel="noopener noreferrer">
        ${icon(s.id)}
        <span class="social-card__label">${s.label}</span>
        <span class="social-card__handle">${s.handle}</span>
      </a>`,
    )
    .join('');
}

function renderAboutFacts() {
  const facts = [
    ['Based in', profile.location],
    ['Current role', 'Senior DevOps Engineer @ Katria'],
    ['Focus', 'AWS · Kubernetes · CI/CD · IaC'],
    ['Also does', 'Full-stack real-time systems'],
  ];
  $('#aboutFacts').innerHTML = facts
    .map(([dt, dd]) => `<div class="about__fact"><dt>${dt}</dt><dd>${dd}</dd></div>`)
    .join('');
}

function renderSectionHeads() {
  $$('[data-section-head]').forEach((head) => {
    const s = sections[head.dataset.sectionHead];
    if (!s) return;
    head.innerHTML = `
      <p class="section__kicker">${s.kicker}</p>
      <h2 class="section__title">${s.title}</h2>
      ${s.note ? `<p class="section__note">${s.note}</p>` : ''}`;
  });
}

function marqueeItems() {
  const seen = new Set();
  const out = [];
  skills.forEach((s) => {
    s.items.forEach((item) => {
      if (seen.has(item)) return;
      seen.add(item);
      out.push(item);
    });
  });
  return out;
}

function fillMarqueeTrack(el, items) {
  if (!el || !items.length) return;
  el.style.animation = 'none';
  el.innerHTML = [...items, ...items]
    .map((t) => `<span class="marquee__item">${t}</span>`)
    .join('');
}

/**
 * JS-driven continuous tickers.
 * direction > 0 → content travels left → right
 * direction < 0 → content travels right → left
 */
function startMarquee(el, direction, speedPx = 50) {
  if (!el) return;
  el.style.animation = 'none';
  el.style.willChange = 'transform';

  let offset = 0;
  let half = 0;
  let raf = null;
  let last = 0;
  let running = false;

  const measure = () => {
    half = el.scrollWidth / 2;
    if (half <= 0) return;
    // Keep offset in (-half, 0] for seamless loop with doubled content.
    offset = ((offset % half) + half) % half - half;
    el.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const tick = (now) => {
    if (!running) return;
    if (!last) last = now;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (half > 0) {
      offset += direction * speedPx * dt;
      if (offset <= -half) offset += half;
      if (offset > 0) offset -= half;
      el.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || document.hidden) return;
    measure();
    running = true;
    last = 0;
    raf = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    last = 0;
  };

  measure();
  // Defer one frame so layout settles after fonts/images.
  requestAnimationFrame(() => {
    measure();
    start();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  window.addEventListener('resize', () => {
    measure();
  }, { passive: true });
}

function skillCardHtml(s) {
  return `
    <article class="skill-card">
      <div class="skill-card__icon">${icon(s.icon)}</div>
      <h3 class="skill-card__title">${s.category}</h3>
      <ul class="chips">
        ${s.items.map((i) => `<li class="chip">${i}</li>`).join('')}
      </ul>
    </article>`;
}

function renderSkills() {
  const items = marqueeItems();
  const trackA = $('#skillsMarqueeTrack');
  const trackB = $('#skillsMarqueeTrackB');
  fillMarqueeTrack(trackA, items);
  const rotated = [
    ...items.slice(Math.floor(items.length / 3)),
    ...items.slice(0, Math.floor(items.length / 3)),
  ];
  fillMarqueeTrack(trackB, rotated);

  // Both ticker rows: right → left
  startMarquee(trackA, -1, 52);
  startMarquee(trackB, -1, 46);

  // Continuous skill-card strip (one card in view, smooth R→L)
  const stripTrack = $('#skillsStripTrack');
  if (stripTrack && skills.length) {
    const cards = skills.map(skillCardHtml).join('');
    stripTrack.innerHTML = cards + cards;
    stripTrack.style.animation = 'none';
    startMarquee(stripTrack, -1, 52);
  }
}

function renderExperience() {
  $('#experienceList').innerHTML = experience
    .map(
      (job) => `
      <article class="exp-job${job.current ? ' is-current' : ''} reveal">
        <header class="exp-job__head">
          ${job.current ? '<span class="exp-job__now">Now</span>' : ''}
          <h3 class="exp-job__role">${job.role}</h3>
          <p class="exp-job__company">${job.company}</p>
          <p class="exp-job__meta">${job.location} · ${job.period}</p>
        </header>
        <ul class="exp-job__bullets">
          ${job.bullets.map((b) => `<li>${b}</li>`).join('')}
        </ul>
      </article>`,
    )
    .join('');
}

function projectCardHtml(p, i) {
  return `
    <article class="project-card${p.featured ? ' is-featured' : ''}">
      <div class="project-card__top">
        <span class="project-card__badge">${p.badge}</span>
        <span class="project-card__num">${String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 class="project-card__title">${p.title}</h3>
      <p class="project-card__summary">${p.summary}</p>
      <ul class="chips">
        ${p.tags.map((t) => `<li class="chip">${t}</li>`).join('')}
      </ul>
    </article>`;
}

function renderProjects() {
  const track = $('#projectsStripTrack');
  if (!track || !projects.length) return;
  const cards = projects.map((p, i) => projectCardHtml(p, i)).join('');
  track.innerHTML = cards + cards;
  track.style.animation = 'none';
  startMarquee(track, -1, 52);
}

function renderCredentials() {
  $('#credentialsStrip').innerHTML = `
    <article class="cred-card reveal">
      <div class="cred-card__icon">${icon('cap')}</div>
      <h3>Education</h3>
      <ul class="cred-card__list">
        ${education.items
          .map(
            (e) => `
          <li>
            <strong>${e.degree}</strong>
            <span>${e.school} · ${e.period}</span>
          </li>`,
          )
          .join('')}
      </ul>
    </article>
    <article class="cred-card reveal">
      <div class="cred-card__icon">${icon('badge')}</div>
      <h3>Certifications · ${certifications.status}</h3>
      <ul class="cred-card__list">
        ${certifications.items
          .map(
            (c) => `
          <li>
            <strong>${c.name}</strong>
            <span>${c.code} · ${c.state}</span>
          </li>`,
          )
          .join('')}
      </ul>
    </article>
    <article class="cred-card reveal">
      <div class="cred-card__icon">${icon('trophy')}</div>
      <h3>Honors &amp; awards</h3>
      ${awards
        .map(
          (a) => `
        <p class="cred-card__award">${a.title}</p>
        <p class="cred-card__detail">${a.detail}</p>
        <p class="cred-card__date">${a.date}</p>`,
        )
        .join('')}
    </article>`;
}

function renderContact() {
  const mail = $('#contactEmail');
  const mailText = $('#contactEmailText');
  if (mail) mail.href = `mailto:${profile.email}`;
  if (mailText) mailText.textContent = profile.name;

  const entries = [
    { href: `mailto:${profile.email}`, icon: 'mail', text: profile.email },
    { href: `tel:${profile.phoneHref}`, icon: 'phone', text: profile.phone },
    { href: null, icon: 'pin', text: profile.location },
  ];

  $('#contactList').innerHTML = entries
    .map((e) => {
      const inner = `${icon(e.icon)}<span>${e.text}</span>`;
      return e.href
        ? `<li><a class="contact__item" href="${e.href}">${inner}</a></li>`
        : `<li><span class="contact__item">${inner}</span></li>`;
    })
    .join('');
}

function initNav(lenis) {
  const nav = $('#nav');
  const links = $('#navLinks');
  const toggle = $('#navToggle');

  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeMenu = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  const scrollToHash = (hash) => {
    const el = document.querySelector(hash);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToHash(hash);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  const sectionEls = navItems.map((n) => document.getElementById(n.id)).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('.nav__link').forEach((a) =>
          a.classList.toggle('is-active', a.dataset.nav === entry.target.id),
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );
  sectionEls.forEach((s) => spy.observe(s));
}

function initReveal() {
  const items = $$('.reveal');
  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  items.forEach((el) => {
    const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
    const index = siblings.indexOf(el);
    if (index > 0 && siblings.length > 2) {
      el.style.transitionDelay = `${Math.min(index, 6) * 60}ms`;
    }
    observer.observe(el);
  });
}

function initCounters() {
  const nodes = $$('[data-count]');
  if (prefersReducedMotion) {
    nodes.forEach((n) => {
      const decimals = Number(n.dataset.decimals);
      n.textContent = Number(n.dataset.count).toFixed(decimals) + n.dataset.suffix;
    });
    return;
  }

  const run = (node) => {
    const target = Number(node.dataset.count);
    const decimals = Number(node.dataset.decimals);
    const suffix = node.dataset.suffix;
    const duration = 1500;
    const start = performance.now();

    const frame = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );
  nodes.forEach((n) => observer.observe(n));
}

function initCommandPalette() {
  const root = $('#cmdPalette');
  const input = $('#cmdInput');
  const list = $('#cmdList');
  if (!root || !input || !list) return;

  const actions = [
    ...navItems.map((n) => ({
      id: `go-${n.id}`,
      label: `Go to ${n.label}`,
      hint: `#${n.id}`,
      run: () => document.querySelector(`a[href="#${n.id}"]`)?.click(),
    })),
    {
      id: 'copy-email',
      label: 'Copy email',
      hint: profile.email,
      run: async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      },
    },
    ...socials.map((s) => ({
      id: `open-${s.id}`,
      label: `Open ${s.label}`,
      hint: s.handle,
      run: () => window.open(s.url, '_blank', 'noopener,noreferrer'),
    })),
  ];

  let filtered = actions;
  let active = 0;

  const paint = () => {
    list.innerHTML = filtered
      .map(
        (a, i) => `
        <li>
          <button class="cmd__item${i === active ? ' is-active' : ''}" type="button" data-id="${a.id}">
            <span>${a.label}</span>
            <span class="cmd__meta">${a.hint}</span>
          </button>
        </li>`,
      )
      .join('');
  };

  const open = () => {
    root.hidden = false;
    input.value = '';
    filtered = actions;
    active = 0;
    paint();
    input.focus();
  };

  const close = () => {
    root.hidden = true;
    input.blur();
  };

  const run = (id) => {
    const action = actions.find((a) => a.id === id) || filtered[active];
    close();
    action?.run();
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    filtered = actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q),
    );
    active = 0;
    paint();
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (btn) run(btn.dataset.id);
  });

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-cmd-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    const typing =
      e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    const metaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    const slash = e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey;

    if (metaK || slash) {
      e.preventDefault();
      if (root.hidden) open();
      else close();
      return;
    }
    if (root.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(filtered.length - 1, active + 1);
      paint();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(0, active - 1);
      paint();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[active]) run(filtered[active].id);
    }
  });
}

function dismissSplash() {
  document.documentElement.classList.add('is-booted');
  const splash = document.getElementById('bootSplash');
  if (!splash) return;

  const remove = () => splash.remove();
  splash.classList.add('is-done');

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    remove();
  };

  splash.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'opacity') finish();
  });
  setTimeout(finish, prefersReducedMotion ? 80 : 900);
}

async function boot() {
  const rev =
    new URL(import.meta.url).searchParams.get('v') || String(Date.now());
  try {
    const data = await import(`./data.js?v=${rev}`);
    sections = data.sections;
    profile = data.profile;
    socials = data.socials;
    stats = data.stats;
    skills = data.skills;
    experience = data.experience;
    projects = data.projects;
    education = data.education;
    certifications = data.certifications;
    awards = data.awards;
    bgSlideshow = data.bgSlideshow;
    navItems = data.nav;
    heroRoles = data.heroRoles || [data.profile.title];
  } catch (err) {
    console.error('Failed to load page data.', err);
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<p style="padding:2rem;color:#fff;font-family:sans-serif;position:relative;z-index:10000">Could not load page data. Soft-refresh or check that <code>js/data.js</code> is reachable.</p>',
    );
    dismissSplash();
    return;
  }

  renderNav();
  renderSectionHeads();
  renderHero();
  renderSocials();
  renderAboutFacts();
  renderSkills();
  renderExperience();
  renderProjects();
  renderCredentials();
  renderContact();

  const { lenis } = await initMotion({ reducedMotion: prefersReducedMotion });
  initNav(lenis);
  initReveal();
  initCounters();
  initCommandPalette();
  typeRoles($('#heroType'), heroRoles, prefersReducedMotion);

  initBgSlideshow(bgSlideshow, {
    reducedMotion: prefersReducedMotion,
    rootSelector: '.hero-media',
  });

  dismissSplash();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
