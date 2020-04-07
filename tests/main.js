
//GLOBALS
    let baseUrl = "/school/tests";
//-------

$(document).ready(function() {
    document.getElementById("about_websiteTitle").innerText = "Vaikunth's Eval"
    document.getElementById("loader").style.display = "none";
    document.getElementById("takeTestBtn").style = CSSbtnPrimary;

    var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            window.location = baseUrl + "/make";
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
});


    //Handle Dark / Light Mode
    $("body").addClass("dark");
    $("#darkModeSwitch").text("ON");
    $("#darkModeSwitch").on("click", function() {
        if ($("body").hasClass("dark")) {
            $("body").removeClass("dark");
            $("body").addClass("light");
            $("#darkModeSwitch").text("OFF");
        } else {
            $("body").addClass("dark");
            $("body").removeClass("light");
            $("#darkModeSwitch").text("ON");
        }
    });

function ModalLogin(){
    $("#signInModal").modal();
}