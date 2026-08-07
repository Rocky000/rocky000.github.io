import * as THREE from 'three';

const PARTICLE_COUNT_DESKTOP = 2600;
const PARTICLE_COUNT_MOBILE = 900;
const FIELD_RADIUS = 46;

/**
 * Drifting particle field with a wireframe icosahedron core.
 * Returns null when WebGL is unavailable so the caller can fall back to CSS.
 */
export function initHeroScene(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.devicePixelRatio < 2,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    console.warn('Hero scene: WebGL unavailable.', err);
    return null;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.016);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 220);
  camera.position.set(0, 0, 46);

  const group = new THREE.Group();
  scene.add(group);

  /* ------------------------------------------------------- particles --- */

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const drift = new Float32Array(count);

  const cyan = new THREE.Color(0x38e8e1);
  const violet = new THREE.Color(0x8b7bff);
  const tint = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Even-ish distribution inside a sphere shell.
    const r = FIELD_RADIUS * Math.cbrt(0.25 + Math.random() * 0.75);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
    positions[i * 3 + 2] = r * Math.cos(phi);

    tint.copy(cyan).lerp(violet, Math.random());
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;

    scales[i] = 0.4 + Math.random() * 1.5;
    drift[i] = Math.random() * Math.PI * 2;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  const particleMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: (isMobile ? 42 : 58) * Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      uniform float uTime;
      uniform float uSize;
      varying vec3 vColor;
      varying float vFade;

      void main() {
        vColor = color;
        vec3 pos = position;
        pos.y += sin(uTime * 0.35 + position.x * 0.07) * 1.4;
        pos.x += cos(uTime * 0.28 + position.z * 0.06) * 1.1;

        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * aScale / -mv.z;
        vFade = smoothstep(115.0, 18.0, -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vFade;

      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float alpha = pow(1.0 - d * 2.0, 1.7) * vFade;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  /* ------------------------------------------------------------ core --- */

  const core = new THREE.Group();
  core.position.set(11, 1.5, -6);
  group.add(core);

  const shellGeo = new THREE.IcosahedronGeometry(9.5, 1);
  const shell = new THREE.LineSegments(
    new THREE.WireframeGeometry(shellGeo),
    new THREE.LineBasicMaterial({ color: 0x38e8e1, transparent: true, opacity: 0.38 }),
  );
  core.add(shell);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(5.6, 0),
    new THREE.MeshBasicMaterial({
      color: 0x8b7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    }),
  );
  core.add(inner);

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0x9ff6f2, transparent: true, opacity: 0.55 }),
  );
  core.add(nucleus);

  // Orbiting rings, a nod to availability zones.
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38e8e1,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(12 + i * 2.6, 0.045, 8, 128), ringMat);
    ring.rotation.x = Math.PI / 2 + (i - 1) * 0.42;
    ring.rotation.y = i * 0.3;
    core.add(ring);
    rings.push(ring);
  }

  /* -------------------------------------------------------- interaction --- */

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const onPointerMove = (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  let scrollProgress = 0;
  const onScroll = () => {
    scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------ resize --- */

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Pull the core toward centre on narrow screens so it is not cropped.
    core.position.x = w < 900 ? 0 : 11;
    camera.updateProjectionMatrix();
  };
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  /* ------------------------------------------------------------- loop --- */

  const clock = new THREE.Clock();
  let frame = null;
  let running = false;

  const render = () => {
    const t = clock.getElapsedTime();

    pointer.x += (target.x - pointer.x) * 0.045;
    pointer.y += (target.y - pointer.y) * 0.045;

    particleMat.uniforms.uTime.value = t;

    group.rotation.y = t * 0.026 + pointer.x * 0.28;
    group.rotation.x = pointer.y * 0.16;

    core.rotation.y = t * 0.13;
    core.rotation.x = Math.sin(t * 0.22) * 0.14;
    inner.rotation.y = -t * 0.32;
    inner.rotation.z = t * 0.18;
    nucleus.scale.setScalar(1 + Math.sin(t * 1.7) * 0.09);

    rings.forEach((ring, i) => {
      ring.rotation.z = t * (0.1 + i * 0.05) * (i % 2 ? -1 : 1);
    });

    // Drift the camera back slightly as the hero scrolls away.
    camera.position.z = 46 + scrollProgress * 14;
    camera.position.y = -scrollProgress * 5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  const tick = () => {
    frame = requestAnimationFrame(tick);
    render();
  };

  const start = () => {
    if (running || reduceMotion) return;
    running = true;
    clock.start();
    tick();
  };

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
    frame = null;
  };

  if (reduceMotion) {
    // One static frame, no animation loop.
    render();
  } else {
    start();
  }

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  // Pause when the hero has scrolled out of view.
  const visibilityObserver = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0 },
  );
  visibilityObserver.observe(canvas);

  return {
    dispose() {
      stop();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      particleGeo.dispose();
      particleMat.dispose();
      shellGeo.dispose();
      renderer.dispose();
    },
  };
}
