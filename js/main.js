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

// Init
document.addEventListener('DOMContentLoaded', () => {
  setLang(getLang());
  initAnimations();
  updateActiveNav();
  // Close mobile nav on link click
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav').classList.remove('open')));
});
