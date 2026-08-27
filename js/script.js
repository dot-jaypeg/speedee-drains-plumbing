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
    function show(i) {
      current = (i + images.length) % images.length;
      lightboxImg.src = images[current].src;
      lightboxImg.alt = images[current].caption;
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
});
