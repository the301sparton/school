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


                <div class="col-md-4">
                    <select id="attendence_className" class="form-control">
                        <option disabled selected value="">Select Class</option>
                    </select>
                </div>

                <div class="col-md-4">
                    <select id="attendence_sectionName" class="form-control">
                        <option disabled selected value="">Select Section</option>
                    </select>
                </div>

            </div>
              <div class="row">
                      <div class="col-md-4">
                        <input class="form-control" type="date" id="attendence_date">
                      </div>
                      <div class="col-md-6">
                        <div class="alert" style="display: none" id="attendence_alert">
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
    $.when(getClassAndSectionForAttendence(),loadAllSessionsForAttendence()).then(function(){
        document.getElementById('loader').style.display = "none";
    });
}

function getClassAndSectionForAttendence() {
      $.post(baseUrl + "/apis/classList.php",
        {
          type: "getClassList"
        },
        function (classDATA) {
          let classJSON = JSON.parse(classDATA);
  
        
          for (var index in classJSON) {
            $('#attendence_className')
              .append($('<option>', {
                value: classJSON[index].className,
                text: classJSON[index].className,
              }, '</option>'));
          }
        });
        
  
      $.post(baseUrl + "/apis/sectionList.php",
        {
          type: "getSectionList"
        },
        function (sectionDATA) {
          let sectionJSON = JSON.parse(sectionDATA);
  
     
  
          for (var index in sectionJSON) {
            $('#attendence_sectionName')
              .append($('<option>', {
                value: sectionJSON[index].sectionName,
                text: sectionJSON[index].sectionName,
              }, '</option>'));
          }
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
}


function getStudentListForAttendence(){
  let attendence_sessionName = document.getElementById("attendence_sessionName").value;
  let attendence_className = document.getElementById("attendence_className").value;
  let attendence_sectionName = document.getElementById("attendence_sectionName").value;
  let attendence_date = document.getElementById("attendence_date").value;

  if(attendence_sessionName != "" && attendence_className != "" && attendence_sectionName != "" && attendence_date !=""){
      //perform past date check
      document.getElementById("attendence_alert").style.display = "none";
      var dateFormOfAttendenceDate = new Date(attendence_date);
        if (!inFuture(dateFormOfAttendenceDate)) {
          document.getElementById("attendence_alert").style.display = "none";
          //get attendence list
        }
        else{
          document.getElementById("attendence_alert").innerText = "Can not set attendence for future date";
          document.getElementById("attendence_alert").style.display = "block";
        }
  }
  else{
   document.getElementById("attendence_alert").innerText = "Please Select all fields";
   document.getElementById("attendence_alert").style.display = "block";
  }
}

const inFuture = (date) => {
  return date.setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
};