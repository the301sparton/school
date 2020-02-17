
$(document).ready(function () {
    var url = new URL(document.location.href);
    var studentId = url.searchParams.get("studentId");
    var sessionName = url.searchParams.get("sessionName");
    var themeMode = url.searchParams.get("mode");

    if (studentId == null || sessionName == null) {
        document.location = baseUrl + "/home";
    }

    if(themeMode == "dark"){
        $("body").removeClass("light");
        $("body").addClass("dark");
        $(".inner-switch").text("ON");
    }
    else{
        $("body").removeClass("dark");
        $("body").addClass("light");
        $(".inner-switch").text("OFF");
    }


    $(".inner-switch").on("click", function() {
        if ($("body").hasClass("dark")) {
            $("body").removeClass("dark");
            $("body").addClass("light");
            $(".inner-switch").text("OFF");
        } else {
            $("body").addClass("dark");
            $("body").removeClass("light");
            $(".inner-switch").text("ON");
        }
    });

    firebase.auth().onAuthStateChanged(function (usr) {
        if (usr) {
            $.post("../apis/User.php", { type: "getById", uid: usr.uid }, function (user_dat) {
                me_data = JSON.parse(user_dat)[0];
                if (me_data == null) {
                    throwBack();
                }
                else {
                    currentSession = sessionName;
                    document.getElementById("studID").innerText = studentId;
                    stepOne();
                    document.getElementById('loader').style.display = "none";  //HIDE LOADER
                }
            })
        }
    });

});


function throwBack() {
    document.location = baseUrl + "/home";
}

function pg_back() {
    window.history.back();
}