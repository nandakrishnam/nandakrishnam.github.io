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

  // ---- Santa hat on the hero name (tilted over the "N") ----
  var heroName = document.querySelector('.name-glitch');
  if (heroName) {
    heroName.insertAdjacentHTML('beforeend',
      '<svg class="xmas-hat xmas-hat-name" viewBox="0 0 26 22" aria-hidden="true">' +
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

  // ---- Hanging baubles in the hero corners ----
  var hero = document.querySelector('.hero');
  function bauble(color, len, side, offset, delay) {
    var id = 'xg' + Math.random().toString(36).slice(2, 8);
    var el = document.createElement('div');
    el.className = 'xmas-bauble' + (parseFloat(offset) > 12 ? ' xmas-mob-hide' : '');
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = side + ':' + offset + ';--len:' + len + 'px;animation-delay:' + delay + 's';
    el.innerHTML =
      '<svg viewBox="0 0 40 ' + (len + 46) + '" width="40" height="' + (len + 46) + '">' +
        '<defs><radialGradient id="' + id + '" cx="35%" cy="35%" r="70%">' +
          '<stop offset="0" stop-color="#fff" stop-opacity="0.9"/>' +
          '<stop offset="0.25" stop-color="' + color + '"/>' +
          '<stop offset="1" stop-color="#0d1420"/></radialGradient></defs>' +
        '<line x1="20" y1="0" x2="20" y2="' + len + '" stroke="#8a9bb4" stroke-width="1"/>' +
        '<rect x="15" y="' + len + '" width="10" height="7" rx="1.5" fill="#d4af37"/>' +
        '<circle cx="20" cy="' + (len + 24) + '" r="16" fill="url(#' + id + ')"/>' +
        '<path d="M6 ' + (len + 24) + ' Q20 ' + (len + 30) + ' 34 ' + (len + 24) + '" stroke="rgba(255,255,255,0.35)" stroke-width="2" fill="none"/>' +
      '</svg>';
    hero.appendChild(el);
  }
  if (hero) {
    bauble('#ff4d5e', 40, 'left', '4%', 0);
    bauble('#39ff8a', 90, 'left', '12%', -1.2);
    bauble('#ffd166', 20, 'left', '20%', -0.6);
    bauble('#00d9ff', 70, 'right', '6%', -0.9);
    bauble('#c77dff', 30, 'right', '15%', -1.8);
    bauble('#ff4d5e', 110, 'right', '23%', -0.3);
  }

  // ---- Holly sprigs on section titles ----
  var holly =
    '<svg class="xmas-holly" viewBox="0 0 34 22" aria-hidden="true">' +
      '<path d="M16 12 C10 2 2 6 1 4 C3 9 1 12 3 14 C6 12 9 15 16 12 Z" fill="#1f9d55"/>' +
      '<path d="M18 12 C24 2 32 6 33 4 C31 9 33 12 31 14 C28 12 25 15 18 12 Z" fill="#17844a"/>' +
      '<circle cx="14" cy="15" r="3" fill="#e11d2e"/><circle cx="20" cy="15" r="3" fill="#ff4d5e"/>' +
      '<circle cx="17" cy="11" r="3" fill="#c5152a"/>' +
    '</svg>';
  document.querySelectorAll('.section-title').forEach(function (t) {
    t.insertAdjacentHTML('beforeend', holly);
  });

  // ---- Snow caps on cards and panels ----
  var cap =
    '<svg class="xmas-snowcap" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0 6 Q4 0 12 1 L188 1 Q196 0 200 6 L200 8 Q192 8 190 11 Q186 14 182 10 Q170 7 160 9 ' +
      'Q150 13 146 9 Q130 6 118 8 Q112 14 106 9 Q90 6 76 9 Q70 13 64 9 Q50 6 38 8 Q30 12 26 9 Q14 6 8 9 Q4 12 2 9 L0 8 Z" fill="#f4f7fb"/>' +
    '</svg>';
  document.querySelectorAll('.card, .cert-card, .hof-panel').forEach(function (c) {
    c.classList.add('xmas-capped');
    c.insertAdjacentHTML('afterbegin', cap);
  });

  // ---- Snowfall ----
  if (reduceMotion) return;

  // ---- Santa's sleigh flies across the screen now and then ----
  function sleighRide() {
    if (document.hidden) return;
    var s = document.createElement('div');
    s.className = 'xmas-sleigh';
    s.setAttribute('aria-hidden', 'true');
    s.style.top = (12 + Math.random() * 22) + 'vh';
    s.innerHTML = '<span>🦌</span><span>🦌</span><span>🛷</span><span class="xmas-trail">✨</span>';
    document.body.appendChild(s);
    s.addEventListener('animationend', function () { s.remove(); });
  }
  setTimeout(sleighRide, 4000);
  setInterval(sleighRide, 28000);


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
