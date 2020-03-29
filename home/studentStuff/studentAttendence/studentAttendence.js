var studList;

function studentAttendence() {
    currentStudentOption = "studentAttendence";
    setActiveColorsStudent("studentAttendence");
    document.getElementById('studentActionHolder').innerHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Student Attendence</h4>
      <hr>
    </div>

    <div class="row" style="margin:1%">
        <div class="col-md-3"
            <h4>Select Class Details : </h4>
        </div>

        <div class="col-md-9">
            <div class="row" style="margin-bottom:3%">

                <div class="col-md-4">
                    <select id="attendence_sessionName" class="form-control" onchange="getStudentListForAttendence()">
                        <option disabled selected value="">Select Accedamic Year</option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label for="attendence_className">
                        Class :
                    </label>
                </div>

                <div class="col-md-5">
                    <select id="attendence_className" class="form-control" onchange="getStudentListForAttendence()">
                        <option disabled selected value="">Select Class</option>
                    </select>
                </div>
            </div>
              <div class="row">
                      <div class="col-md-4">
                        <input class="form-control" type="date" id="attendence_date" onchange="getStudentListForAttendence()">
                      </div>
                      <div class="col-md-8">
                        <div class="alertMine" style="display: none;" id="attendence_alert">
                        </div>
                      </div>
                                  
              </div>
        </div>
       
    </div>

    <div class="container" id="attendenceDataHolder">
            <div class="row">
                <h4 id="classDetailsForAttendence"></h4>
                <hr>
            </div>
            
            <div class = "row">
                  <div class="col-md-2"></div>

                  <div class="col-md-8">
                  <div id="myListHolder" class="container"></div>
                  </div>

                  <div class="col-md-2"></div>
            </div>
    </div>


    </div>`;

    loadAttendenceViewData();
}

function loadAttendenceViewData() {
    document.getElementById("new_loader").style.display = "block";
    $.when(loadAllSessionsForAttendence(), loadClassListWithAccess()).then(function() {
        document.getElementById("new_loader").style.display = "none";
    });
}


function loadAllSessionsForAttendence() {
    var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
        type: "getAllSessions",
        uid: me_data.uid
    });

    allSessionReq.done(function(allSessions) {
        allSessions = JSON.parse(allSessions);
        for (var index in allSessions) {

            $('#attendence_sessionName')
                .append($('<option>', { value: allSessions[index].sessionName })
                    .text(allSessions[index].sessionName));
        }

        document.getElementById("attendence_sessionName").value = currentSession;
        sessionSelect = currentSession;

    });

    allSessionReq.fail(function(jqXHR, textStatus) {
        handleNetworkIssues(textStatus)
    });
}

function loadClassListWithAccess() {
    var allClassReq = $.post(baseUrl + "/apis/classList.php", {
        type: "getAllCLassWithAccess",
        uid: me_data.uid
    });

    allClassReq.done(function(res) {
        allClass = JSON.parse(res);
        for (var index in allClass) {

            $('#attendence_className')
                .append($('<option>', { value: allClass[index].className + ":" + allClass[index].section })
                    .text(allClass[index].className + " " + allClass[index].section));
        }
    });

    allClassReq.fail(function(jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}


function getStudentListForAttendence() {
    let sessionName = document.getElementById("attendence_sessionName").value;
    let classNSection = document.getElementById("attendence_className").value;
    let dateForAttendence = document.getElementById("attendence_date").value;

    if (sessionName != "" && classNSection != "" && dateForAttendence != "") {
        var date = new Date(dateForAttendence);
        if (date.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
            document.getElementById("attendence_alert").innerText = "Can not set attendence for future dates";
            document.getElementById("attendence_alert").style.display = "block";
            document.getElementById("myListHolder").innerHTML = "";
        } else {
            document.getElementById("attendence_alert").style.display = "none";
            getAttendenceList(sessionName, classNSection, dateForAttendence);
        }


    } else {
        document.getElementById("myListHolder").innerHTML = "";
        document.getElementById("attendence_alert").innerText = "Please Select All Values";
        document.getElementById("attendence_alert").style.display = "block";
    }
}


function getAttendenceList(sessionName, classNSection, dateForAttendence) {
    document.getElementById("new_loader").style.display = "block";
    let getAttendenceListReq = $.post(baseUrl + "/apis/attendence.php", {
        type: "getList",
        uid: me_data.uid,
        sessionName: sessionName,
        class: classNSection,
        dateForAttendence: dateForAttendence
    });

    getAttendenceListReq.done(function(response) {
        studList = JSON.parse(response);
        document.getElementById("myListHolder").innerHTML = `<div class = "row elementDefinerDark" style="background:var(--btnColor1); border-radius:6px; margin-bottom:2%; padding:2%"> 
    <div class="col-md-3" style="text-align:center">Roll Num.</div>
    <div class="col-md-6" style="text-align:center">Full Name</div>
    <div class="col-md-3">
    <label class="checklabel" style="padding-left:0px">Check All
            <input type="checkbox" onchange = "checkAllForAttendence(this)">
            <span class="checkmark" style = "left:85%;"></span>
    </label>
        </div>
    </div>`;

        if (studList.length == 0) {
            document.getElementById("myListHolder").innerHTML += `<div class = "row elementDefinerDark" style="background:var(--btnColor1); border-radius:6px; margin-bottom:2%; padding:2%"> 
      <div class="col-md-3" style="text-align:center"></div>
      <div class="col-md-6" style="text-align:center">NO DATA</div>
      <div class="col-md-3"> 
      </div>
      </div>`;
        }

        for (student in studList) {
            var obj = new Object;
            obj.fullname = studList[student].firstName + " " + studList[student].middleName + " " + studList[student].lastName;
            if (studList[student].state != null && studList[student].state != "") {
                if (studList[student].state == "1") {
                    obj.state = true;
                } else {
                    obj.state = false;
                }

            } else {
                obj.state = false;
            }
            document.getElementById("myListHolder").innerHTML += `<div class = "row elementDefiner" style="background: var(--btnColor2); border-radius:6px; margin-bottom:2%; padding:2%"> 
      <div class="col-md-3" id="studRoll` + student + `" style="text-align:center"></div>
      <div class="col-md-6" id="nameStud` + student + `" style="text-align:center"></div>
      <div class="col-md-3" style="text-align:center">  
        <label for="studState` + student + `" class="checklabel">P/A
            <input type="checkbox" id="studState` + student + `">
            <span class="checkmark" style = "left:85%;"></span>
        </label>
      </div>
      </div>`;
            document.getElementById("studRoll" + student).innerText = (parseInt(student) + 1);
            document.getElementById("nameStud" + student).innerText = obj.fullname;
            if (studList[student].state == 1) {
                $('#studState' + student).attr('checked', true);
            }
        }


        document.getElementById("myListHolder").innerHTML += `<div class = "row" style="margin-bottom:2%; padding:2%"> 
      <div class="col-md-11"><Button class="btn btn-primary" style="position: relative; left:60%; `+CSSbtnPrimary+`" onclick="saveAttendenceRecords()">SAVE</Button></div></div>`;
        document.getElementById("new_loader").style.display = "none";
    });

    getAttendenceListReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });

}

function checkAllForAttendence(checkbox) {
    let arrayView = document.getElementById("myListHolder").childNodes;
    for (itr = 0; itr < (arrayView.length - 1); itr++) {
        if (itr != 0) {
            arrayView[itr].childNodes[5].childNodes[1].childNodes[1].checked = checkbox.checked;
        }
    }
}


function saveAttendenceRecords() {
    let dataArray = new Array();
    var type = "saveAttendenceRecords";
    for (itr in studList) {
        let obj = new Object;
        obj.attendenceId = studList[itr].attendenceId;
        obj.studentId = studList[itr].studentId;
        obj.sessionName = studList[itr].sessionName;
        obj.date = document.getElementById("attendence_date").value;
        obj.state = document.getElementById("studState" + itr).checked;
        dataArray.push(obj);
    }
    if (dataArray[0].attendenceId != null) {
        type = "updateAttendenceRecords";
    }
    document.getElementById("new_loader").style.display = "block";
    var saveAttendenceReq = $.post(baseUrl + "/apis/attendence.php", {
        type: type,
        data: dataArray,
        uid: me_data.uid
    });

    saveAttendenceReq.done(function(response) {
        if (response == 200) {
            showNotification("<strong>Success</strong>", "Attendence Saved", "success");
            getStudentListForAttendence();
        } else {
            showNotification("Error", "Failed to save attendence", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    saveAttendenceReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}