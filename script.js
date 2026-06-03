/* =============================================
   CIDCO ESTATE — LANDING PAGE SCRIPTS
   ============================================= */

(function () {
  'use strict';

  /* -------- HEADER SCROLL & SCROLLSPY -------- */
  const header = document.getElementById('site-header');
  const siteNav = document.getElementById('site-nav');
  const navLinks = siteNav.querySelectorAll('a');
  const sections = ['about', 'why', 'connectivity', 'projects', 'partners'].map(id => document.getElementById(id));

  window.addEventListener('scroll', () => {
    // Toggle header scrolled styling
    header.classList.toggle('scrolled', window.scrollY > 80);

    // Scrollspy to set active nav link
    let currentSectionId = '';
    const scrollPos = window.scrollY + 250;

    sections.forEach(sec => {
      if (sec && scrollPos >= sec.offsetTop) {
        currentSectionId = '#' + sec.id;
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentSectionId);
      });
    } else {
      navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === 0);
      });
    }
  }, { passive: true });


  /* -------- MOBILE MENU -------- */
  const menuToggle = document.getElementById('menu-toggle');

  menuToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Set active state on click
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -------- SCROLL DOWN CLICK -------- */
  const scrollDown = document.querySelector('.scroll-down');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const aboutSec = document.getElementById('about');
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  /* -------- HERO SLIDER -------- */
  const slides   = [...document.querySelectorAll('.hero-slide')];
  const dotsWrap = document.getElementById('hero-dots');
  const prevBtn  = document.getElementById('hero-prev');
  const nextBtn  = document.getElementById('hero-next');
  let   current  = 0;
  let   timer;
  const imageSlideDelay = 5500;

  // Build dot buttons
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.setAttribute('role', 'tab');
    if (i === 0) btn.classList.add('is-active');
    btn.addEventListener('click', () => { goTo(i); restart(); });
    dotsWrap.appendChild(btn);
  });

  const dots = [...dotsWrap.querySelectorAll('button')];

  function goTo(index) {
    const previousSlide = slides[current];
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');

    const previousVideo = previousSlide.querySelector('video');
    if (previousVideo && previousSlide !== slides[current]) {
      previousVideo.pause();
      previousVideo.currentTime = 0;
    }

    const activeVideo = slides[current].querySelector('video');
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
    }
  }

  function restart() {
    clearTimeout(timer);
    if (slides[current].querySelector('video')) return;
    timer = setTimeout(() => {
      goTo(current + 1);
      restart();
    }, imageSlideDelay);
  }

  slides.forEach(slide => {
    const video = slide.querySelector('video');
    if (!video) return;
    video.addEventListener('ended', () => {
      if (slides[current] !== slide) return;
      goTo(current + 1);
      restart();
    });
  });

  prevBtn.addEventListener('click', () => { goTo(current - 1); restart(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); restart(); });

  // Touch swipe on hero
  let touchX = null;
  document.querySelector('.hero').addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  document.querySelector('.hero').addEventListener('touchend', e => {
    if (touchX === null) return;
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); restart(); }
    touchX = null;
  }, { passive: true });

  restart();


  /* -------- PROJECT CAROUSEL (mobile) -------- */
  const projCards  = [...document.querySelectorAll('.proj-card')];
  const projPrev   = document.getElementById('proj-prev');
  const projNext   = document.getElementById('proj-next');
  let   projCur    = 0;

  function projVisibleCount() {
    return window.innerWidth > 960 ? 3 : 1;
  }

  function updateProjCarousel() {
    const count = projVisibleCount();
    const maxStart = Math.max(0, projCards.length - count);
    if (projCur > maxStart) projCur = maxStart;
    const featuredIndex = count === 3 ? projCur + 1 : projCur;

    projCards.forEach((card, index) => {
      const visible = index >= projCur && index < projCur + count;
      card.classList.toggle('visible', visible);
      card.classList.toggle('proj-card--featured', visible && index === featuredIndex);
    });
  }

  projPrev.addEventListener('click', () => {
    const maxStart = Math.max(0, projCards.length - projVisibleCount());
    projCur = projCur <= 0 ? maxStart : projCur - 1;
    updateProjCarousel();
  });
  projNext.addEventListener('click', () => {
    const maxStart = Math.max(0, projCards.length - projVisibleCount());
    projCur = projCur >= maxStart ? 0 : projCur + 1;
    updateProjCarousel();
  });

  updateProjCarousel();
  window.addEventListener('resize', updateProjCarousel, { passive: true });


  /* -------- PROJECT UNIT TABS -------- */
  document.querySelectorAll('.proj-unit-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const card = tab.closest('.proj-card');
      const target = tab.dataset.unitTarget;

      card.querySelectorAll('.proj-unit-tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      card.querySelectorAll('.proj-unit-panel').forEach(panel => {
        const active = panel.dataset.unitPanel === target;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });
    });
  });


  /* -------- ACCORDION -------- */
  document.querySelectorAll('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.acc-item');
      const body   = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('acc-item--open');

      // Close all
      document.querySelectorAll('.acc-item--open').forEach(open => {
        open.classList.remove('acc-item--open');
        const b = open.querySelector('.acc-body');
        b.hidden = true;
        open.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('acc-item--open');
        body.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* -------- MODAL -------- */
  const modal        = document.getElementById('enquiry-modal');
  const modalClose   = document.getElementById('modal-close');
  const backdrop     = document.getElementById('modal-backdrop');
  const openFloat    = document.getElementById('open-modal-float');
  const enquiryForm  = document.getElementById('enquiry-form');
  const formSuccess  = document.getElementById('form-success');

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.querySelector('input')?.focus(), 60);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openFloat.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  enquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    formSuccess.hidden = false;
    enquiryForm.querySelectorAll('input,button[type=submit]').forEach(el => {
      el.disabled = true;
    });
    setTimeout(closeModal, 3500);
  });


  /* -------- LANGUAGE TOGGLE (ENG / Marathi) -------- */
  const langButtons = document.querySelectorAll('.lang-btn');
  const htmlRoot = document.getElementById('html-root');
  let currentLang = 'mr'; // default is Marathi

  // Store original Marathi content on first load
  const translatableEls = document.querySelectorAll('[data-en]');
  translatableEls.forEach(el => {
    el.setAttribute('data-mr', el.innerHTML);
  });

  // Store original Marathi placeholders
  const placeholderEls = document.querySelectorAll('[data-en-placeholder]');
  placeholderEls.forEach(el => {
    el.setAttribute('data-mr-placeholder', el.getAttribute('placeholder'));
  });

  // Store original Marathi aria-labels
  const ariaEls = document.querySelectorAll('[data-en-aria]');
  ariaEls.forEach(el => {
    el.setAttribute('data-mr-aria', el.getAttribute('aria-label'));
  });

  // Store original Marathi media sources
  const mediaEls = document.querySelectorAll('[data-en-src]');
  mediaEls.forEach(el => {
    el.setAttribute('data-mr-src', el.currentSrc || el.getAttribute('src'));
  });

  function switchLanguage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;

    // Update html lang attribute
    htmlRoot.setAttribute('lang', lang === 'en' ? 'en' : 'mr');

    // Switch text content
    translatableEls.forEach(el => {
      if (lang === 'en') {
        el.innerHTML = el.getAttribute('data-en');
      } else {
        el.innerHTML = el.getAttribute('data-mr');
      }
    });

    // Switch placeholders
    placeholderEls.forEach(el => {
      if (lang === 'en') {
        el.setAttribute('placeholder', el.getAttribute('data-en-placeholder'));
      } else {
        el.setAttribute('placeholder', el.getAttribute('data-mr-placeholder'));
      }
    });

    // Switch aria-labels
    ariaEls.forEach(el => {
      if (lang === 'en') {
        el.setAttribute('aria-label', el.getAttribute('data-en-aria'));
      } else {
        el.setAttribute('aria-label', el.getAttribute('data-mr-aria'));
      }
    });

    // Switch language-specific media
    mediaEls.forEach(el => {
      const nextSrc = lang === 'en' ? el.getAttribute('data-en-src') : el.getAttribute('data-mr-src');
      if (nextSrc && el.getAttribute('src') !== nextSrc) {
        el.setAttribute('src', nextSrc);
        if (typeof el.load === 'function') el.load();
        if (typeof el.play === 'function') {
          el.play().catch(() => {});
        }
      }
    });

    // Update active state on all lang buttons (desktop + mobile)
    langButtons.forEach(b => {
      const isBEnglish = b.id.includes('eng') || b.classList.contains('lang-eng');
      b.classList.toggle('lang-active', (lang === 'en') === isBEnglish);
    });
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isEnglish = btn.id.includes('eng') || btn.classList.contains('lang-eng');
      switchLanguage(isEnglish ? 'en' : 'mr');
    });
  });

})();
