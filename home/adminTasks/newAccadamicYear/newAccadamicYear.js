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
          <button class="btn btn-primary" onclick="newAccedamicYearContinue()">Continue</button>
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