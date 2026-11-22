/**
 * Template Name: MyResume - v2.1.0
 * Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

!(function ($) {
  "use strict";

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCROLL_DURATION = prefersReducedMotion ? 0 : 1500;

  /*--------------------------------------------------------------
  # Preloader
  --------------------------------------------------------------*/
  function removePreloader() {
    const $preloader = $('#preloader');
    if ($preloader.length) {
      $preloader.delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  }

  $(window).on('load', removePreloader);
  // Safety net: never leave the page stuck behind the preloader
  setTimeout(removePreloader, 5000);

  /*--------------------------------------------------------------
  # Helpers
  --------------------------------------------------------------*/
  function scrollToPosition(top) {
    $('html, body').stop().animate({ scrollTop: top }, SCROLL_DURATION, 'easeInOutExpo');
  }

  /*--------------------------------------------------------------
  # Hero "Click here" card
  --------------------------------------------------------------*/
  const card = document.querySelector('#card');
  if (card) {
    let cardBusy = false;

    const activateCard = () => {
      if (cardBusy) return;
      cardBusy = true;
      card.classList.toggle('flip');

      const aboutLink = document.querySelector("a[href='#about']");
      if (aboutLink) aboutLink.click();

      setTimeout(() => {
        card.classList.toggle('flip');
        cardBusy = false;
      }, 2000);
    };

    card.addEventListener('click', activateCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateCard();
      }
    });
  }

  /*--------------------------------------------------------------
  # Hero typed effect
  --------------------------------------------------------------*/
  if ($('.typed').length && typeof Typed !== 'undefined') {
    const typedStrings = String($('.typed').data('typed-items'))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    new Typed('.typed', {
      strings: typedStrings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /*--------------------------------------------------------------
  # Contact form (native validation + fetch)
  --------------------------------------------------------------*/
  const form = document.getElementById('contactForm');

  if (form) {
    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.getElementById('botaoEmail');
    const submitLabel = submitBtn ? submitBtn.querySelector('span') : null;
    const defaultLabel = submitLabel ? submitLabel.textContent : 'Send';

    const fields = [
      { input: 'inputNome', error: 'erroNome' },
      { input: 'inputEmail', error: 'erroEmail' },
      { input: 'inputAssunto', error: 'erroAssunto' },
      { input: 'inputMensagem', error: 'erroMensagem' }
    ].map((f) => ({
      input: document.getElementById(f.input),
      error: document.getElementById(f.error)
    }));

    const setStatus = (message, type) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove('is-success', 'is-error');
      if (type) statusEl.classList.add('is-' + type);
    };

    const setFieldError = (field, hasError) => {
      field.error.hidden = !hasError;
      field.input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
      if (hasError) {
        field.input.setAttribute('aria-describedby', field.error.id);
      } else {
        field.input.removeAttribute('aria-describedby');
      }
    };

    const isFieldValid = (field) => {
      const value = field.input.value.trim();
      return value.length > 0 && field.input.validity.valid;
    };

    // Clear a field's error as soon as the user fixes it
    fields.forEach((field) => {
      field.input.addEventListener('input', () => {
        if (!field.error.hidden && isFieldValid(field)) {
          setFieldError(field, false);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('', null);

      let firstInvalid = null;
      fields.forEach((field) => {
        const valid = isFieldValid(field);
        setFieldError(field, !valid);
        if (!valid && !firstInvalid) firstInvalid = field.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // Sending state
      submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending...';

      try {
        const formData = new FormData(form);
        // We stay on the page, so no redirect is needed
        formData.delete('redirectTo');

        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        let data = null;
        try {
          data = await response.json();
        } catch (_) {
          data = null;
        }

        if (response.ok && (!data || data.success !== false)) {
          form.reset();
          fields.forEach((field) => setFieldError(field, false));
          setStatus('Thanks! Your message was sent successfully.', 'success');
        } else {
          throw new Error((data && data.message) || 'Request failed');
        }
      } catch (err) {
        setStatus(
          'Sorry, something went wrong. Please try again or email me directly at marcoaguiar14@gmail.com.',
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = defaultLabel;
      }
    });
  }

  /*--------------------------------------------------------------
  # Mobile navigation
  --------------------------------------------------------------*/
  const $body = $('body');
  const $navToggle = $('.mobile-nav-toggle');

  function setMobileNav(open) {
    $body.toggleClass('mobile-nav-active', open);
    $navToggle.attr('aria-expanded', open ? 'true' : 'false');
    $navToggle.find('i')
      .toggleClass('icofont-navigation-menu', !open)
      .toggleClass('icofont-close', open);
  }

  $navToggle.on('click', function () {
    setMobileNav(!$body.hasClass('mobile-nav-active'));
  });

  // Close when clicking outside the menu
  $(document).on('click', function (e) {
    if (!$body.hasClass('mobile-nav-active')) return;
    if ($(e.target).closest('.mobile-nav-toggle, #header').length) return;
    setMobileNav(false);
  });

  // Close with Escape
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $body.hasClass('mobile-nav-active')) {
      setMobileNav(false);
      $navToggle.trigger('focus');
    }
  });

  /*--------------------------------------------------------------
  # Smooth scroll for navigation links
  --------------------------------------------------------------*/
  $(document).on('click', '.nav-menu a, .scrollto', function (e) {
    if (
      location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
      location.hostname === this.hostname &&
      this.hash
    ) {
      const $target = $(this.hash);
      if ($target.length) {
        e.preventDefault();
        scrollToPosition($target.offset().top);

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($body.hasClass('mobile-nav-active')) {
          setMobileNav(false);
        }
      }
    }
  });

  // Scroll to the hash on page load, if there is one
  $(window).on('load', function () {
    if (window.location.hash) {
      const $target = $(window.location.hash);
      if ($target.length) {
        scrollToPosition($target.offset().top);
      }
    }
  });

  /*--------------------------------------------------------------
  # Active nav link on scroll (IntersectionObserver)
  --------------------------------------------------------------*/
  if ('IntersectionObserver' in window) {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const spyTargets = [];

    navLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) spyTargets.push({ link, section });
    });

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = spyTargets.find((t) => t.section === entry.target);
          if (!match) return;
          $('.nav-menu .active').removeClass('active');
          $(match.link).closest('li').addClass('active');
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    spyTargets.forEach((t) => spyObserver.observe(t.section));
  }

  /*--------------------------------------------------------------
  # Back to top button
  --------------------------------------------------------------*/
  const $backToTop = $('.back-to-top');
  let backToTopVisible = false;

  $(window).on('scroll', function () {
    const shouldShow = $(this).scrollTop() > 100;
    if (shouldShow !== backToTopVisible) {
      backToTopVisible = shouldShow;
      if (shouldShow) {
        $backToTop.stop(true, true).fadeIn('slow');
      } else {
        $backToTop.stop(true, true).fadeOut('slow');
      }
    }
  });

  $backToTop.on('click', function (e) {
    e.preventDefault();
    scrollToPosition(0);
  });

  /*--------------------------------------------------------------
  # Counter
  --------------------------------------------------------------*/
  if ($.fn.counterUp) {
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 1000
    });
  }

  /*--------------------------------------------------------------
  # Skills section animation
  --------------------------------------------------------------*/
  if ($('.skills-content').length && $.fn.waypoint) {
    $('.skills-content').waypoint(
      function () {
        $('.progress .progress-bar').each(function () {
          $(this).css('width', $(this).attr('aria-valuenow') + '%');
        });
      },
      { offset: '80%' }
    );
  }

  /*--------------------------------------------------------------
  # AOS animations
  --------------------------------------------------------------*/
  $(window).on('load', function () {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        once: true,
        disable: prefersReducedMotion
      });
    }
  });

  /*--------------------------------------------------------------
  # Testimonials carousel
  --------------------------------------------------------------*/
  if ($.fn.owlCarousel) {
    $('.testimonials-carousel').owlCarousel({
      autoplay: true,
      dots: true,
      loop: true,
      items: 1
    });
  }

})(jQuery);