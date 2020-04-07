$(document).ready(function() {
    document.getElementById("about_websiteTitle").innerText = "Vaikunth's Eval"
    document.getElementById("loader").style.display = "none";

    firebase.auth().onAuthStateChanged(function(usr) {
        if (usr) {

        }
        else{
            document.location = baseUrl;
        }
    });
});

function setActiveColor(toSet) {
    limit = ["createTest", "createSubject", "viewResult", "addQuestion"];
    for (i = 0; i < limit.length; i++) {
        temp = limit[i];
        itr = document.getElementById(temp);
        if (temp == toSet) {
            itr.style.background = "var(--primaryColor)";
        } else {
            itr.style.background = "var(--btnColor"+i+")";
        }
    }
}