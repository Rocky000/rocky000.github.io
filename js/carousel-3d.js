/**
 * Landscape single-card deck.
 *
 * Only one card is visible at a time. Drag / horizontal scroll / keyboard
 * still work. Autoplay advances to the next card on a loop, and pauses while
 * the user is interacting or the deck is off-screen.
 *
 * Expected markup inside `root`:
 *   .deck__stage > .deck__track
 */

const FRICTION = 0.88;
const SNAP_STRENGTH = 0.18;
const REST_THRESHOLD = 0.0005;
const DRAG_TO_INDEX = 0.85;

/**
 * @param {object} opts
 * @param {HTMLElement} opts.root
 * @param {Array} opts.items
 * @param {(item, index) => string} opts.renderCard
 * @param {object} [opts.settings]  cardW, cardH, autoplayMs
 * @param {(item, index) => void} [opts.onFocus]
 * @param {string} [opts.label]
 */
export function initDeck({ root, items, renderCard, settings = {}, onFocus, label = 'card' }) {
  if (!root || !items?.length) return null;

  const track = root.querySelector('.deck__track');
  if (!track) return null;

  const cfg = {
    cardW: 400,
    cardH: 450,
    autoplayMs: 4500,
    ...settings,
  };
  const count = items.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.style.setProperty('--card-w', `${cfg.cardW}px`);
  root.style.setProperty('--card-h', `${cfg.cardH}px`);
  root.classList.add('deck--solo');

  track.innerHTML = items
    .map(
      (item, i) => `
      <article class="deck__card" data-index="${i}"
               role="group" aria-roledescription="slide"
               aria-label="${label} ${i + 1} of ${count}"
               aria-hidden="${i === 0 ? 'false' : 'true'}">
        ${renderCard(item, i)}
      </article>`,
    )
    .join('');

  const cards = Array.from(track.querySelectorAll('.deck__card'));

  let position = 0;
  let velocity = 0;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let lastX = 0;
  let moved = 0;
  let frame = null;
  let running = false;
  let idle = 0;
  let focused = -1;
  let inView = false;
  let autoplayTimer = null;
  let paused = false;

  const clamp = (v) => Math.min(Math.max(v, 0), count - 1);
  const nearest = () => clamp(Math.round(position));
  const wrapIndex = (i) => ((i % count) + count) % count;

  function setFocus(i) {
    if (i === focused) return;
    focused = i;
    cards.forEach((c, ci) => {
      const on = ci === i;
      c.classList.toggle('is-front', on);
      c.setAttribute('aria-hidden', on ? 'false' : 'true');
      c.style.pointerEvents = on ? 'auto' : 'none';
    });
    onFocus?.(items[i], i);
  }

  function paint() {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const offset = i - position;
      const dist = Math.abs(offset);

      // Strictly one card when settled; brief crossfade while sliding.
      if (dist >= 0.98) {
        card.style.visibility = 'hidden';
        card.style.opacity = '0';
        continue;
      }

      card.style.visibility = '';
      const x = reduceMotion ? 0 : offset * cfg.cardW * 0.55;
      const opacity = Math.max(1 - dist * 1.15, 0);

      card.style.transform = reduceMotion
        ? 'translate3d(-50%, -50%, 0)'
        : `translate3d(calc(-50% + ${x}px), -50%, 0)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(1000 - Math.round(dist * 10));
      card.style.pointerEvents = dist < 0.5 ? 'auto' : 'none';
    }
    setFocus(nearest());
  }

  function tick() {
    frame = requestAnimationFrame(tick);

    if (!dragging) {
      if (Math.abs(velocity) > 0.002) {
        position = clamp(position + velocity);
        velocity *= FRICTION;
        idle = 0;
      } else {
        const diff = nearest() - position;
        position += diff * SNAP_STRENGTH;
        if (Math.abs(diff) > REST_THRESHOLD) idle = 0;
        else {
          position = nearest();
          idle++;
        }
      }
    } else {
      idle = 0;
    }

    paint();
    if (idle > 14) stop();
  }

  function wake() {
    idle = 0;
    if (running) return;
    running = true;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
    frame = null;
  }

  function goTo(i) {
    position = clamp(i);
    velocity = 0;
    wake();
    restartAutoplay();
  }

  function step(n) {
    velocity = 0;
    position = wrapIndex(nearest() + n);
    wake();
    restartAutoplay();
  }

  /* ----------------------------------------------------------- autoplay --- */

  function clearAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function scheduleAutoplay() {
    clearAutoplay();
    if (paused || !inView || document.hidden || count < 2) return;
    if (cfg.autoplayMs <= 0) return;
    autoplayTimer = setTimeout(() => {
      step(1);
    }, cfg.autoplayMs);
  }

  function restartAutoplay() {
    clearAutoplay();
    scheduleAutoplay();
  }

  function pauseAutoplay() {
    paused = true;
    clearAutoplay();
  }

  function resumeAutoplay() {
    paused = false;
    scheduleAutoplay();
  }

  /* ------------------------------------------------------- interaction --- */

  const stepPx = () => Math.max(cfg.cardW * 0.7, 180);

  const onPointerDown = (e) => {
    if (pointerId !== null) return;
    if (e.target.closest('.deck__scroll')) return;
    pointerId = e.pointerId;
    dragging = true;
    startX = lastX = e.clientX;
    moved = 0;
    velocity = 0;
    pauseAutoplay();
    root.classList.add('is-dragging');
    root.setPointerCapture?.(e.pointerId);
    wake();
  };

  const onPointerMove = (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved = Math.abs(e.clientX - startX);
    const delta = (-dx / stepPx()) * DRAG_TO_INDEX;
    position = clamp(position + delta);
    velocity = delta;
    wake();
  };

  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    root.classList.remove('is-dragging');
    if (moved > 6) root.classList.add('was-dragged');
    else root.classList.remove('was-dragged');
    wake();
    resumeAutoplay();
  };

  root.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    pauseAutoplay();
    const delta = (e.deltaX / stepPx()) * 1.05;
    position = clamp(position + delta);
    velocity = delta * 0.45;
    wake();
    // Resume after the gesture settles.
    clearTimeout(onWheel._t);
    onWheel._t = setTimeout(resumeAutoplay, 900);
  };
  root.addEventListener('wheel', onWheel, { passive: false });

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  };
  root.addEventListener('keydown', onKey);

  root.addEventListener('pointerenter', pauseAutoplay);
  root.addEventListener('pointerleave', () => {
    if (!dragging) resumeAutoplay();
  });
  root.addEventListener('focusin', pauseAutoplay);
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) resumeAutoplay();
  });

  /* -------------------------------------------------- visibility/resize --- */

  const viewObserver = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        wake();
        scheduleAutoplay();
      } else {
        stop();
        clearAutoplay();
      }
    },
    { threshold: 0.2 },
  );
  viewObserver.observe(root);

  const onVisibility = () => {
    if (document.hidden) {
      stop();
      clearAutoplay();
    } else if (inView) {
      wake();
      scheduleAutoplay();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  const authoredW = cfg.cardW;
  const resizeObserver = new ResizeObserver(() => {
    const w = root.clientWidth || window.innerWidth;
    const fit = Math.min(authoredW, w - 48);
    cfg.cardW = fit;
    root.style.setProperty('--card-w', `${fit}px`);
    paint();
  });
  resizeObserver.observe(root);

  paint();
  wake();

  return {
    next: () => step(1),
    prev: () => step(-1),
    goTo,
    current: () => items[nearest()],
    dispose() {
      stop();
      clearAutoplay();
      root.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
      viewObserver.disconnect();
      resizeObserver.disconnect();
    },
  };
}
