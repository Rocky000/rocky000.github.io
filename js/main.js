/**
 * Progressive enhancement only. All content is already in index.html
 * (prerendered by scripts/build-index.mjs), so nothing here blocks first paint.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = { menuOpen: false, paletteOpen: false, popupOpen: false, contactVisible: false };

function syncStickyCta() {
  const bar = $('#stickyCta');
  if (!bar) return;
  const hide = state.menuOpen || state.paletteOpen || state.popupOpen || state.contactVisible;
  bar.classList.toggle('is-hidden', hide);
  bar.inert = hide;
}

const THEME_KEY = 'theme';
const THEME_COLORS = { dark: '#07080c', light: '#f7f8fa' };

function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme, { persist = false } = {}) {
  const next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  if (persist) {
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  }
  const btn = $('#themeToggle');
  if (btn) {
    const toLight = next === 'dark';
    btn.setAttribute('aria-label', toLight ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('aria-pressed', String(next === 'light'));
  }
  const meta = $('#themeColor');
  if (meta) meta.setAttribute('content', THEME_COLORS[next]);
}

function initTheme() {
  applyTheme(currentTheme());

  $('#themeToggle')?.addEventListener('click', () => {
    applyTheme(currentTheme() === 'light' ? 'dark' : 'light', { persist: true });
  });

  const mq = window.matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener('change', (e) => {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch {}
    if (stored === 'light' || stored === 'dark') return;
    applyTheme(e.matches ? 'light' : 'dark');
  });
}

function initMenu() {
  const toggle = $('#navToggle');
  const menu = $('#navMenu');
  if (!toggle || !menu) return;

  const setOpen = (open, { restoreFocus = false } = {}) => {
    state.menuOpen = open;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) $('a', menu)?.focus();
    else if (restoreFocus) toggle.focus();
    syncStickyCta();
  };

  toggle.addEventListener('click', () => setOpen(!state.menuOpen));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.menuOpen) setOpen(false, { restoreFocus: true });
  });
  document.addEventListener('click', (e) => {
    if (state.menuOpen && !e.target.closest('#nav')) setOpen(false);
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
    if (e.matches && state.menuOpen) setOpen(false);
  });
}

function initActiveNav() {
  const links = $$('[data-nav]');
  const ids = [...new Set(links.map((a) => a.dataset.nav))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((a) => {
      if (a.dataset.nav === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((s) => spy.observe(s));

  const home = document.getElementById('home');
  if (home) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActive(null);
    }, { rootMargin: '-40% 0px -55% 0px' }).observe(home);
  }
}

function initStickyCta() {
  const contact = document.getElementById('contact');
  if (!contact || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => {
    state.contactVisible = entry.isIntersecting;
    syncStickyCta();
  }).observe(contact);
}

function openTargetDetails(openCasePopup) {
  const open = () => {
    const id = location.hash ? location.hash.slice(1) : '';
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    if (id.startsWith('case-') && target.matches('.case') && openCasePopup) {
      const details = $('[data-popup]', target);
      if (details) openCasePopup(details);
      return;
    }
    const details = target.closest('details');
    if (details && !details.hasAttribute('data-popup')) details.open = true;
  };
  window.addEventListener('hashchange', open);
  open();
}

function initPopups() {
  const root = $('#detailModal');
  const titleEl = $('#popupTitle');
  const subtitleEl = $('#popupSubtitle');
  const body = $('#popupBody');
  if (!root || !titleEl || !body) return;

  document.documentElement.classList.add('js');

  let returnFocus = null;
  let sourceDetails = null;

  const focusables = () =>
    $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', root.querySelector('.popup__dialog'))
      .filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

  const close = () => {
    if (root.hidden) return;
    root.hidden = true;
    state.popupOpen = false;
    syncStickyCta();
    body.replaceChildren();
    titleEl.textContent = '';
    if (subtitleEl) {
      subtitleEl.textContent = '';
      subtitleEl.hidden = true;
    }
    if (sourceDetails) sourceDetails.open = false;
    sourceDetails = null;
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  };

  const openFromDetails = (details) => {
    if (!(details instanceof HTMLDetailsElement)) return;
    const caseEl = details.closest('.case');
    const jobEl = details.closest('.job');
    const panel = $('.case__detail, .job__bullets', details);
    if (!panel) return;

    details.open = false;
    returnFocus = $('.popup-trigger', details) || document.activeElement;
    sourceDetails = details;

    if (caseEl) {
      titleEl.textContent = $('.case__title', caseEl)?.textContent.trim() || 'Case study';
      if (subtitleEl) {
        subtitleEl.textContent = $$('.case__meta > span', caseEl)
          .map((s) => s.textContent.trim())
          .filter(Boolean)
          .join(' · ');
        subtitleEl.hidden = !subtitleEl.textContent;
      }
    } else if (jobEl) {
      titleEl.textContent = $('.job__role', jobEl)?.textContent.trim() || 'Responsibilities';
      if (subtitleEl) {
        const company = $('.job__company', jobEl)?.textContent.trim() || '';
        const meta = $('.job__meta', jobEl)?.textContent.trim() || '';
        subtitleEl.textContent = [company, meta].filter(Boolean).join(' · ');
        subtitleEl.hidden = !subtitleEl.textContent;
      }
    } else {
      titleEl.textContent = 'Details';
      if (subtitleEl) subtitleEl.hidden = true;
    }

    body.replaceChildren(panel.cloneNode(true));
    root.hidden = false;
    state.popupOpen = true;
    syncStickyCta();
    $('[data-popup-close].popup__close', root)?.focus();
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.popup-trigger');
    if (!trigger) return;
    const details = trigger.closest('details[data-popup]');
    if (!details) return;
    e.preventDefault();
    openFromDetails(details);
  });

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-popup-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  openTargetDetails(openFromDetails);
  return openFromDetails;
}

/* Command palette: built on first use from links already in the page. */
function initCommandPalette() {
  const root = $('#cmdPalette');
  const input = $('#cmdInput');
  const list = $('#cmdList');
  if (!root || !input || !list) return;

  let actions = null;
  let filtered = [];
  let active = 0;
  let returnFocus = null;

  const buildActions = () => {
    const go = $$('#navLinks a').map((a) => ({
      label: `Go to ${a.textContent.trim()}`,
      hint: a.getAttribute('href'),
      run: () => a.click(),
    }));
    go.push({ label: 'Go to Contact', hint: '#contact', run: () => $('a[href="#contact"]')?.click() });

    const email = $('a[href^="mailto:"]')?.getAttribute('href').replace('mailto:', '');
    const copy = email
      ? [{
          label: 'Copy email',
          hint: email,
          run: async () => {
            try {
              await navigator.clipboard.writeText(email);
            } catch {
              window.location.href = `mailto:${email}`;
            }
          },
        }]
      : [];

    const socials = $$('.footer [data-social]').map((a) => ({
      label: `Open ${a.getAttribute('aria-label') || a.dataset.social}`,
      hint: a.dataset.handle,
      run: () => window.open(a.href, '_blank', 'noopener,noreferrer'),
    }));

    const next = currentTheme() === 'light' ? 'dark' : 'light';
    const theme = [{
      label: `Switch to ${next} theme`,
      hint: next,
      run: () => applyTheme(next, { persist: true }),
    }];

    return [...go, ...copy, ...socials, ...theme];
  };

  const paint = () => {
    if (!filtered.length) {
      list.innerHTML = '<li class="cmd__empty">No matching commands</li>';
      return;
    }
    list.innerHTML = filtered
      .map(
        (a, i) => `
        <li>
          <button class="cmd__item${i === active ? ' is-active' : ''}" type="button" data-index="${i}">
            <span>${a.label}</span><span class="cmd__meta">${a.hint}</span>
          </button>
        </li>`,
      )
      .join('');
    list.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  };

  const open = () => {
    actions = buildActions();
    returnFocus = document.activeElement;
    root.hidden = false;
    state.paletteOpen = true;
    syncStickyCta();
    input.value = '';
    filtered = actions;
    active = 0;
    paint();
    input.focus();
  };

  const close = () => {
    root.hidden = true;
    state.paletteOpen = false;
    syncStickyCta();
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
  };

  const run = (action) => {
    close();
    action?.run();
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    filtered = actions.filter((a) => `${a.label} ${a.hint}`.toLowerCase().includes(q));
    active = 0;
    paint();
  });
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-index]');
    if (btn) run(filtered[Number(btn.dataset.index)]);
  });
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-cmd-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    const metaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    const slash = e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey;

    if (metaK || (slash && root.hidden)) {
      e.preventDefault();
      if (root.hidden) open();
      else close();
      return;
    }
    if (root.hidden) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      active = Math.min(Math.max(active + step, 0), Math.max(filtered.length - 1, 0));
      paint();
    } else if (e.key === 'Enter' && e.target === input) {
      e.preventDefault();
      run(filtered[active]);
    } else if (e.key === 'Tab') {
      const focusables = $$('input, button', root.querySelector('.cmd__dialog'));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

function init() {
  $$('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
  initTheme();
  initMenu();
  initActiveNav();
  initStickyCta();
  initPopups();
  initCommandPalette();
}

init();
