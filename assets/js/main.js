/**
 * Template Name: MyResume - v2.1.0
 * Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

!(function ($) {
  "use strict";

  // Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  const card = document.querySelector("#card");
  card.addEventListener("click", (e) => {
    card.classList.toggle("flip");
    document.querySelector("a[href='#about']").click();
    setTimeout(() => {
      card.classList.toggle("flip");
    }, 2000);
  });

  // Hero typed effect
  if ($('.typed').length) {
    let typed_strings = $(".typed").data('typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // Form validation and modal logic
  const modalButton = document.getElementById('botaoEmail');
  const hiddenSubmitButton = document.getElementById('botaoSend');
  const modal = document.querySelector("dialog");

  modalButton.onclick = function () {
    const nameValue = document.getElementById("inputNome").value.trim();
    const emailValue = document.getElementById("inputEmail").value.trim();
    const subjectValue = document.getElementById("inputAssunto").value.trim();
    const messageValue = document.getElementById("inputMensagem").value.trim();

    if (!nameValue) {
      showError('erroNome');
    } else if (!emailValue) {
      showError('erroEmail');
    } else if (!subjectValue) {
      showError('erroAssunto');
    } else if (!messageValue) {
      showError('erroMensagem');
    } else {
      clearErrors();
      modal.showModal();
      setTimeout(() => {
        hiddenSubmitButton.click();
      }, 1500);
    }
  };

  function showError(errorId) {
    clearErrors();
    document.getElementById(errorId).style.display = "block";
  }

  function clearErrors() {
    ['erroNome', 'erroEmail', 'erroAssunto', 'erroMensagem'].forEach(id => {
      document.getElementById(id).style.display = "none";
    });
  }

  // Smooth scroll for navigation
  $(document).on('click', '.nav-menu a, .scrollto', function (e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && 
        location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top;

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        // Update nav menu active state
        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        // Close mobile nav if open
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load if hash exists
  $(document).ready(function () {
    if (window.location.hash) {
      var initialHash = window.location.hash;
      if ($(initialHash).length) {
        var scrollto = $(initialHash).offset().top;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Toggle mobile nav
  $(document).on('click', '.mobile-nav-toggle', function (e) {
    $('body').toggleClass('mobile-nav-active');
    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
  });

  // Hide mobile nav when clicking outside of it
  $(document).click(function (e) {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($('body').hasClass('mobile-nav-active')) {
        $('body').removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      }
    }
  });

  // Navigation active state on scroll
  const navSections = $('section');
  const mainNav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function () {
    const scrollPos = $(this).scrollTop() + 300;

    navSections.each(function () {
      const top = $(this).offset().top;
      const bottom = top + $(this).outerHeight();

      if (scrollPos >= top && scrollPos <= bottom) {
        mainNav.find('li').removeClass('active');
        mainNav.find(`a[href="#${$(this).attr('id')}"]`).parent('li').addClass('active');
      }

      if (scrollPos < 200) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Back to top button logic
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section animation
  $('.skills-content').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Initialize AOS animations
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  // Portfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item'
    });

    $('#portfolio-flters li').on('click', function () {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
      aos_init();
    });

    $('.venobox').venobox({
      'share': false
    });

    aos_init();
  });

  // Testimonials carousel
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Portfolio details carousel
  $(".portfolio-details-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

})(jQuery);
