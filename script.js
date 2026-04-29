(function () {
  'use strict';

  // ── Year ──────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Custom Cursor ────────────────────────────
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    // Smooth cursor follow
    function animateCursor() {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover expansion on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ── Nav scroll class ─────────────────────────
  const navbar = document.getElementById('navbar');

  // ── Back to top ──────────────────────────────
  const btt = document.getElementById('backToTop');
  if (btt) {
    btt.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  // ── Active nav + back-to-top (single merged listener) ──
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const NAV_H     = parseInt(getComputedStyle(document.documentElement)
                              .getPropertyValue('--nav-h')) || 72;

  function onScroll() {
    const scrollY = window.pageYOffset;

    // Navbar border on scroll
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 10);

    // Back to top visibility
    if (btt) btt.classList.toggle('visible', scrollY > 400);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - NAV_H - 60) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Smooth scroll with nav offset ────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.pageYOffset - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // ── Hamburger / Mobile menu ───────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) closeMobileMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  // ── Intersection Observer — reveal animations ──
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ── Animated stat counters ───────────────────
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1200;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  // ── Contact form ─────────────────────────────
  const form     = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      // Simulate submission (replace with real endpoint / EmailJS / Formspree)
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        if (formNote) {
          formNote.textContent = '✓ Message sent! I\'ll get back to you soon.';
          formNote.style.color = 'var(--accent)';
        }
        form.reset();
        setTimeout(() => { if (formNote) formNote.textContent = ''; }, 5000);
      }, 1400);
    });
  }

})();
