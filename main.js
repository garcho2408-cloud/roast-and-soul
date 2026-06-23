// ===== SMOOTH SECTION SCROLL =====
const fpSections = Array.from(document.querySelectorAll('section, footer'));
let isScrolling = false;

function getCurrentIndex() {
  const mid = window.innerHeight / 2;
  return fpSections.reduce((closest, section, i) => {
    const rect = section.getBoundingClientRect();
    const dist = Math.abs(rect.top + rect.height / 2 - mid);
    return dist < closest.dist ? { i, dist } : closest;
  }, { i: 0, dist: Infinity }).i;
}

function scrollToSection(index) {
  if (index < 0 || index >= fpSections.length || isScrolling) return;
  isScrolling = true;
  fpSections[index].scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { isScrolling = false; }, 900);
}

// Колесо мыши
window.addEventListener('wheel', (e) => {
  if (isScrolling) return;
  const idx = getCurrentIndex();
  scrollToSection(e.deltaY > 0 ? idx + 1 : idx - 1);
}, { passive: true });

// Свайп — только на десктопе, на мобильном нативный скролл
if (window.innerWidth >= 641) {
  let touchStartY = null;
  window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (touchStartY === null) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) scrollToSection(getCurrentIndex() + (diff > 0 ? 1 : -1));
    touchStartY = null;
  }, { passive: true });
}

// Клавиатура
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); scrollToSection(getCurrentIndex() + 1); }
  if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); scrollToSection(getCurrentIndex() - 1); }
});

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Hero image load animation
const heroBg = document.querySelector('.hero__bg');
if (heroBg) heroBg.classList.add('loaded');

// Burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');

function closeMenu() {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
}

function openMenu() {
  burger.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.classList.add('open');
}

burger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

navClose.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Intersection Observer — fade animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right')
  .forEach(el => observer.observe(el));

// Menu tabs
document.querySelectorAll('.menu__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu__tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu__panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
  });
});

// Modal gallery
const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
const modal       = document.getElementById('modal');
const modalImg    = document.getElementById('modalImg');
const modalCaption= document.getElementById('modalCaption');
let currentPhoto  = 0;

const photos = galleryItems.map(item => ({
  bg:      getComputedStyle(item.querySelector('.gallery__img')).backgroundImage,
  caption: item.querySelector('.gallery__caption').textContent
}));

function openModal(index) {
  currentPhoto = index;
  modalImg.style.backgroundImage = photos[index].bg;
  modalCaption.textContent = photos[index].caption;
  modal.classList.add('open');
  document.documentElement.style.overflowY = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.documentElement.style.overflowY = '';
}

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  modalImg.style.backgroundImage = photos[currentPhoto].bg;
  modalCaption.textContent = photos[currentPhoto].caption;
}

galleryItems.forEach((item, i) => item.addEventListener('click', () => openModal(i)));
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalPrev').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.getElementById('modalNext').addEventListener('click', () => showPhoto(currentPhoto + 1));
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  if (e.key === 'ArrowLeft')  showPhoto(currentPhoto - 1);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Сообщение отправлено ✓';
  btn.style.background = '#4a9c6a';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Отправить сообщение';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
});
