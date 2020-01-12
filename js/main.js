
var sectionNameRequest;

(function ($) {
  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });
  

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-scrolled')) {
            top_space = top_space - 40;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.main-nav, .mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();

    nav_sections.each(function () {
      var top = $(this).offset().top - main_nav_height,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
    });
  });

})(jQuery);


function handleNetworkIssues(textStatus){
  if(textStatus == "error"){
    showNotification("<strong>Error!</strong>","Network Issue", "warning");
  }
 console.log(textStatus);
}


function showNotification(titleMsg, messageBody, typeOfNotifs) {
  $.notify({
    title: titleMsg,
    message: messageBody
  },
    {
      type: typeOfNotifs,
      animate: {
        enter: 'animated bounceIn',
        exit: 'animated bounceOut'
      },
      allow_dismiss: true,
      placement: {
        from: 'top',
        align: 'right'
      },
      offset: {
        x: 50,
        y: 105
      }
    });
}


function loadClassForSelectId(idofSelect, idofSectionSelect) {

  if ($("#" + idofSelect).find('option').length < 2) {
    $('#' + idofSectionSelect)
    .find('option')
    .remove()
    .end()
    .append('<option value="" selected disabled>Select Section</option>')
    .val('')
    ;
    $("#" + idofSelect).change(function () {
      loadSectionForClassName(idofSelect, idofSectionSelect);
    });

    let classNameReq = $.post(baseUrl + "/apis/classList.php", {
      type: "getOnlyClassName"
    });

    classNameReq.done(function (response) {
      try {
        let classNames = JSON.parse(response);
        $('#' + idofSelect)
          .find('option')
          .remove()
          .end()
          .append('<option value="" selected disabled>Select Class</option>')
          .val('')
          ;
        for (var index in classNames) {
          $('#' + idofSelect)
            .append($('<option>', { value: classNames[index].className })
              .text(classNames[index].className
              ));
        }
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }
    });

    classNameReq.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
  }

}

function loadSectionForClassName(idofSelect, idofSectionSelect) {
  sectionNameRequest = $.post(baseUrl + "/apis/classList.php", {
      type: "getSectionForClassName",
      className: document.getElementById(idofSelect).value
    });

    sectionNameRequest.done(function (response) {
      try {
        let sectionNames = JSON.parse(response);
        $('#' + idofSectionSelect)
          .find('option')
          .remove()
          .end()
          .append('<option value="" selected disabled>Select Section</option>')
          .val('')
          ;
        for (var index in sectionNames) {
          $('#' + idofSectionSelect)
            .append($('<option>', { value: sectionNames[index].section })
              .text(sectionNames[index].section
              ));
        }
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }

    });

    sectionNameRequest.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}