/* BubbleMesh — interacciones de la landing */
(function () {
  'use strict';

  // ── Nav: fondo con blur al hacer scroll ──
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Menú móvil ──
  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', () => nav.classList.toggle('menu-open'));
  nav.querySelectorAll('.nav-links a').forEach((a) =>
    a.addEventListener('click', () => nav.classList.remove('menu-open'))
  );

  // ── FAQ acordeón ──
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : null;
    });
  });

  // ── Reveal al hacer scroll ──
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }
})();
