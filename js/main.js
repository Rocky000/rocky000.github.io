/**
 * Progressive enhancement only. All content is already in index.html
 * (prerendered by scripts/build-index.mjs), so nothing here blocks first paint.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = { menuOpen: false, paletteOpen: false, contactVisible: false };

function syncStickyCta() {
  const bar = $('#stickyCta');
  if (!bar) return;
  const hide = state.menuOpen || state.paletteOpen || state.contactVisible;
  bar.classList.toggle('is-hidden', hide);
  bar.inert = hide;
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

function openTargetDetails() {
  const open = () => {
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    const details = target?.closest('details');
    if (details) details.open = true;
  };
  window.addEventListener('hashchange', open);
  open();
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
    return [...go, ...copy, ...socials];
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
    actions ??= buildActions();
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
  initMenu();
  initActiveNav();
  initStickyCta();
  openTargetDetails();
  initCommandPalette();
}

init();
