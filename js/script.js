// Speedee Drains & Plumbing — shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  /* ---- Active nav link ---- */
  var path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    var target = link.getAttribute('data-nav');
    if (target === path || (target !== '/' && path.indexOf(target) === 0)) {
      link.classList.add('active');
    }
  });

  /* ---- Mobile nav ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileNavClose = document.querySelector('.mobile-nav-close');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () { mobileNav.classList.add('open'); });
  }
  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener('click', function () { mobileNav.classList.remove('open'); });
  }
  document.querySelectorAll('.mobile-nav > ul > li.has-sub > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      a.parentElement.classList.toggle('expanded');
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---- Gallery lightbox ---- */
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var images = Array.prototype.map.call(galleryItems, function (el) {
      return { src: el.getAttribute('data-full') || el.querySelector('img').src, caption: el.getAttribute('data-caption') || '' };
    });
    var current = 0;
    var firstShow = true;
    function show(i) {
      current = (i + images.length) % images.length;
      if (firstShow) {
        lightboxImg.src = images[current].src;
        lightboxImg.alt = images[current].caption;
        firstShow = false;
        return;
      }
      lightboxImg.style.opacity = '0';
      window.setTimeout(function () {
        lightboxImg.src = images[current].src;
        lightboxImg.alt = images[current].caption;
        lightboxImg.style.opacity = '1';
      }, 180);
    }
    galleryItems.forEach(function (el, i) {
      el.addEventListener('click', function () {
        show(i);
        lightbox.classList.add('open');
      });
    });
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if (closeBtn) closeBtn.addEventListener('click', function () { lightbox.classList.remove('open'); });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  /* ---- Formspree AJAX submit (contact + newsletter forms) ---- */
  document.querySelectorAll('form[data-formspree]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.reset();
          if (status) {
            status.textContent = "Thanks — we'll be in touch shortly. For anything urgent, call 949-514-6751.";
            status.className = 'form-status show success';
          }
        } else {
          if (status) {
            status.textContent = 'Something went wrong. Please call us at 949-514-6751 instead.';
            status.className = 'form-status show error';
          }
        }
      }).catch(function () {
        if (status) {
          status.textContent = 'Something went wrong. Please call us at 949-514-6751 instead.';
          status.className = 'form-status show error';
        }
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      });
    });
  });

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ---- Scroll-reveal animations (applied automatically, no per-page markup needed) ---- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll(
      '.section-head, .card, .service-card, .review-card, .step, .stat-band > div, ' +
      '.promo, .cta-banner, .split, .gallery-item, .area-list li, .contact-card, ' +
      '.review-source-card, .trust-strip .item'
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i % 6, 6) * 0.06) + 's';
      io.observe(el);
    });
  }

  /* ---- Stat counters: count up from 0 to their target once scrolled into view ---- */
  var countEls = document.querySelectorAll('.count[data-count-to]');
  function formatCount(value, decimals) {
    return decimals ? value.toFixed(decimals) : Math.round(value).toString();
  }
  function finishCount(el, target, decimals) {
    el.textContent = formatCount(target, decimals);
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1400;
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(target * eased, decimals);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        finishCount(el, target, decimals);
      }
    }
    window.requestAnimationFrame(step);
  }
  if (countEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      countEls.forEach(function (el) {
        finishCount(el, parseFloat(el.getAttribute('data-count-to')), parseInt(el.getAttribute('data-decimals') || '0', 10));
      });
    } else {
      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      countEls.forEach(function (el) { countIO.observe(el); });
    }
  }

});
