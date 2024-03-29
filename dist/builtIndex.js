
var firebaseConfig = {
  apiKey: "AIzaSyD-lUd0mKObtIex9YufmIUkKswmyj2o3Vo",
  authDomain: "vaicomp-fe7af.firebaseapp.com",
  databaseURL: "https://vaicomp-fe7af.firebaseio.com",
  projectId: "vaicomp-fe7af",
  storageBucket: "vaicomp-fe7af.appspot.com",
  messagingSenderId: "91500483285",
  appId: "1:91500483285:web:df2e54c15cc4aea8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
function Logout(){
  firebase.auth().signOut().then(function(){
    window.location = logOutUrl;
  });
}
;
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user;
      var credential = authResult.credential;
      var isNewUser = authResult.additionalUserInfo.isNewUser;
      var providerId = authResult.additionalUserInfo.providerId;
      var operationType = authResult.operationType;
      window.location = baseUrl + "/home";
      return false;
    },
    signInFailure: function (error) {
      // Some unrecoverable error occurred during sign-in.
      // Return a promise when error handling is completed and FirebaseUI
      // will reset, clearing any UI. This commonly occurs for error code
      // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
      // occurs. Check below for more details on this.
      return handleUIError(error);
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  signInFlow: 'popup',
  tosUrl: '<your-tos-url>',
  privacyPolicyUrl: function () {
    window.location.assign('<your-privacy-policy-url>');
  }
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#Signin_Body', uiConfig);

function Login() {
  $("#signInModal").modal();
}
;
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
      type: "getOnlyClassName",
      uid: me_data.uid
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
      uid: me_data.uid,
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