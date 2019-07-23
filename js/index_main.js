

var uiConfig = {
  signInSuccessUrl: 'index.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: '<your-tos-url>',
  // Privacy policy url/callback.
  privacyPolicyUrl: function () {
    window.location.assign('<your-privacy-policy-url>');
  }
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#Signin_Body', uiConfig);

function Login() {
  $("#signInModal").modal();
}

$(document).ready(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var getUserReq = $.post("apis/User.php", { type: "getById", uid: user.uid });
      getUserReq.done(function (user_dat) {
        var user_data = JSON.parse(user_dat);
        if (user_data[0] != null) {
          if (user_data[0].uid == user.uid) {
            window.location = baseUrl + "/home";
          }
          else {
            console.log(baseUrl);
            window.location = baseUrl + "/register";
          }
        }
        else {
          window.location = baseUrl + "/register";
        }
      });
    }
    else{
      document.getElementById('loader').style.display = "none";
    }
  });
});
