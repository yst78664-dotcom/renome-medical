// Language toggle
const LANG_KEY = 'renome_lang';
function getLang() { return localStorage.getItem(LANG_KEY) || (navigator.language.startsWith('zh') ? 'cn' : 'en'); }
function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-cn]').forEach(el => {
    el.textContent = lang === 'cn' ? el.dataset.cn : el.dataset.en;
  });
  document.querySelectorAll('[data-cn-html]').forEach(el => {
    el.innerHTML = lang === 'cn' ? el.dataset.cnHtml : el.dataset.enHtml;
  });
  document.querySelectorAll('[data-cn-placeholder]').forEach(el => {
    el.placeholder = lang === 'cn' ? el.dataset.cnPlaceholder : el.dataset.enPlaceholder;
  });
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = lang === 'cn' ? 'EN' : '中文';
  });
  // Update page title
  const t = document.querySelector('title');
  if (t && t.dataset.cn) t.textContent = lang === 'cn' ? t.dataset.cn : t.dataset.en;
}
function toggleLang() { setLang(getLang() === 'cn' ? 'en' : 'cn'); }

// Mobile nav
function toggleNav() { document.querySelector('.nav').classList.toggle('open'); }

// Scroll animations
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Active nav link
function updateActiveNav() {
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.nav a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
}

// Carousel
let carouselIndex = 0;
let carouselTimer = null;
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!dotsContainer || !slides.length) return;
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  carouselTimer = setInterval(() => slideCarousel(1), 4000);
}
function goToSlide(i) {
  const track = document.querySelector('.carousel-track');
  const slides = track.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  carouselIndex = ((i % slides.length) + slides.length) % slides.length;
  track.style.transform = 'translateX(-' + (carouselIndex * 100) + '%)';
  dots.forEach((d, j) => d.classList.toggle('active', j === carouselIndex));
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = setInterval(() => slideCarousel(1), 4000); }
}
function slideCarousel(dir) { goToSlide(carouselIndex + dir); }

// Partner Carousel
let partnerIdx = 0;
function getVisibleCards() {
  const w = window.innerWidth;
  if (w <= 768) return 2;
  if (w <= 992) return 3;
  return 4;
}
function initPartnerCarousel() {
  const track = document.getElementById('partnerTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.carousel-card');
  const dotsC = document.getElementById('carouselDots');
  if (!dotsC) return;
  const visible = getVisibleCards();
  const pages = Math.max(1, cards.length - visible + 1);
  dotsC.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => movePartner(i);
    dotsC.appendChild(d);
  }
  partnerIdx = 0;
  updatePartnerPos();
  // Touch/swipe support
  let startX = 0;
  const vp = track.parentElement;
  vp.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
  vp.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) partnerCarousel(diff > 0 ? 1 : -1);
  });
}
function movePartner(i) {
  const track = document.getElementById('partnerTrack');
  const cards = track.querySelectorAll('.carousel-card');
  const visible = getVisibleCards();
  const maxIdx = Math.max(0, cards.length - visible);
  partnerIdx = Math.max(0, Math.min(i, maxIdx));
  updatePartnerPos();
}
function updatePartnerPos() {
  const track = document.getElementById('partnerTrack');
  const cards = track.querySelectorAll('.carousel-card');
  if (!cards.length) return;
  const cardW = cards[0].offsetWidth + 20; // margin
  track.style.transform = 'translateX(-' + (partnerIdx * cardW) + 'px)';
  const dots = document.querySelectorAll('#carouselDots .carousel-dot');
  dots.forEach((d, j) => d.classList.toggle('active', j === partnerIdx));
}
function partnerCarousel(dir) {
  const track = document.getElementById('partnerTrack');
  const cards = track.querySelectorAll('.carousel-card');
  const visible = getVisibleCards();
  const maxIdx = Math.max(0, cards.length - visible);
  movePartner(partnerIdx + dir);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setLang(getLang());
  initAnimations();
  updateActiveNav();
  initCarousel();
  initPartnerCarousel();
  window.addEventListener('resize', initPartnerCarousel);
  // Close mobile nav on link click
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav').classList.remove('open')));
});
