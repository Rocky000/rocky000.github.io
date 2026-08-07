import * as THREE from 'three';

const PLANE_HEIGHT = 5.2;
const RADIUS = 9.4;
const DRAG_SENSITIVITY = 0.0075;
const FRICTION = 0.94;
const SNAP_STRENGTH = 0.09;

/**
 * Cylindrical photo carousel. Drag, scroll, or step with the nav buttons.
 * Returns null when WebGL is unavailable so the caller can render a CSS grid.
 *
 * @param {object} opts
 * @param {HTMLCanvasElement} opts.canvas
 * @param {HTMLElement} opts.container
 * @param {Array<{src:string, ratio:number, caption:string, alt:string}>} opts.items
 * @param {(item:object)=>void} opts.onSelect  fired on click/tap of the front photo
 * @param {(item:object)=>void} opts.onFocus   fired when the front photo changes
 */
export function initGalleryScene({ canvas, container, items, onSelect, onFocus }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    console.warn('Gallery scene: WebGL unavailable.', err);
    return null;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  // The front plane sits RADIUS closer than the camera, so the distance has to
  // clear PLANE_HEIGHT at that depth or the leading photo gets cropped.
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 19.5);
  camera.lookAt(0, 0, 0);

  const wheel = new THREE.Group();
  scene.add(wheel);

  const count = items.length;
  const step = (Math.PI * 2) / count;

  const placeholder = new THREE.MeshBasicMaterial({
    color: 0x141a2c,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });

  const loader = new THREE.TextureLoader();
  const cards = [];
  const disposables = [];

  items.forEach((item, i) => {
    const width = PLANE_HEIGHT * item.ratio;
    const geo = new THREE.PlaneGeometry(width, PLANE_HEIGHT, 1, 1);
    const mat = placeholder.clone();
    const mesh = new THREE.Mesh(geo, mat);

    const angle = i * step;
    mesh.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
    mesh.rotation.y = angle;
    mesh.userData = { index: i, item, angle, loaded: false };

    // Soft frame around each photo.
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0x38e8e1, transparent: true, opacity: 0.25 }),
    );
    mesh.add(frame);

    wheel.add(mesh);
    cards.push(mesh);
    disposables.push(geo, mat, frame.geometry, frame.material);
  });

  // Floor reflection hint.
  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(RADIUS + 3, 64),
    new THREE.MeshBasicMaterial({ color: 0x38e8e1, transparent: true, opacity: 0.028 }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -PLANE_HEIGHT / 2 - 1.2;
  scene.add(glow);
  disposables.push(glow.geometry, glow.material);

  /* ------------------------------------------------------ lazy loading --- */

  let texturesRequested = false;

  const loadTextures = () => {
    if (texturesRequested) return;
    texturesRequested = true;

    cards.forEach((mesh) => {
      loader.load(
        mesh.userData.item.src,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;

          mesh.material.map = texture;
          mesh.material.color.set(0xffffff);
          mesh.material.needsUpdate = true;
          mesh.userData.loaded = true;
          disposables.push(texture);
          requestRender();
        },
        undefined,
        () => console.warn('Gallery: failed to load', mesh.userData.item.src),
      );
    });
  };

  /* -------------------------------------------------------- interaction --- */

  let rotation = 0;
  let velocity = 0;
  let dragging = false;
  let pointerId = null;
  let lastX = 0;
  let moved = 0;
  let focusIndex = -1;

  const nearestIndex = () => {
    const idx = Math.round(-rotation / step) % count;
    return (idx + count) % count;
  };

  const emitFocus = () => {
    const idx = nearestIndex();
    if (idx !== focusIndex) {
      focusIndex = idx;
      onFocus?.(items[idx]);
    }
  };

  const onPointerDown = (e) => {
    if (pointerId !== null) return;
    pointerId = e.pointerId;
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    velocity = 0;
    canvas.classList.add('is-dragging');
    canvas.setPointerCapture?.(e.pointerId);
    wake();
  };

  const onPointerMove = (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    rotation += dx * DRAG_SENSITIVITY;
    velocity = dx * DRAG_SENSITIVITY;
    wake();
  };

  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    canvas.classList.remove('is-dragging');

    // A tap with almost no movement opens the front photo.
    if (moved < 6) {
      const idx = nearestIndex();
      onSelect?.(items[idx]);
    }
    wake();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  const onWheel = (e) => {
    // Only hijack the wheel for clearly horizontal / trackpad-x gestures.
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    rotation -= e.deltaX * 0.0022;
    velocity = -e.deltaX * 0.0022;
    wake();
  };
  canvas.addEventListener('wheel', onWheel, { passive: false });

  const rotateBy = (steps) => {
    rotation -= steps * step;
    velocity = 0;
    wake();
  };

  /* ------------------------------------------------------------ resize --- */

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Pull back further on narrow screens so neighbours stay visible.
    camera.position.z = w < 700 ? 22 : 19.5;
    camera.fov = w < 700 ? 46 : 42;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
    requestRender();
  };

  /* ------------------------------------------------------------- loop --- */

  let frame = null;
  let running = false;
  let idleFrames = 0;
  let inView = false;

  function renderOnce() {
    updateTransforms();
    renderer.render(scene, camera);
  }

  function requestRender() {
    if (running) return;
    if (inView) wake();
    else renderOnce();
  }

  function updateTransforms() {
    wheel.rotation.y = rotation;

    cards.forEach((mesh) => {
      // Angle of this card relative to the camera-facing front position.
      let delta = (mesh.userData.angle + rotation) % (Math.PI * 2);
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;

      const facing = Math.cos(delta); // 1 at the front, -1 at the back
      const front = Math.max(facing, 0);

      mesh.material.opacity = 0.2 + front * 0.8;
      const scale = 0.82 + front * 0.18;
      mesh.scale.setScalar(scale);
      mesh.position.y = Math.sin(delta * 2) * 0.22;

      const frameLine = mesh.children[0];
      if (frameLine) frameLine.material.opacity = 0.08 + front * 0.4;
    });
  }

  const tick = () => {
    frame = requestAnimationFrame(tick);

    if (!dragging) {
      // Snap toward the nearest photo once the fling has slowed down.
      if (Math.abs(velocity) < 0.0035) {
        const targetRotation = -nearestIndex() * step;
        let diff = targetRotation - rotation;
        diff -= Math.round(diff / (Math.PI * 2)) * (Math.PI * 2);
        rotation += diff * SNAP_STRENGTH;
        if (Math.abs(diff) > 0.0004) idleFrames = 0;
        else idleFrames++;
      } else {
        rotation += velocity;
        velocity *= FRICTION;
        idleFrames = 0;
      }
    } else {
      idleFrames = 0;
    }

    emitFocus();
    renderOnce();

    // Park the loop once everything has settled; any input wakes it again.
    if (idleFrames > 30) stop();
  };

  function wake() {
    idleFrames = 0;
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

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (inView) wake();
  };
  document.addEventListener('visibilitychange', onVisibility);

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const viewObserver = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        loadTextures();
        emitFocus();
        wake();
      } else {
        stop();
      }
    },
    { threshold: 0.05 },
  );
  viewObserver.observe(container);

  if (reduceMotion) {
    loadTextures();
    renderOnce();
  }

  return {
    next: () => rotateBy(1),
    prev: () => rotateBy(-1),
    goTo: (index) => {
      rotation = -index * step;
      velocity = 0;
      wake();
    },
    current: () => items[nearestIndex()],
    dispose() {
      stop();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      document.removeEventListener('visibilitychange', onVisibility);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      disposables.forEach((d) => d.dispose?.());
      placeholder.dispose();
      renderer.dispose();
    },
  };
}
