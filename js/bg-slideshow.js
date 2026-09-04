/**
 * Scoped Ken Burns / crossfade for hero plates (not a full-page background).
 */

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * @param {{ intervalMs: number, crossfadeMs: number, images: string[] }} config
 * @param {{ reducedMotion?: boolean, rootSelector?: string }} [opts]
 */
export function initBgSlideshow(config, opts = {}) {
  const images = (config?.images ?? []).filter(Boolean);
  const root = document.querySelector(opts.rootSelector || '.hero-media');
  const slideA = root?.querySelector('[data-slide="a"]');
  const slideB = root?.querySelector('[data-slide="b"]');

  if (!root || !slideA || !slideB) return null;

  const reducedMotion = Boolean(opts.reducedMotion);
  const crossfadeMs = reducedMotion
    ? 0
    : Math.max(0, Number(config.crossfadeMs) || 1400);
  const intervalMs = Math.max(crossfadeMs + 500, Number(config.intervalMs) || 8000);

  root.style.setProperty('--bg-crossfade', `${crossfadeMs}ms`);
  root.classList.toggle('is-instant', reducedMotion);

  let index = 0;
  let showingA = true;
  let timer = null;
  let stopped = false;
  let loadedAny = false;

  const setBg = (el, src) => {
    el.style.backgroundImage = `url("${src}")`;
  };

  const markReady = () => {
    if (loadedAny) return;
    loadedAny = true;
    root.classList.add('has-media');
  };

  const tryFirst = async () => {
    for (let i = 0; i < images.length; i += 1) {
      const ok = await preload(images[i]);
      if (stopped) return;
      if (ok) {
        index = i;
        setBg(slideA, images[i]);
        slideA.classList.add('is-active');
        slideB.classList.remove('is-active');
        markReady();
        return true;
      }
    }
    root.classList.add('is-fallback');
    return false;
  };

  const liveImages = () => images;

  const advance = async () => {
    if (liveImages().length < 2) return;
    let next = (index + 1) % images.length;
    let attempts = 0;
    while (attempts < images.length) {
      const ok = await preload(images[next]);
      if (stopped) return;
      if (ok) break;
      next = (next + 1) % images.length;
      attempts += 1;
      if (attempts >= images.length) return;
    }

    const incoming = showingA ? slideB : slideA;
    const outgoing = showingA ? slideA : slideB;

    setBg(incoming, images[next]);
    void incoming.offsetWidth;
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');

    showingA = !showingA;
    index = next;
    markReady();
  };

  const schedule = () => {
    if (stopped || reducedMotion || images.length < 2) return;
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

  tryFirst().then((ok) => {
    if (ok && !reducedMotion) schedule();
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
