$(document).ready(function() {
    document.getElementById("about_websiteTitle").innerText = "Vaikunth's Eval"
    document.getElementById("loader").style.display = "none";
    document.getElementById("takeTestBtn").style = CSSbtnPrimary;
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