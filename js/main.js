/**
 * Progressive enhancement only. All content is already in index.html
 * (prerendered by scripts/build-index.mjs), so nothing here blocks first paint.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = { menuOpen: false, paletteOpen: false, drawerOpen: false };

/* Browsers without scroll-driven animations: drive the bar from JS. */
function initScrollProgress() {
  const bar = $('.progress');
  if (!bar || CSS.supports('animation-timeline: scroll()')) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
  };
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
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
  };

  toggle.addEventListener('click', () => setOpen(!state.menuOpen));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  $('.brand')?.addEventListener('click', () => state.menuOpen && setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.menuOpen) setOpen(false, { restoreFocus: true });
  });
  document.addEventListener('click', (e) => {
    if (state.menuOpen && !e.target.closest('#nav')) setOpen(false);
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
    if (e.matches && state.menuOpen) setOpen(false);
  });
}

/* Highlights the nav link of the section crossing the middle of the viewport. */
function initScrollSpy() {
  const links = $$('[data-nav]');
  const sections = $$('main > section[id]');
  if (!links.length || !('IntersectionObserver' in window)) return;

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
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => spy.observe(s));
}

/* Count up once when the band scrolls into view. Final values are prerendered. */
function initMetrics() {
  const band = $('[data-metrics]');
  const values = $$('[data-count]', band || undefined);
  if (!band || !values.length || reduceMotion || !('IntersectionObserver' in window)) return;
  if (band.getBoundingClientRect().bottom < 0) return; // already scrolled past

  const format = (el, p) =>
    `${el.dataset.prefix}${(Number(el.dataset.count) * p).toFixed(Number(el.dataset.decimals))}${el.dataset.suffix}`;
  values.forEach((el) => { el.textContent = format(el, 0); });

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    io.disconnect();
    clearTimeout(fallback);
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 1800);
      const p = t < 1 ? 1 - Math.pow(2, -10 * t) : 1;
      values.forEach((el) => { el.textContent = format(el, p); });
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) start();
  }, { threshold: 0.25 });
  io.observe(band);
  const fallback = setTimeout(start, 6000);
}

/*
 * Screenshot viewer: the active tab's 5 s progress bar is a CSS animation;
 * when it ends we advance. Clicking a tab stops auto-advance for good.
 */
function initViewer() {
  const viewer = $('[data-viewer]');
  if (!viewer) return;
  const tabs = $$('[data-shot]', viewer);
  const shots = $$('.viewer__shot', viewer);
  const captions = $$('[data-caption]', viewer);
  let active = 0;

  const show = (i) => {
    active = i;
    tabs.forEach((t, n) => {
      t.classList.toggle('is-active', n === i);
      t.setAttribute('aria-pressed', String(n === i));
    });
    shots.forEach((s, n) => {
      s.classList.toggle('is-active', n === i);
      if (n === i) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    captions.forEach((c, n) => { c.hidden = n !== i; });
  };

  const stopAuto = () => viewer.classList.remove('is-auto');
  if (!reduceMotion) viewer.classList.add('is-auto');

  viewer.addEventListener('animationend', (e) => {
    if (!e.target.classList?.contains('viewer__progress') || !viewer.classList.contains('is-auto')) return;
    show((active + 1) % tabs.length);
  });

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      stopAuto();
      show(i);
    });
  });

  // Don't advance while nobody can see it.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      viewer.classList.toggle('is-paused', !entry.isIntersecting);
    }).observe(viewer);
  }
}

