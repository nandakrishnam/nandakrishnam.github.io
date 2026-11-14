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
