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

  const crossfadeMs = Math.max(0, Number(config.crossfadeMs) || 1400);
  const intervalMs = Math.max(crossfadeMs + 500, Number(config.intervalMs) || 8000);

  if (root) root.style.setProperty('--bg-crossfade', `${crossfadeMs}ms`);

  let index = 0;
  let showingA = true;
  let timer = null;

  const setBg = (el, src) => {
    el.style.backgroundImage = `url("${src}")`;
  };

  setBg(slideA, images[0]);
  slideA.classList.add('is-active');
  slideB.classList.remove('is-active');

  if (opts.reducedMotion || images.length < 2) {
    return { stop() {} };
  }

  const advance = async () => {
    const next = (index + 1) % images.length;
    await preload(images[next]);

    const incoming = showingA ? slideB : slideA;
    const outgoing = showingA ? slideA : slideB;

    setBg(incoming, images[next]);
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');

    showingA = !showingA;
    index = next;
  };

  const schedule = () => {
    timer = window.setTimeout(async () => {
      await advance();
      schedule();
    }, intervalMs);
  };

  // Warm the second image so the first transition is smooth.
  preload(images[1]).then(schedule);

  return {
    stop() {
      if (timer) window.clearTimeout(timer);
      timer = null;
    },
  };
}
