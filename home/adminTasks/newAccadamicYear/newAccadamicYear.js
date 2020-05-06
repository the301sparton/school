function newAccadamicYear() {
    setActiveColorsAdminTasks("newAccadamicYear");

    adminActionHTML = ` <div class="container">
    <div class="text-center">
          <h5>Start a new accedamic year ..?</h5>
          <hr>
    </div>
    

    <div class="row">
      <div class="col-md-12" style="padding: 2%">
          <h5 id="nextSessionMessage">If you start a new accedamic year all the new students you register will be registered for next<br>accedamic year and which is </h5>
      </div>
    </div>

    <div class="row" style="padding-bottom: 2%">
      <div class="col-md-12">
          <button class="btn btn-primary" style="`+CSSbtnPrimary+`" onclick="newAccedamicYearContinue()">Continue</button>
      </div>
    </div>

  </div>`;

    document.getElementById('adminActionHolder').innerHTML = adminActionHTML;
    setNextAccedamicYearMessage();
}

function setNextAccedamicYearMessage() {
    let years = currentSession.split("-");
    let nextYear = " " + (parseInt(years[0], 10) + 1) + "-" + (parseInt(years[1], 10) + 1);
    document.getElementById("nextSessionMessage").innerText += nextYear;
}

function newAccedamicYearContinue(){
    $("#modalNewAccedamicYear").modal();
}

function newAccYearAllActions(){
    if(document.getElementById("superPassword").value != "" && document.getElementById("nextYear").value != ""){
      var nextYrReq = $.post(baseUrl + "/apis/promote_students.php",{
        type: "iAmUltraSure",
        uid: me_data.uid,
        NextsessionName: document.getElementById("nextYear").value,
        sessionName: currentSession,
        password: document.getElementById("superPassword").value
      });

      nextYrReq.done(function(data){
        console.log(data);
        if(data == 501){
          showNotification("Error", "Wrong Password", "danger");
        }
        else if(data == 500){
          showNotification("Error", "Something went Wrong", "danger");
        }
        else if(data == 200){
          showNotification("Success", "Students Promoted", "danger");
        }
      });

      nextYrReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
    }
}