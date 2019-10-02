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
        </div>
    </div>
    </div>`;

loadAttendenceViewData();
}

function loadAttendenceViewData(){
    document.getElementById('loader').style.display = "block";
    $.when(getClassAndSectionForAttendence(),loadAllSessionsForAttendence()).then(function(){
        document.getElementById('loader').style.display = "none";

        //Add Listeners Here
    });
}


function getClassAndSectionForAttendence() {
    console.log("yo")
      $.post(baseUrl + "/apis/classList.php",
        {
          type: "getClassList"
        },
        function (classDATA) {
          let classJSON = JSON.parse(classDATA);
  
          $('#attendence_className').append($('<option>', {
            value: "",
            text: "Select Student Class",
            selected: true,
            disabled: true
          }, '</option>'));
  
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
  
         $('#attendence_sectionName').append($('<option>', {
            value: "",
            text: "Select Student Section",
            selected: true,
            disabled: true
          }, '</option>'));
  
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