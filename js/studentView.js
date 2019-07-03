$(document).ready(function () {
    var url = new URL(document.location.href);
    var studentId = url.searchParams.get("studentId");
    var sessionName = url.searchParams.get("sessionName");

    if(studentId == null || sessionName == null){
        document.location = baseUrl+"/home";
    }

    currentSession = sessionName;
    document.getElementById("studID").innerText = studentId;
    stepOne();
    document.getElementById('loader').style.display = "none";  //HIDE LOADER
});

function pg_back(){
    document.location = baseUrl + "/home";
}