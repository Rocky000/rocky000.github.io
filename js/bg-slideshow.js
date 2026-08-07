/**
 * Fixed full-viewport photo background with timed crossfade.
 * Config comes from js/data.js → bgSlideshow.
 */

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/**
 * @param {{ intervalMs: number, crossfadeMs: number, images: string[] }} config
 * @param {{ reducedMotion?: boolean }} [opts]
 */
export function initBgSlideshow(config, opts = {}) {
  const images = (config?.images ?? []).filter(Boolean);
  const slideA = document.getElementById('bgSlideA');
  const slideB = document.getElementById('bgSlideB');
  const root = document.querySelector('.bg-slideshow');

  if (!slideA || !slideB || images.length === 0) return null;

  const reducedMotion = Boolean(opts.reducedMotion);
  const crossfadeMs = reducedMotion
    ? 0
    : Math.max(0, Number(config.crossfadeMs) || 1400);
  const intervalMs = Math.max(crossfadeMs + 500, Number(config.intervalMs) || 8000);

  if (root) {
    root.style.setProperty('--bg-crossfade', `${crossfadeMs}ms`);
    root.classList.toggle('is-instant', reducedMotion);
  }

  let index = 0;
  let showingA = true;
  let timer = null;
  let stopped = false;

  const setBg = (el, src) => {
    el.style.backgroundImage = `url("${src}")`;
  };

  setBg(slideA, images[0]);
  slideA.classList.add('is-active');
  slideB.classList.remove('is-active');

  if (images.length < 2) {
    return { stop() {} };
  }

  const advance = async () => {
    const next = (index + 1) % images.length;
    await preload(images[next]);
    if (stopped) return;

    const incoming = showingA ? slideB : slideA;
    const outgoing = showingA ? slideA : slideB;

    setBg(incoming, images[next]);
    // Force a reflow so the browser applies the new background before fading.
    void incoming.offsetWidth;
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');

    showingA = !showingA;
    index = next;
  };

  const schedule = () => {
    if (stopped) return;
    timer = window.setTimeout(async () => {
      if (document.hidden) {
        schedule();
        return;
      }
      await advance();
      schedule();
    }, intervalMs);
  };

  const onVisibility = () => {
    if (!document.hidden && !timer && !stopped) schedule();
  };
  document.addEventListener('visibilitychange', onVisibility);

  preload(images[1]).then(() => {
    if (!stopped) schedule();
  });

  return {
    stop() {
      stopped = true;
      if (timer) window.clearTimeout(timer);
      timer = null;
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