/* Case-study drawer: one dialog shell, filled from prerendered <template>s. */
function initDrawer() {
  const root = $('#caseDrawer');
  const body = $('#drawerBody');
  const tags = $('#drawerTags');
  const count = $('#drawerCount');
  const closeBtn = $('#drawerClose');
  const templates = $$('template[id^="tpl-"]');
  if (!root || !body || !templates.length) return null;

  const ids = templates.map((t) => t.id.slice(4));
  let current = -1;
  let returnFocus = null;

  const background = () => $$('body > *').filter((el) => el !== root && !el.matches('template, script'));

  const render = (i) => {
    current = (i + templates.length) % templates.length;
    const tpl = templates[current];
    body.replaceChildren(tpl.content.cloneNode(true));
    body.scrollTop = 0;
    tags.textContent = tpl.dataset.tags;
    count.textContent = `${current + 1} / ${templates.length}`;
  };

  const open = (id, trigger) => {
    const i = ids.indexOf(id);
    if (i < 0) return;
    returnFocus = trigger || document.activeElement;
    render(i);
    const html = document.documentElement;
    html.style.setProperty('--sb', `${window.innerWidth - html.clientWidth}px`);
    html.classList.add('is-locked');
    background().forEach((el) => { el.inert = true; });
    root.hidden = false;
    state.drawerOpen = true;
    closeBtn.focus();
    // On a #case-… page load the browser's own fragment handling runs after us.
    requestAnimationFrame(() => { if (state.drawerOpen && !root.contains(document.activeElement)) closeBtn.focus(); });
  };

  const close = () => {
    if (!state.drawerOpen) return;
    root.hidden = true;
    state.drawerOpen = false;
    document.documentElement.classList.remove('is-locked');
    background().forEach((el) => { el.inert = false; });
    body.replaceChildren();
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-case-open]');
    if (trigger) {
      open(trigger.dataset.caseOpen, trigger);
      return;
    }
    if (!state.drawerOpen) return;
    if (e.target.closest('[data-drawer-close]')) close();
    const step = e.target.closest('[data-drawer-step]');
    if (step) render(current + Number(step.dataset.drawerStep));
  });

  document.addEventListener('keydown', (e) => {
    if (!state.drawerOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      render(current + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });

  // Deep links: #case-… opens that case (focus returns to its card button).
  const fromHash = () => {
    const id = location.hash.slice(1);
    if (ids.includes(id)) open(id, $(`[data-case-open="${id}"]`));
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
  return { open, close };
}

function initCopyEmail() {
  const btn = $('#copyEmail');
  const label = $('[data-copy-label]', btn || undefined);
  if (!btn || !label) return;
  const email = btn.dataset.email;
  let timer = 0;

  const fallbackCopy = () => {
    const area = Object.assign(document.createElement('textarea'), { value: email, readOnly: true });
    area.style.cssText = 'position:fixed;opacity:0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  };

  btn.addEventListener('click', async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      ok = fallbackCopy();
    }
    if (!ok) {
      window.location.href = `mailto:${email}`;
      return;
    }
    btn.classList.add('is-copied');
    label.textContent = 'Copied';
    clearTimeout(timer);
    timer = setTimeout(() => {
      btn.classList.remove('is-copied');
      label.textContent = 'Copy email';
    }, 2000);
  });
}

/* Old anchors (#projects, #skills, …) from links shared before the redesign. */
function initLegacyAnchors() {
  const moved = { home: 'top', projects: 'work', skills: 'stack', credentials: 'about' };
  const redirect = () => {
    const next = moved[location.hash.slice(1)];
    if (!next) return;
    history.replaceState(null, '', `#${next}`);
    document.getElementById(next)?.scrollIntoView();
  };
  window.addEventListener('hashchange', redirect);
  redirect();
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

    const copyBtn = $('#copyEmail');
    const copy = copyBtn
      ? [{ label: 'Copy email', hint: copyBtn.dataset.email, run: () => copyBtn.click() }]
      : [];

    const socials = $$('.footer [data-social]').map((a) => ({
      label: `Open ${(a.getAttribute('aria-label') || a.dataset.social).replace(/ \(.*\)$/, '')}`,
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
    actions = buildActions();
    returnFocus = document.activeElement;
    root.hidden = false;
    state.paletteOpen = true;
    input.value = '';
    filtered = actions;
    active = 0;
    paint();
    input.focus();
  };

  const close = () => {
    root.hidden = true;
    state.paletteOpen = false;
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
    if (state.drawerOpen) return;
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
  initScrollProgress();
  initMenu();
  initScrollSpy();
  initMetrics();
  initViewer();
  initLegacyAnchors();
  initDrawer();
  initCopyEmail();
  initCommandPalette();
}

init();
