/* Christmas theme (seasonal layer). See christmas.css for how to remove. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  // ---- String lights under the header ----
  var header = document.querySelector('.site-header');
  if (header) {
    var lights = document.createElement('div');
    lights.className = 'xmas-lights';
    lights.setAttribute('aria-hidden', 'true');
    var colors = ['#ff4d5e', '#39ff8a', '#ffd166', '#00d9ff', '#c77dff'];
    var count = Math.max(12, Math.round(window.innerWidth / 55));
    for (var i = 0; i < count; i++) {
      var b = document.createElement('span');
      b.className = 'xmas-bulb';
      b.style.setProperty('--bulb', colors[i % colors.length]);
      b.style.setProperty('--delay', (i % 3) * 0.5 + 's');
      lights.appendChild(b);
    }
    header.appendChild(lights);
  }

  // ---- Santa hat on the r00t prompt ----
  var prompt = document.querySelector('.prompt');
  if (prompt) {
    prompt.insertAdjacentHTML('afterbegin',
      '<svg class="xmas-hat" viewBox="0 0 26 22" aria-hidden="true">' +
        '<path d="M3 17 C6 6 13 1 21 4 C18 6 17 10 18 17 Z" fill="#e11d2e"/>' +
        '<rect x="1" y="15.5" width="19" height="5" rx="2.5" fill="#f4f7fb"/>' +
        '<circle cx="22" cy="5" r="3" fill="#f4f7fb"/>' +
      '</svg>');
  }

  // ---- Hero greeting ----
  var tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    var g = document.createElement('p');
    g.className = 'xmas-greeting';
    g.innerHTML = '<span class="xmas-tree" aria-hidden="true">🎄</span> ' +
      '<span class="xmas-red">Merry Christmas</span> &amp; ' +
      '<span class="xmas-green">happy hacking!</span>';
    tagline.insertAdjacentElement('afterend', g);
  }

  // ---- Candy-cane stripe under terminal title bars ----
  document.querySelectorAll('.terminal-bar').forEach(function (bar) {
    var s = document.createElement('div');
    s.className = 'xmas-candy';
    s.setAttribute('aria-hidden', 'true');
    bar.insertAdjacentElement('afterend', s);
  });

  // ---- Footer wish ----
  var footer = document.querySelector('.site-footer');
  if (footer) {
    var f = document.createElement('p');
    f.className = 'xmas-footer';
    f.textContent = '❄ Season’s greetings ❄';
    footer.appendChild(f);
  }

  // ---- Snowfall ----
  if (reduceMotion) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'xmas-snow';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, flakes = [], running = false, raf = 0;

  function makeFlake(randomY) {
    var r = Math.random() * 2.2 + 0.8;
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : -10,
      r: r,
      vy: r * 0.35 + Math.random() * 0.4,
      drift: Math.random() * Math.PI * 2,
      sway: Math.random() * 0.6 + 0.2,
      a: Math.random() * 0.5 + 0.4
    };
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var target = Math.round(Math.min(160, (W * H) / 9000));
    while (flakes.length < target) flakes.push(makeFlake(true));
    flakes.length = target;
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < flakes.length; i++) {
      var p = flakes[i];
      p.drift += 0.01;
      p.y += p.vy;
      p.x += Math.sin(p.drift) * p.sway;
      if (p.y > H + 5 || p.x < -10 || p.x > W + 10) { flakes[i] = makeFlake(false); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 247, 251,' + p.a + ')';
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }

  function setSnow(on) {
    running = on;
    canvas.style.display = on ? '' : 'none';
    cancelAnimationFrame(raf);
    if (on) raf = requestAnimationFrame(tick);
    btn.textContent = on ? '❄ snow: on' : '❄ snow: off';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    store('xmas-snow', on ? 'on' : 'off');
  }

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'xmas-toggle';
  btn.setAttribute('aria-label', 'Toggle snowfall');
  btn.addEventListener('click', function () { setSnow(!running); });
  document.body.appendChild(btn);

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () {
    if (!running) return;
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(tick);
  });
  setSnow(store('xmas-snow') !== 'off');
})();
