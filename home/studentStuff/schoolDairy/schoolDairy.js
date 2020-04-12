function schoolDiary() {
  currentStudentOption = "schoolDiary";
  setActiveColorsStudent("schoolDiary");

  var temp = `<div class="container" id="registerStudent">
  <div class="text-center">
    <h4 id="searchHeading">Student Reports</h4>
    <hr>
  </div>
  
  <div class="row" style = "text-align: center; padding: 1%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-3 button button2" style = "margin: auto; border-radius: 8px" onclick="createNotice()" id="createNotice">Create Notice</div>
      <div class="col-rmd-2"></div>
      <div class="col-rmd-3 button button3" style = "margin: auto; border-radius: 8px" onclick="enterMarks()" id="enterMarks">Enter Marks</div>
      <div class="col-rmd-2"></div>
  </div>

  <hr>

  <div class="row" id="studentReportHolder">
  </div>

  </div>`;
  document.getElementById("studentActionHolder").innerHTML = temp;

}

function setActiveColorsSchoolDiary(toSet) {
  limit = ["createNotice","enterMarks"];
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

function createNotice(){
  setActiveColorsSchoolDiary("createNotice");
  document.getElementById('studentReportHolder').innerHTML = `<div class="container" id="registerStudent">
  <div class="text-center">
    <h4 id="searchHeading">Create Notice</h4>
    <hr>
  </div>
  
  <div class="container" style="padding:1%">
     <div class="row">
        <div class="col-md-5">
            <input id="noticeSearchBar" class="form-control" placeholder="Search by title.." type="text" onkeyup="shouldSearchSchoolDiary(event)">
        </div>
        <div class="col-md-3"></div>
        <div class="col-md-4">
            <div class="switch" onclick="switchDiary()">Show Only Active Notices:
              <span class="inner-switch" id="studentDiarySwitch">ON</span>
            </div>
        </div>
     </div>
  </div>
  
  <div class="container" id="studentDiaryHolder" style="padding:1%"></div>
  
  <div class="container" style = "margin:2%">
    <div class="row">
      <div class="col-md-11"></div>
      <div class="col-md-1"> <i class="fa fa-plus button button6" style="border-radius:50%; padding:20%" onclick="triggerNewNoticeModal()"></i></div>
    </div>    
  </div>`;

  makeStudentDiaryGetCall();
}

function switchDiary() {
  if (document.getElementById("studentDiarySwitch").innerText == "OFF") {
    document.getElementById("studentDiarySwitch").innerText = "ON";
  }
  else {
    document.getElementById("studentDiarySwitch").innerText = "OFF";
  }

  makeStudentDiaryGetCall();
}

function makeStudentDiaryGetCall() {
  var StudentDairyReq = $.post(baseUrl + "/apis/schoolDairy.php", {
    type: "getItems",
    uid: me_data.uid,
    noticeSearchBar: document.getElementById("noticeSearchBar").value,
    onlyActive: document.getElementById("studentDiarySwitch").innerText
  });

  StudentDairyReq.done(function (res) {
    try {
      let resArray = JSON.parse(res);
      document.getElementById("studentDiaryHolder").innerHTML = '';
      if (resArray.length == 0) {
        resultView = `<div class="row collapsible">
                            <div class="text-center" style="background:var(--btnColor1)"><h4 style="background:var(--btnColor1)">No Result Found</h4>
                            </div>
                        </div>`;
        document.getElementById("studentDiaryHolder").innerHTML = resultView;
      }
      else {
        for (itr in resArray) {
          resultView = `<div class="container">
            <div class="container collapsible" style="padding:2%" id="item` + itr + `" data-toggle="collapse" data-target="#data` + itr + `">
            <div class = "row">
                <div class="col-md-10" style="background:var(--btnColor1); text-align:left; font-size:large" id="noticeTitle` + itr + `"></div>
                <div class="col-md-2" style="background:var(--btnColor1); text-align:right" id="noticeDate` + itr + `"></div>
            </div>
            <div class = "row" style="margin-top:1%">
                <div class="col-md-10" style="background:var(--btnColor1); text-align:left; color:var(--textSecondary);" id="noticeDetails` + itr + `"></div>
                <div class="col-md-2" style="background:var(--btnColor1); text-align:right"><i class="fa fa-arrow-down" style="background:var(--btnColor1); display:block"></i></div>
            </div>
            </div>
    
                <div id="data` + itr + `" class="collapse" style="padding:2%; border-radius: 15px; margin-left:2%; margin-right:2%">
                       <h6>Notice Message</h6>
                       <hr>

                       <div class="row" id="messageBox` + itr + `"></div>
    
                       <div class="row" style="padding:1%">
                        <div class="col-md-12">
                              <div id="noticeId` + itr + `" style="display:none"></div>
                              <button class="btn btn-success" style="float:right; `+ CSSbtnSuccess + `" id="enableBtn` + itr + `" onclick="disableNotice(this.parentNode.childNodes[1].innerText, this)">Enabled</button>
                        </div>
                       </div>
                </div>
                </div>
            `;
          document.getElementById("studentDiaryHolder").innerHTML += resultView;
          document.getElementById("noticeId" + itr).innerText = resArray[itr].msgId;
          document.getElementById("noticeTitle" + itr).innerText = resArray[itr].title;
          document.getElementById("noticeDate" + itr).innerText = resArray[itr].createdOn;
          document.getElementById("messageBox" + itr).innerText = resArray[itr].message;


          if (resArray[itr].isActive == 0) {
            document.getElementById("enableBtn" + itr).innerText = "Notice Disabled";
            document.getElementById("enableBtn" + itr).className = "btn btn-danger";
            document.getElementById("enableBtn" + itr).style = CSSbtnDanger + "cursor:pointer; float:right;";
          }
          else {
            document.getElementById("enableBtn" + itr).innerText = "Notice Enabled";
            document.getElementById("enableBtn" + itr).className = "btn btn-success";
            document.getElementById("enableBtn" + itr).style = CSSbtnSuccess + "cursor:pointer; float:right;";
          }

          if (resArray[itr].scope == 1) {
            document.getElementById("noticeDetails" + itr).innerText = "Created by " + resArray[itr].displayName + " for " + resArray[itr].schoolName;
          }
          else {
            document.getElementById("noticeDetails" + itr).innerText = "Created by " + resArray[itr].displayName + " for " + resArray[itr].className + " " + resArray[itr].sectionName;
          }
        }
      }
    }
    catch (e) {
      showNotification("Error", "Failed to get data", "danger");
    }
  });

  StudentDairyReq.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}

function shouldSearchSchoolDiary(event) {
  clearTimeout($.data(this, 'timer1'));
  if (event.keyCode == 13) {
    makeStudentDiaryGetCall();
  }
  else {
    $(this).data('timer1', setTimeout(makeStudentDiaryGetCall, 500));
  }
}

function disableNotice(msgId, btn) {
  var isActive;
  if (btn.innerText == "Notice Enabled") {
    isActive = 0;

  }
  else {
    isActive = 1;
  }

  document.getElementById("new_loader").style.display = "block";
  var disableEnableNoticeReq = $.post(baseUrl + "/apis/schoolDairy.php", {
    type: "disableEnableReq",
    uid: me_data.uid,
    msgId: msgId,
    isActive: isActive
  });

  disableEnableNoticeReq.done(function (data) {
    if (data == 200) {
      showNotification("Success", "Notice Updated", "success");
      makeStudentDiaryGetCall();
    }
    else {
      showNotification("Error", "Failed to save data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  disableEnableNoticeReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function triggerNewNoticeModal() {
  $("#newNoticeModal").modal();
}

function loadClassOrSchoolList(scope,id) {
  document.getElementById("new_loader").style.display = "block";
  var getClassOrSchoolReq = $.post(baseUrl + "/apis/schoolDairy.php", {
    type: "loadClassOrSchoolList",
    uid: me_data.uid,
    scope: scope.value
  });

 

  getClassOrSchoolReq.done(function (data) {
    var array = JSON.parse(data);
    if (scope.value == 1) {
      $('#classorschoolselect')
        .find('option')
        .remove()
        .end()
        .append('<option value="" selected disabled>Select School</option>')
        .val('');
      for (var index in array) {
        $('#classorschoolselect')
          .append($('<option>', { value: array[index].schoolId })
            .text(array[index].schoolName
            ));
      }
    }
    else {
      if(id == "" || id==null){
        id = "classorschoolselect";
      }
      $('#'+id)
        .find('option')
        .remove()
        .end()
        .append('<option value="" selected disabled>Select Class</option>')
        .val('');
      for (var index in array) {
        $('#'+id)
          .append($('<option>', { value: array[index].className + "," + array[index].section })
            .text(array[index].className + " " + array[index].section
            ));
      }
    }
    document.getElementById("new_loader").style.display = "none";
  });

  getClassOrSchoolReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function createNewNotice() {
  document.getElementById("new_loader").style.display = "block";
  var newNoticeReq = $.post(baseUrl + "/apis/schoolDairy.php", {
    type: "newItem",
    uid: me_data.uid,
    title: document.getElementById("noticeTitle").value,
    message: document.getElementById("noticeMessage").value,
    scope: document.getElementById("noticeScopeSelect").value,
    data: document.getElementById("classorschoolselect").value
  });

  newNoticeReq.done(function (data) {
    if (data == 200) {
      showNotification("Success", "Notice Updated", "success");
      makeStudentDiaryGetCall();
    }
    else {
      showNotification("Error", "Failed to save data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  newNoticeReq.fail(function(jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
});
}






function enterMarks(){
  setActiveColorsSchoolDiary("enterMarks");
  document.getElementById('studentReportHolder').innerHTML = `<div class="container" id="registerStudent">
  <div class="text-center">
    <h4 id="searchHeading">Enter Marks</h4>
    <hr>
  </div>
  
  <div class="row" style="margin:1%">
  <div class="col-md-3">
      <h5>Select Class Details : </h5>
  </div>

  <div class="col-md-9">
      <div class="row" style="margin-bottom:3%">

          <div class="col-md-4">
              <select id="attendence_sessionName" class="form-control" onchange="getStudentListForAttendence()">
                  <option disabled selected value="">Select Accedamic Year</option>
              </select>
          </div>

          <div class="col-md-4">
              <input class="form-control" id="examDate" type="date">
          </div>

          <div class="col-md-4">
              <select id="attendence_className" class="form-control">
                  <option disabled selected value="">Select Class</option>
              </select>
          </div>
      </div>
        <div class="row">
                <div class="col-md-4">
                  <input class="form-control" id="subject" type="text" placeholder="Subject" >
                </div>
                <div class="col-md-4">
                  <input class="form-control" id="totalMarks" type="number" min="0" placeholder="Total Marks">
                </div>
                <div class="col-md-4">
                  <Button class="btn btn-primary" id="getMarkListBtn" onclick="getMarkList()">Get List</Button>
                </div>
        </div>
        </div>

        <div class="container" id="myListHolder" style="padding:1%; margin-top:3%"></div>
</div>

  </div>`;
  document.getElementById("getMarkListBtn").style = CSSbtnPrimary;
  loadAllSessionsForAttendence();
  loadClassOrSchoolList(JSON.parse('{"value": "2"}'),"attendence_className")
}

function getMarkList(){
  document.getElementById("new_loader").style.display = "block";
  if(document.getElementById("totalMarks").value != ""
  && document.getElementById("examDate").value != ""
  && document.getElementById("subject").value != ""
  && document.getElementById("attendence_className").value != ""){
    var getList = $.post(baseUrl +"/apis/ExamResult.php",{
      type: "getList",
      subject: document.getElementById("subject").value,
      uid: me_data.uid,
      sessionName: document.getElementById("attendence_sessionName").value,
      class: document.getElementById("attendence_className").value,
      date: document.getElementById("examDate").value
    });

    getList.done(function(response) {
        studList = JSON.parse(response);
        console.log(studList);
        document.getElementById("myListHolder").innerHTML = `<div class = "row elementDefinerDark" style="background:var(--btnColor1); border-radius:6px; margin-bottom:2%; padding:2%"> 
    <div class="col-md-2" style="text-align:center">Roll Num.</div>
    <div class="col-md-5" style="text-align:center">Full Name</div>
    <div class="col-md-2" style="text-align:center">Marks</div>
    <div class="col-md-3" style="text-align:center">Remark</div>
    </div>`;

        if (studList.length == 0) {
            document.getElementById("myListHolder").innerHTML += `<div class = "row elementDefinerDark" style="background:var(--btnColor1); border-radius:6px; margin-bottom:2%; padding:2%"> 
      <div class="col-md-2" style="text-align:center"></div>
      <div class="col-md-5" style="text-align:center">NO DATA</div>
      <div class="col-md-2"> 
      </div>
      <div class="col-md-3"> 
      </div>
      </div>`;
        }
        else{
          for (itr in studList) {
            var obj = new Object;
            obj.fullname = studList[itr].firstName + " " + studList[itr].middleName + " " + studList[itr].lastName;
            document.getElementById("myListHolder").innerHTML += `<div class = "row elementDefiner" style="background: var(--btnColor2); border-radius:6px; margin-bottom:2%; padding:2%"> 
      <div class="col-md-2" id="studRoll` + itr + `" style="text-align:center"></div>
      <div class="col-md-5" id="nameStud` + itr + `" style="text-align:center"></div>
      <div class="col-md-2" style="text-align:center">  
      <input class="form-control" placeholder="Marks" value="0" type="number" id="markStud` + itr + `" >
      </div>
      <div class="col-md-3" style="text-align:center">  
        <input class="form-control" placeholder="Remarks" type="text" id="RemarkStud` + itr + `">
      </div>
      </div>`;
            document.getElementById("studRoll" + itr).innerText = (parseInt(itr) + 1);
            document.getElementById("nameStud" + itr).innerText = obj.fullname;
            
        }
        
        document.getElementById("myListHolder").innerHTML += `<div class = "row" style="margin-bottom:2%; padding:2%"> 
      <div class="col-md-11"><Button class="btn btn-primary" style="position: relative; left:60%; `+CSSbtnPrimary+`" onclick="saveResultRecords()">SAVE</Button></div></div>`;
        }
          document.getElementById("new_loader").style.display = "none";
          for (itr in studList) {
            if(studList[itr].marks != null){
             document.getElementById("markStud" + itr).value = studList[itr].marks;
             document.getElementById("RemarkStud" + itr).value = studList[itr].remarks;
            }
          }
    });

    getList.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
  }
  else{
    showNotification("Error", "Please enter all values.", "danger");
    document.getElementById("new_loader").style.display = "none";
  }
  
}

function saveResultRecords(){
  let dataArray = new Array();
    var type = "saveResultRecords";
    for (itr in studList) {
        let obj = new Object;
        obj.resultId = studList[itr].resultId;
        obj.studentId = studList[itr].studentId;
        obj.sessionName = studList[itr].sessionName;
        obj.date = document.getElementById("examDate").value;
        obj.marks = document.getElementById("markStud" + itr).value;
        obj.remarks = document.getElementById("RemarkStud" + itr).value;
        obj.subject = document.getElementById("subject").value;
        obj.totalMarks = document.getElementById("totalMarks").value;
        dataArray.push(obj);
    }

    if (dataArray[0].resultId != null) {
      type = "updateResultRecords";
    }

    document.getElementById("new_loader").style.display = "block";
    var saveResultReq = $.post(baseUrl + "/apis/ExamResult.php", {
        type: type,
        data: dataArray,
        uid: me_data.uid
    });

    saveResultReq.done(function(response) {
      console.log(response);
        if (response == 200) {
            showNotification("<strong>Success</strong>", "Results Saved", "success");
            getMarkList();
        } else {
            showNotification("Error", "Failed to save Results", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    saveResultReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}