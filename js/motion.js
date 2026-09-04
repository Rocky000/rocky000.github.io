/**
 * Lenis + GSAP motion layer. Falls back to CSS-only if CDNs fail.
 */

const finePointer = () => window.matchMedia('(pointer: fine)').matches;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function typeRoles(el, roles, reducedMotion) {
  if (!el || !roles?.length) return;
  if (reducedMotion) {
    el.textContent = roles[0];
    return;
  }

  let i = 0;
  const type = async (text) => {
    el.textContent = '';
    for (const ch of text) {
      el.textContent += ch;
      await wait(42);
    }
  };
  const erase = async () => {
    while (el.textContent.length) {
      el.textContent = el.textContent.slice(0, -1);
      await wait(22);
    }
  };

  // loop until page unload
  while (true) {
    await type(roles[i]);
    await wait(1600);
    await erase();
    await wait(280);
    i = (i + 1) % roles.length;
  }
}

function initProgress(lenis) {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = (progress) => {
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };
  if (lenis) {
    lenis.on('scroll', ({ progress }) => update(progress));
  } else {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      update(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

function initCursor() {
  const root = document.getElementById('cursor');
  if (!root || !finePointer()) return;
  document.documentElement.classList.add('has-cursor');
  const dot = root.querySelector('.cursor__dot');
  const ring = root.querySelector('.cursor__ring');
  let x = 0;
  let y = 0;
  let rx = 0;
  let ry = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      root.classList.add('is-on');
    },
    { passive: true },
  );

  const tick = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    if (dot) dot.style.transform = `translate(${x}px, ${y}px)`;
    if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  document.addEventListener('pointerover', (e) => {
    const hit = e.target.closest('a, button, .magnetic, .deck__card, .skill-card, input');
    root.classList.toggle('is-hot', Boolean(hit));
  });
}

function initMagnetic() {
  if (!finePointer()) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = 22;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx / strength}px, ${dy / strength}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

async function loadMotionLibs() {
  try {
    const [gsapMod, stMod, lenisMod] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]);
    const gsap = gsapMod.gsap || gsapMod.default;
    const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
    const Lenis = lenisMod.default || lenisMod.Lenis;
    if (!gsap || !ScrollTrigger || !Lenis) throw new Error('Motion exports missing');
    return { gsap, ScrollTrigger, Lenis };
  } catch (err) {
    console.warn('Motion libraries unavailable; using CSS-only motion.', err);
    return null;
  }
}

function initLenis(Lenis, gsap, ScrollTrigger, reducedMotion) {
  if (reducedMotion || !Lenis) return null;
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    autoRaf: false,
  });

  if (gsap && ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    const loop = (time) => {
      lenis.raf(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  return lenis;
}

/**
 * @param {{ reducedMotion: boolean }} opts
 */
export async function initMotion(opts) {
  const reducedMotion = Boolean(opts?.reducedMotion);

  if (reducedMotion) {
    document.documentElement.classList.add('is-reduced');
    initProgress(null);
    return { lenis: null };
  }

  const libs = await loadMotionLibs();
  let lenis = null;
  if (libs) {
    libs.gsap.registerPlugin(libs.ScrollTrigger);
    lenis = initLenis(libs.Lenis, libs.gsap, libs.ScrollTrigger, reducedMotion);
  }

  initProgress(lenis);
  initCursor();
  initMagnetic();

  return { lenis };
}
