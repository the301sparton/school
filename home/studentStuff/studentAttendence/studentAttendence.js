function studentAttendence(){
    currentStudentOption = "studentAttendence";
    setActiveColorsStudent("studentAttendence");
    document.getElementById('studentActionHolder').innerHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Student Attendence</h4>
      <hr>
    </div>

    <div class="row" style="margin:1%">
        <div class="col-md-3"
            <h4>Select Class Details</h4>
        </div>

        <div class="col-md-9">
            <div class="row" style="margin-bottom:3%">

                <div class="col-md-4">
                    <select id="attendence_sessionName" class="form-control">
                        <option disabled selected value="">Select Accedamic Year</option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label for="attendence_className">
                        Class :
                    </label>
                </div>

                <div class="col-md-5">
                    <select id="attendence_className" class="form-control">
                        <option disabled selected value="">Select Class</option>
                    </select>
                </div>
            </div>
              <div class="row">
                      <div class="col-md-4">
                        <input class="form-control" type="date" id="attendence_date">
                      </div>
                      <div class="col-md-6">
                        <div class="alertMine" style="display: none" id="attendence_alert">
                        </div>
                      </div>
                      <div class="col-md-2">
                        <button class="btn btn-primary" onclick="getStudentListForAttendence()">Get List</button>
                      </div>                
              </div>
        </div>
       
    </div>

    <div class="container" id="attendenceDataHolder">
            <div class="row">
                <h4 id="classDetailsForAttendence"></h4>
                <hr>
            </div>

           
    </div>


    </div>`;

loadAttendenceViewData();
}

function loadAttendenceViewData(){
    document.getElementById('loader').style.display = "block";
    $.when(loadAllSessionsForAttendence(), loadClassListWithAccess()).then(function(){
        document.getElementById('loader').style.display = "none";
    });
}



function loadAllSessionsForAttendence() {
    var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
      type: "getAllSessions"
    });
  
    allSessionReq.done(function (allSessions) {
      allSessions = JSON.parse(allSessions);
      for (var index in allSessions) {
  
        $('#attendence_sessionName')
          .append($('<option>', { value: allSessions[index].sessionName })
            .text(allSessions[index].sessionName
            ));
      }
  
    document.getElementById("attendence_sessionName").value = currentSession;
    sessionSelect = currentSession;
    
    
    });

    allSessionReq.fail(function(jqXHR, textStatus){handleNetworkIssues(textStatus)});
}

function loadClassListWithAccess(){
  var allClassReq = $.post(baseUrl + "/apis/classList.php", {
    type: "getAllCLassWithAccess",
    uid: me_data.uid
  });

  allClassReq.done(function (res) {
    allClass = JSON.parse(res);
    for (var index in allClass) {

      $('#attendence_className')
        .append($('<option>', { value: allClass[index].className+allClass[index].section })
          .text(allClass[index].className + " " + allClass[index].section
          ));
    }
  });

  allClassReq.fail(function(jqXHR, textStatus){handleNetworkIssues(textStatus)});
}


function getStudentListForAttendence(){
  
}

const inFuture = (date) => {
  return date.setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
};