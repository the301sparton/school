
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
