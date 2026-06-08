/* =============================================
   THAIS COUTO — script.js
   ============================================= */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── HEADER SCROLL ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── MOBILE NAV ─── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
let navOpen = false;

hamburger.addEventListener('click', () => {
  navOpen = !navOpen;
  mobileNav.classList.toggle('open', navOpen);
  document.body.style.overflow = navOpen ? 'hidden' : '';
  const spans = hamburger.querySelectorAll('span');
  if (navOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    navOpen = false;
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ─── GSAP SETUP ─── */
gsap.registerPlugin(ScrollTrigger);

/* ─── HERO ANIMATIONS ─── */
if (!prefersReducedMotion) {
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .to('#hero-eyebrow',  { opacity: 1, y: 0, duration: 0.7 }, 0.3)
    .to('#hero-title',    { opacity: 1, y: 0, duration: 0.9 }, 0.55)
    .to('#hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.75)
    .to('#hero-actions',  { opacity: 1, y: 0, duration: 0.7 }, 0.95)
    .to('#hero-badge',    { opacity: 1, y: 0, duration: 0.6 }, 1.1)
    .to('#hero-visual',   { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.4);

  gsap.set(['#hero-eyebrow','#hero-title','#hero-subtitle','#hero-actions','#hero-badge'],
    { y: 28 });

  /* ─── TREE BRANCH DRAW ANIMATION ─── */
  const branches = ['#trunk','#branch-l1','#branch-r1','#branch-l2','#branch-r2',
                    '#branch-top','#branch-tl','#branch-tr','#branch-sub-l','#branch-sub-r'];

  branches.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const len = el.getTotalLength ? el.getTotalLength() : 200;
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });

  gsap.to(branches, {
    strokeDashoffset: 0,
    duration: 1.8,
    ease: 'power2.inOut',
    stagger: 0.08,
    delay: 0.5
  });

  gsap.fromTo('#foliage', { opacity: 0, scale: 0.7, transformOrigin: 'center center' },
    { opacity: 0.92, scale: 1, duration: 1.2, ease: 'back.out(1.4)', delay: 1.4 });

  /* ─── FLOATING LEAVES ─── */
  createFloatingLeaves();
} else {
  gsap.set(['#hero-eyebrow','#hero-title','#hero-subtitle','#hero-actions','#hero-badge','#hero-visual'],
    { opacity: 1, y: 0 });
}

function createFloatingLeaves() {
  const container = document.getElementById('leaves-container');
  if (!container) return;

  const leafPositions = [
    { x: 196, y: 130 }, { x: 130, y: 240 }, { x: 270, y: 228 },
    { x: 175, y: 155 }, { x: 220, y: 152 }, { x: 100, y: 152 },
    { x: 290, y: 145 }, { x: 68, y: 235 }, { x: 334, y: 224 }
  ];

  leafPositions.forEach((pos, i) => {
    const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    leaf.setAttribute('cx', pos.x);
    leaf.setAttribute('cy', pos.y);
    leaf.setAttribute('rx', 5 + Math.random() * 3);
    leaf.setAttribute('ry', 3 + Math.random() * 2);
    leaf.setAttribute('fill', i % 3 === 0 ? '#6BBFB5' : i % 3 === 1 ? '#5AAFA5' : '#8ED4CC');
    leaf.setAttribute('opacity', '0');
    leaf.style.transformOrigin = `${pos.x}px ${pos.y}px`;
    container.appendChild(leaf);

    const delay   = i * 0.6 + Math.random() * 1.2;
    const floatX  = (Math.random() - 0.5) * 60;
    const floatY  = -(40 + Math.random() * 60);
    const dur     = 3.5 + Math.random() * 2.5;

    gsap.timeline({ repeat: -1, delay })
      .set(leaf, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 0.8 })
      .to(leaf, { opacity: 0.75, duration: 0.4, ease: 'power1.out' })
      .to(leaf, {
        x: floatX,
        y: floatY,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.5,
        opacity: 0,
        duration: dur,
        ease: 'power1.inOut'
      }, '-=0.2');
  });
}

/* ─── SCROLL ANIMATIONS ─── */
function animateOnScroll(selector, vars, triggerVars = {}) {
  gsap.utils.toArray(selector).forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
        ...triggerVars
      },
      ...vars
    });
  });
}

