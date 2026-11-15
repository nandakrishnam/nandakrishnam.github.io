// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Typing effect for the tagline
const phrases = [
  'Security Researcher',
  'Bug Bounty Hunter',
  'Offensive Security Consultant',
];
const typed = document.getElementById('typed');

if (!typed) {
  // no tagline on this page
} else if (reduceMotion) {
  typed.textContent = phrases.join(' | ');
} else {
  let p = 0, i = 0, deleting = false;
  (function tick() {
    const word = phrases[p];
    typed.textContent = word.slice(0, i);
    if (!deleting && i < word.length) { i++; setTimeout(tick, 80); }
    else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
    else if (i > 0) { i--; setTimeout(tick, 40); }
    else { deleting = false; p = (p + 1) % phrases.length; setTimeout(tick, 300); }
  })();
}

// Rising particles
const particleBox = document.querySelector('.particles');
if (!reduceMotion && particleBox) {
  const container = particleBox;
  const count = window.innerWidth < 600 ? 18 : 36;
  for (let n = 0; n < count; n++) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.animationDuration = 8 + Math.random() * 10 + 's';
    dot.style.animationDelay = -Math.random() * 18 + 's';
    container.appendChild(dot);
  }
}

// Reveal sections on scroll
const sections = document.querySelectorAll('.section');
if ('IntersectionObserver' in window && !reduceMotion) {
  sections.forEach(s => s.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  sections.forEach(s => io.observe(s));
}

// Email: assembled in the browser so the address never appears in the page source
document.querySelectorAll('.email-link').forEach(a => {
  const rev = str => str.split('').reverse().join('');
  const addr = rev(a.dataset.u) + '@' + rev(a.dataset.d);
  a.href = 'mailto:' + addr;
  a.textContent = addr;
});

// Go to top button: shows after scrolling down, scrolls smoothly back up
const toTop = document.querySelector('.to-top');
if (toTop) {
  const update = () => toTop.classList.toggle('show', window.scrollY > 400);
  window.addEventListener('scroll', update, { passive: true });
  update();
  toTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname + location.search);
  });
}

// Particle field background: white 3D particles with glow, twinkle,
// mouse parallax, click burst and an intro animation (plain canvas, no libraries)
const field = document.querySelector('.particle-field');
if (field && field.getContext) {
  const cfg = {
    count: window.innerWidth < 600 ? 120 : 200,
    spread: 10,           // radius of the particle cloud
    speed: 0.1,           // rotation / drift speed
    baseSize: 100,        // point size before perspective
    sizeRandomness: 1,
    glow: 0.5,
    twinkle: 0.3,
    hoverFactor: 1,       // parallax strength
    cameraDistance: 20,
    color: '239, 68, 68',  // site red (#ef4444)
  };

  const ctx = field.getContext('2d');
  let W = 0, H = 0, dpr = 1, focal = 1;

  // Soft glowing dot, drawn once and reused for every particle
  const sprite = document.createElement('canvas');
  const S = 64;
  sprite.width = sprite.height = S;
  const sctx = sprite.getContext('2d');
  const g = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, `rgba(${cfg.color}, 1)`);
  g.addColorStop(0.18, `rgba(${cfg.color}, 1)`);
  g.addColorStop(0.3, `rgba(${cfg.color}, ${0.35 * cfg.glow * 2})`);
  g.addColorStop(1, `rgba(${cfg.color}, 0)`);
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, S, S);

  // Random points spread evenly inside a sphere
  const pts = [];
  for (let i = 0; i < cfg.count; i++) {
    let x, y, z, d;
    do { x = Math.random() * 2 - 1; y = Math.random() * 2 - 1; z = Math.random() * 2 - 1; d = x * x + y * y + z * z; }
    while (d > 1 || d === 0);
    const r = Math.cbrt(Math.random());
    const len = Math.sqrt(d);
    pts.push({
      x: (x / len) * r * cfg.spread,
      y: (y / len) * r * cfg.spread,
      z: (z / len) * r * cfg.spread,
      size: 1 + cfg.sizeRandomness * (Math.random() - 0.5),
      wob: Math.random() * 1.4 + 0.1,     // how far it wanders
      wobSpeed: Math.random() * 2 + 0.5,
      phase: Math.random() * Math.PI * 2,
      twSpeed: Math.random() * 2 + 1,
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    field.width = W * dpr; field.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // fit the cloud to the window so particles fill the whole background
    focal = (Math.max(W, H) / 2) / (cfg.spread * 0.9 / cfg.cameraDistance);
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse parallax (smoothed), click burst
  let mx = 0, my = 0, px = 0, py = 0, burst = 0;
  window.addEventListener('pointermove', e => {
    mx = (e.clientX / W) * 2 - 1;
    my = -((e.clientY / H) * 2 - 1);
  }, { passive: true });
  window.addEventListener('pointerdown', () => { burst = 1; }, { passive: true });

  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function draw(now) {
    const t = (now - start) / 1000;
    const intro = reduceMotion ? 1 : easeOut(Math.min(t / 1.6, 1));
    const time = t * cfg.speed * 10;

    px += (mx - px) * 0.05;
    py += (my - py) * 0.05;
    burst *= 0.94;

    const rx = Math.sin(time * 0.2) * 0.1;
    const ry = Math.cos(time * 0.5) * 0.15;
    const rz = time * 0.01 * 10 * cfg.speed;
    const sx = Math.sin(rx), cx = Math.cos(rx);
    const sy = Math.sin(ry), cy = Math.cos(ry);
    const sz = Math.sin(rz), cz = Math.cos(rz);
    const scale = intro * (1 + burst * 0.5);
    const offX = -px * cfg.hoverFactor, offY = -py * cfg.hoverFactor;

    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      // wander a little around the home position
      let x = p.x + Math.sin(time * p.wobSpeed + p.phase) * p.wob * 0.3;
      let y = p.y + Math.cos(time * p.wobSpeed * 0.8 + p.phase) * p.wob * 0.3;
      let z = p.z + Math.sin(time * p.wobSpeed * 0.6 + p.phase * 2) * p.wob * 0.3;
      x *= scale; y *= scale; z *= scale;

      // rotate the whole cloud (Z, then Y, then X)
      let x1 = x * cz - y * sz, y1 = x * sz + y * cz;
      let x2 = x1 * cy + z * sy, z2 = -x1 * sy + z * cy;
      let y3 = y1 * cx - z2 * sx, z3 = y1 * sx + z2 * cx;

      const depth = cfg.cameraDistance - z3;
      if (depth <= 0.5) continue;
      const k = focal / depth;
      const sxp = W / 2 + (x2 + offX) * k;
      const syp = H / 2 - (y3 + offY) * k;
      const r = (cfg.baseSize * p.size / depth) * 0.5 * (1 + cfg.glow * 2);
      if (sxp < -r || sxp > W + r || syp < -r || syp > H + r) continue;

      const tw = 1 - cfg.twinkle * (0.5 + 0.5 * Math.sin(t * p.twSpeed + p.phase));
      ctx.globalAlpha = tw * intro;
      ctx.drawImage(sprite, sxp - r, syp - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }

  if (reduceMotion) {
    draw(start + 2000);
    window.addEventListener('resize', () => draw(start + 2000));
  } else {
    let raf = 0;
    const loop = now => { draw(now); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    });
  }
}
