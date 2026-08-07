import { initDeck } from './carousel-3d.js';

/* Data is loaded in boot() with a cache-bust so edits to data.js always show. */
let sections;
let deckSettings;
let profile;
let socials;
let stats;
let skills;
let experience;
let projects;
let education;
let certifications;
let awards;
let gallery;
let navItems;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const icon = (id, cls = 'icon') =>
  `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"></use></svg>`;

/* ============================================================ rendering === */

function renderHero() {
  $('#heroLocation').textContent = `Available from ${profile.location}`;
  $('#heroName').textContent = profile.name;
  $('#heroTitle').textContent = profile.title;
  $('#heroTagline').textContent = profile.tagline;
  $('#heroPhoto').src = profile.heroPhoto;
  $('#aboutPhoto').src = profile.aboutPhoto;
  $('#aboutSummary').textContent = profile.summary;
  $('#footerName').textContent = `© ${new Date().getFullYear()} ${profile.name}`;

  [$('#heroResume'), $('#contactResume')].forEach((el) => {
    el.href = profile.resume;
    el.setAttribute('download', 'Rockibul_Islam_Khan_Resume.docx');
  });

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

function renderNav() {
  $('#navLinks').innerHTML = navItems
    .map((n) => `<a class="nav__link" href="#${n.id}" data-nav="${n.id}">${n.label}</a>`)
    .join('');
}

function renderSocials() {
  $('#socialRail').innerHTML = socials
    .map(
      (s) =>
        `<a class="rail__link" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}" title="${s.label}">${icon(s.id)}</a>`,
    )
    .join('');

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
    .map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`)
    .join('');
}

/** Fills every `data-section-head` header from `sections` in data.js. */
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

/* ================================================================ decks === */

const deckCards = {
  skills: (s) => `
    <div class="card card--skill">
      <div class="card__icon">${icon(s.icon)}</div>
      <h3 class="card__title">${s.category}</h3>
      <ul class="chips">
        ${s.items.map((i) => `<li class="chip">${i}</li>`).join('')}
      </ul>
    </div>`,

  experience: (job) => `
    <div class="card job${job.current ? ' job--current' : ''}">
      <div class="job__head">
        <h3 class="job__role">${job.role}</h3>
        <span class="job__period">${job.period}</span>
      </div>
      <p class="job__company"><strong>${job.company}</strong> · ${job.location}</p>
      <ul class="job__bullets deck__scroll">
        ${job.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
    </div>`,

  projects: (p, i) => `
    <div class="card project${p.featured ? ' project--featured' : ''}">
      <div class="project__top">
        <span class="project__badge">${p.badge}</span>
        <span class="project__num">${String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 class="project__title">${p.title}</h3>
      <p class="project__summary deck__scroll">${p.summary}</p>
      <ul class="chips">
        ${p.tags.map((t) => `<li class="chip">${t}</li>`).join('')}
      </ul>
    </div>`,

  credentials: (c) => `
    <div class="cred">
      <div class="cred__icon">${icon(c.icon)}</div>
      <p class="cred__label">${c.label}</p>
      <div class="deck__scroll">${c.body}</div>
    </div>`,
};

/** Education, certifications and honors as three deck records. */
function credentialItems() {
  return [
    {
      icon: 'cap',
      label: 'Education',
      body: `
        <ul class="cred__list">
          ${education.items
            .map(
              (e) => `
            <li>
              <span class="cred__dot" aria-hidden="true"></span>
              <span>${e.degree}<br><span class="cred__code">${e.school} · ${e.period}</span></span>
            </li>`,
            )
            .join('')}
        </ul>`,
    },
    {
      icon: 'badge',
      label: `Certifications · ${certifications.status}`,
      body: `
        <ul class="cred__list">
          ${certifications.items
            .map(
              (c) => `
            <li>
              <span class="cred__dot" aria-hidden="true"></span>
              <span>${c.name}<br><span class="cred__code">${c.code} · ${c.state}</span></span>
            </li>`,
            )
            .join('')}
        </ul>`,
    },
    {
      icon: 'trophy',
      label: 'Honors &amp; awards',
      body: awards
        .map(
          (a) => `
        <h3 class="cred__title">${a.title}</h3>
        <p class="cred__sub">${a.detail}</p>
        <p class="cred__period">${a.date}</p>`,
        )
        .join(''),
    },
  ];
}

function initDecks() {
  const settingsFor = (key) => ({ ...deckSettings.default, ...(deckSettings[key] ?? {}) });

  const decks = [
    { id: 'skillsDeck', key: 'skills', items: skills, label: 'skill' },
    { id: 'experienceDeck', key: 'experience', items: experience, label: 'role' },
    { id: 'projectsDeck', key: 'projects', items: projects, label: 'project' },
    { id: 'credentialsDeck', key: 'credentials', items: credentialItems(), label: 'credential' },
  ];

  decks.forEach(({ id, key, items, label }) => {
    initDeck({
      root: document.getElementById(id),
      items,
      renderCard: deckCards[key],
      settings: settingsFor(key),
      label,
    });
  });
}

function renderContact() {
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

/* ========================================================= interactions === */

function initNav() {
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

  links.addEventListener('click', (e) => {
    if (e.target.closest('.nav__link')) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Scroll spy
  const sections = navItems
    .map((n) => document.getElementById(n.id))
    .filter(Boolean);

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
  sections.forEach((s) => spy.observe(s));
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

  // Stagger siblings inside the same grid for a nicer cascade.
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

/** Pointer-following 3D tilt for cards and the hero portrait. */
function initTilt() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  const apply = (el, maxTilt) => {
    let raf = null;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);

      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rx = (0.5 - py) * maxTilt;
        const ry = (px - 0.5) * maxTilt;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
    };

    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      el.style.transform = '';
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    el.addEventListener('blur', reset, true);
  };

  $$('.tilt').forEach((el) => apply(el, 9));

  const portrait = $('#heroPortrait');
  if (portrait) {
    const parent = portrait.parentElement;
    let raf = null;
    parent.addEventListener('pointermove', (e) => {
      const rect = parent.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        portrait.style.transform =
          `rotateX(${(0.5 - py) * 14}deg) rotateY(${(px - 0.5) * 18}deg)`;
      });
    });
    parent.addEventListener('pointerleave', () => {
      portrait.style.transform = '';
    });
  }
}

/* ============================================================= lightbox === */

function initLightbox() {
  const box = $('#lightbox');
  const img = $('#lightboxImg');
  const caption = $('#lightboxCaption');
  const closeBtn = $('#lightboxClose');
  let lastFocus = null;

  const open = (item) => {
    if (!item) return;
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.caption;
    box.hidden = false;
    document.body.classList.add('is-locked');
    lastFocus = document.activeElement;
    closeBtn.focus();
  };

  const close = () => {
    box.hidden = true;
    img.src = '';
    document.body.classList.remove('is-locked');
    lastFocus?.focus?.();
  };

  closeBtn.addEventListener('click', close);
  box.addEventListener('click', (e) => {
    // Clicking the backdrop closes; clicking the photo itself does not.
    if (!e.target.closest('.lightbox__figure') && e.target !== closeBtn) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !box.hidden) close();
  });

  return { open, close };
}

/* ============================================================== gallery === */

function renderGalleryFallback(lightbox) {
  const canvas = $('#galleryCanvas');
  const fallback = $('#galleryFallback');

  canvas.hidden = true;
  canvas.style.display = 'none';
  $('#galleryPrev').hidden = true;
  $('#galleryNext').hidden = true;
  $('#galleryCaption').hidden = true;
  $('#carousel').style.height = 'auto';

  fallback.hidden = false;
  fallback.innerHTML = gallery
    .map(
      (g, i) =>
        `<img src="${g.src}" alt="${g.alt}" loading="lazy" data-index="${i}" width="1400" height="1050">`,
    )
    .join('');

  fallback.addEventListener('click', (e) => {
    const target = e.target.closest('img');
    if (target) lightbox.open(gallery[Number(target.dataset.index)]);
  });
}

function initGallery(lightbox) {
  const canvas = $('#galleryCanvas');
  const container = $('#carousel');
  const captionEl = $('#galleryCaption');

  import('./scene-gallery.js')
    .then(({ initGalleryScene }) => {
      const scene = initGalleryScene({
        canvas,
        container,
        items: gallery,
        onSelect: (item) => lightbox.open(item),
        onFocus: (item) => {
          captionEl.textContent = item.caption;
        },
      });

      if (!scene) {
        renderGalleryFallback(lightbox);
        return;
      }

      $('#galleryPrev').addEventListener('click', scene.prev);
      $('#galleryNext').addEventListener('click', scene.next);

      container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') scene.prev();
        if (e.key === 'ArrowRight') scene.next();
      });
    })
    .catch((err) => {
      console.warn('Gallery: falling back to grid.', err);
      renderGalleryFallback(lightbox);
    });
}

/* ================================================================= hero === */

function initHero() {
  const canvas = $('#heroCanvas');
  const hero = $('#home');

  import('./scene-hero.js')
    .then(({ initHeroScene }) => {
      const scene = initHeroScene(canvas);
      if (!scene) hero.classList.add('no-webgl');
    })
    .catch((err) => {
      console.warn('Hero: falling back to CSS gradient.', err);
      hero.classList.add('no-webgl');
    });
}

/* ================================================================= boot === */

async function boot() {
  const bust = Date.now();
  try {
    const data = await import(`./data.js?t=${bust}`);
    sections = data.sections;
    deckSettings = data.deckSettings;
    profile = data.profile;
    socials = data.socials;
    stats = data.stats;
    skills = data.skills;
    experience = data.experience;
    projects = data.projects;
    education = data.education;
    certifications = data.certifications;
    awards = data.awards;
    gallery = data.gallery;
    navItems = data.nav;

    const { loadPartials } = await import(`./load-partials.js?t=${bust}`);
    await loadPartials();
  } catch (err) {
    console.error('Failed to load page data/partials.', err);
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<p style="padding:2rem;color:#fff;font-family:sans-serif">Could not load page sections. Serve this site over HTTP (e.g. <code>python3 serve.py</code>) and refresh.</p>',
    );
    return;
  }

  renderNav();
  renderSectionHeads();
  renderHero();
  renderSocials();
  renderAboutFacts();
  renderContact();

  initDecks();

  initNav();
  initReveal();
  initCounters();
  initTilt();

  const lightbox = initLightbox();
  initHero();
  initGallery(lightbox);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