/* Sobre */
gsap.from('.sobre-image', {
  scrollTrigger: { trigger: '.sobre-inner', start: 'top 80%' },
  opacity: 0, x: -40, duration: 1, ease: 'power3.out'
});
gsap.from('.sobre-text', {
  scrollTrigger: { trigger: '.sobre-inner', start: 'top 80%' },
  opacity: 0, x: 40, duration: 1, ease: 'power3.out', delay: 0.15
});

/* Section headers */
gsap.utils.toArray('.section-header').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0, y: 30, duration: 0.8, ease: 'power2.out'
  });
});

/* Áreas */
gsap.utils.toArray('.area-item').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
    delay: i * 0.1
  });
});

/* Serviços */
gsap.utils.toArray('.servico-row').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: '.servicos-lista', start: 'top 82%' },
    opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
    delay: i * 0.07
  });
});

gsap.from('.servicos-cta', {
  scrollTrigger: { trigger: '.servicos-cta', start: 'top 88%' },
  opacity: 0, y: 24, duration: 0.8, ease: 'power2.out'
});

/* Consultório grid */
gsap.to('.consultorio-grid', {
  scrollTrigger: { trigger: '.consultorio-grid', start: 'top 85%' },
  opacity: 1, y: 0, duration: 0.9, ease: 'power2.out'
});

gsap.from('.consultorio-address', {
  scrollTrigger: { trigger: '.consultorio-address', start: 'top 90%' },
  opacity: 0, y: 20, duration: 0.7, ease: 'power2.out'
});

/* Timeline */
gsap.to('#timeline-line', {
  scrollTrigger: {
    trigger: '.timeline',
    start: 'top 75%',
    end: 'bottom 80%',
    scrub: 1
  },
  height: '100%',
  ease: 'none'
});

gsap.utils.toArray('.timeline-item').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
    delay: i * 0.1
  });
});

/* CTA section */
gsap.from('.cta-inner', {
  scrollTrigger: { trigger: '.cta-final', start: 'top 80%' },
  opacity: 0, y: 30, duration: 0.9, ease: 'power2.out'
});

/* ─── DEPOIMENTOS SLIDER ─── */
(function initSlider() {
  const track = document.getElementById('depoimentos-track');
  const cards = track ? track.querySelectorAll('.depoimento-card') : [];
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!track || cards.length === 0) return;

  let cardsPerView = getCardsPerView();
  let current = 0;
  const total = cards.length;
  const maxIndex = Math.max(0, total - cardsPerView);

  function getCardsPerView() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function getCardWidth() {
    const card = cards[0];
    const gap = 24;
    return card.offsetWidth + gap;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(total / cardsPerView);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Página ${i + 1}`);
      dot.addEventListener('click', () => goTo(i * cardsPerView));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    const activePage = Math.floor(current / cardsPerView);
    dots.forEach((d, i) => d.classList.toggle('active', i === activePage));
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    const offset = current * getCardWidth();
    gsap.to(track, { x: -offset, duration: 0.5, ease: 'power2.inOut' });
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - cardsPerView));
  nextBtn.addEventListener('click', () => goTo(current + cardsPerView));

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  buildDots();

  window.addEventListener('resize', () => {
    const newCPV = getCardsPerView();
    if (newCPV !== cardsPerView) {
      cardsPerView = newCPV;
      current = 0;
      gsap.set(track, { x: 0 });
      buildDots();
    }
  });

  /* Animate cards on scroll reveal */
  gsap.from('.depoimento-card', {
    scrollTrigger: { trigger: '.depoimentos-slider-wrap', start: 'top 85%' },
    opacity: 0, y: 28, duration: 0.6, ease: 'power2.out', stagger: 0.1
  });
})();

/* ─── SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
