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

// Init
document.addEventListener('DOMContentLoaded', () => {
  setLang(getLang());
  initAnimations();
  updateActiveNav();
  initCarousel();
  // Close mobile nav on link click
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav').classList.remove('open')));
});
