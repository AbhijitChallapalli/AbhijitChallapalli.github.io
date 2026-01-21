/**
 * Site JS (vanilla + Bootstrap). No BootstrapMade template JS.
 */
(function(){
  'use strict';

  const $ = (sel, all=false) => all ? Array.from(document.querySelectorAll(sel)) : document.querySelector(sel);

  // Mobile nav toggle (shows/hides sidebar on small screens)
  const toggleBtn = $('.mobile-nav-toggle');
  if (toggleBtn){
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
    // Close when clicking outside (overlay)
    document.addEventListener('click', (e) => {
      if (!document.body.classList.contains('nav-open')) return;
      const header = $('#header');
      const clickedInsideHeader = header && header.contains(e.target);
      const clickedToggle = toggleBtn.contains(e.target);
      if (!clickedInsideHeader && !clickedToggle){
        document.body.classList.remove('nav-open');
      }
    });
  }

  // Smooth scroll
  const scrollToId = (id) => {
    const el = document.querySelector(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top - 10, behavior: 'smooth' });
  };

  $('.nav-menu', false) && $('.nav-menu').addEventListener('click', (e) => {
    const a = e.target.closest('a.scrollto');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (!hash || !hash.startsWith('#')) return;
    e.preventDefault();
    scrollToId(hash);
    document.body.classList.remove('nav-open');
  });

  // Active nav state on scroll
  const navLinks = $('a.scrollto', true);
  const sections = navLinks
    .map(a => a.getAttribute('href'))
    .filter(h => h && h.startsWith('#'))
    .map(h => document.querySelector(h))
    .filter(Boolean);

  const setActive = () => {
    const y = window.scrollY + 120;
    let currentId = '#hero';
    for (const sec of sections){
      if (y >= sec.offsetTop) currentId = '#' + sec.id;
    }
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === currentId);
    });
  };
  window.addEventListener('load', setActive);
  window.addEventListener('scroll', setActive);


  // Section reveal animations (fade/slide on scroll)
  const revealList = [
    ...$('.section-title', true),
    ...$('.about .content', true),
    ...$('.facts .count-box', true),
    ...$('.skills .skill-row', true),
    ...$('.resume .resume-item', true),
    ...$('.portfolio .portfolio-item', true),
    ...$('.contact .info', true),
    ...$('.contact .php-email-form', true),
  ].filter(Boolean);

  if (revealList.length){
    revealList.forEach((el, idx) => {
      el.classList.add('reveal');
      if (!el.getAttribute('data-reveal')) el.setAttribute('data-reveal','up');
      if (!el.style.getPropertyValue('--delay')){
        el.style.setProperty('--delay', `${(idx % 8) * 70}ms`);
      }
    });

    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

      revealList.forEach(el => io.observe(el));
    } else {
      revealList.forEach(el => el.classList.add('is-visible'));
    }
  }


  // Back to top
  const backToTop = $('.back-to-top');
  const toggleBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle('active', window.scrollY > 350);
  };
  window.addEventListener('load', toggleBackToTop);
  window.addEventListener('scroll', toggleBackToTop);

  // Portfolio filter (simple show/hide)
  const filters = $('#portfolio-flters');
  const items = $('.portfolio-item', true);
  if (filters && items.length){
    filters.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-filter]');
      if (!li) return;
      e.preventDefault();

      // active pill
      $('#portfolio-flters li.filter-active')?.classList.remove('filter-active');
      li.classList.add('filter-active');

      const filter = li.getAttribute('data-filter') || '*';
      items.forEach(item => {
        if (filter === '*'){
          item.style.display = '';
          return;
        }
        const cls = filter.startsWith('.') ? filter.slice(1) : filter;
        item.style.display = item.classList.contains(cls) ? '' : 'none';
      });
    });
  }

  // Lightweight "typewriter" effect (no Typed.js)
  const tw = $('.typewriter');
  if (tw){
    const raw = tw.getAttribute('data-items') || '';
    const items = raw.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length){
      let i=0, j=0, deleting=false;
      const tick = () => {
        const word = items[i];
        if (!deleting){
          j++;
          tw.textContent = word.slice(0, j);
          if (j >= word.length){ deleting=true; setTimeout(tick, 1200); return; }
        } else {
          j--;
          tw.textContent = word.slice(0, j);
          if (j <= 0){ deleting=false; i=(i+1)%items.length; }
        }
        setTimeout(tick, deleting ? 45 : 85);
      };
      tick();
    }
  }

  // Portfolio image lightbox (Bootstrap modal)
  const modalEl = $('#imageLightbox');
  const modalImg = $('#imageLightboxImg');
  if (modalEl && modalImg && window.bootstrap){
    const modal = new bootstrap.Modal(modalEl, { keyboard: true });
    $('a.portfolio-lightbox', true).forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href) return;
        // only intercept images
        if (!href.match(/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i)) return;
        e.preventDefault();
        modalImg.src = href;
        modal.show();
      });
    });
  }

})();