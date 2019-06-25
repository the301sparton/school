let user;
let me_data;
let myRoleList;
let currentSession;
let canRegisterStudent; let canSearchNEdit; let canUpdateStudent; let canDeleteStudent; let canGenerateReceipt; let canStudentAttendence; let canStudentReport; let canFeesReport;
let currentStudentOption = '';
let optionColors = ["D6E2E7", "E0E3EB", "B0CBD4", "C7D4F3"];

$(document).ready(function () {
  firebase.auth().onAuthStateChanged(function (usr) {
    if (usr) {
      user = usr;
      var getUserReq = $.post("../apis/User.php", { type: "getById", uid: user.uid });
      getUserReq.done(function (user_dat) {
        me_data = JSON.parse(user_dat)[0];
        if (me_data != null) {
          var myRoleListReq = $.post("../apis/userGroup.php", { type: "getRoleList", uid: me_data.uid });
          myRoleListReq.done(function (myRoleListRes) {
            var temp = "Welcome " + me_data.displayName.split(" ")[0] + "\nyou have ";
            myRoleList = JSON.parse(myRoleListRes);
            if (myRoleList.length > 0) {
              for (i in myRoleList) {
                currentRole = myRoleList[i];
                temp += currentRole.userType;
                if (i == myRoleList.length - 2) {
                  temp += " & ";
                }
                else if (i > 1 && i != myRoleList.length) {
                  temp += ", "
                }
                setPermissions(currentRole);
              }
              temp += " powers."
              document.getElementById('home_msg').innerText = temp;
            }
            else {
              document.getElementById('home_msg').innerText = temp + " no powers."
            }


            var currentSessionReq = $.post("../apis/academicSession.php", {
              type: "getCurrentSession"
            });
            currentSessionReq.done(function (currentSessionRes) {
              if (currentSessionRes != "") {
                currentSession = JSON.parse(currentSessionRes).sessionName;
              }
              else {
                alert("No Session Found. Please ask admin to create a new session.");
              }
              document.getElementById('loader').style.display = "none";  //HIDE LOADER
            });
          });

        }
        else {
          window.location = "../register";
        }
      });
    }
    else {
      document.location = "../";
    }
  });

});

function setPermissions(currentRole) {
  if (currentRole.registerStudent == 1) {
    canRegisterStudent = 1;
  }
  else if (canRegisterStudent == null) {
    canRegisterStudent = 0;
  }
  if (currentRole.searchNEdit == 1) {
    canSearchNEdit = 1;
  }
  else if (canSearchNEdit == null) {
    canSearchNEdit = 0;
  }
  if (currentRole.updateStudent == 1) {
    canUpdateStudent = 1;
  }
  else if (canUpdateStudent == null) {
    canUpdateStudent = 0;
  }
  if (currentRole.deleteStudent == 1) {
    canDeleteStudent = 1;
  }
  else if (canDeleteStudent == null) {
    canDeleteStudent = 0;
  }
  if (currentRole.generateReceipt == 1) {
    canGenerateReceipt = 1;
  }
  else if (canGenerateReceipt == null) {
    canGenerateReceipt = 0;
  }
  if (currentRole.feesReport == 1) {
    canFeesReport = 1;
  }
  else if (canFeesReport == null) {
    canFeesReport = 0;
  }
  if (currentRole.studentAttendence == 1) {
    canStudentAttendence = 1;
  }
  else if (canStudentAttendence == null) {
    canStudentAttendence = 0;
  }
  if (currentRole.studentReport == 1) {
    canStudentReport = 1;
  }
  else if (canStudentReport == null) {
    canStudentReport = 0;
  }
}

function setActiveColorsStudent(toSet) {
  limit = getlimitStudent();
  for (i = 0; i < limit.length; i++) {
    temp = limit[i];
    itr = document.getElementById(temp);
    if (temp == toSet) {
      itr.style.background = "WHITE";
    }
    else {
      itr.style.background = "#" + optionColors[i];
    }
  }
}

function setActiveColorsfees(toSet) {
  limit = getlimitFees();
  for (i = 0; i < limit.length; i++) {
    temp = limit[i];
    itr = document.getElementById(temp);
    if (temp == toSet) {
      itr.style.background = "WHITE";
    }
    else {
      itr.style.background = "#" + optionColors[i];
    }
  }
}

function getlimitStudent() {
  let limit = new Array();
  if (canRegisterStudent == 1) {
    limit.push("registerStudent");
  }
  if (canSearchNEdit == 1) {
    limit.push("searchNEdit");
  }
  if (canStudentAttendence == 1) {
    limit.push("studentAttendence");
  }
  if (canStudentReport == 1) {
    limit.push("studentReport");
  }
  return limit;
}

function getlimitFees() {
  let limit = new Array();
  if (canFeesReport == 1) {
    limit.push("feesReport");
  }
  if (canGenerateReceipt == 1) {
    limit.push("generateReceipt");
  }
  return limit;
}






function studentOptionsView() {
  var StudentOptionHTML = ``;
  if (canRegisterStudent == 1 && canSearchNEdit == 1) {
    StudentOptionHTML += `<div class="container" id="studentHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              <div class="col-rmd-5 button button1" id="registerStudent" onclick="registerStudent()">Register Student</div>
              <div class="col-rmd-2">
                  
              </div>
              <div class="col-rmd-5 button button2" id="searchNEdit" onclick="searchNEdit()">Search & Edit</div>
          </div>`;
  }
  else if (canRegisterStudent == 1 && canSearchNEdit == 0) {
    StudentOptionHTML += `<div class="container" id="studentHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              
              <div class="col-rmd-4">
                  
              </div>
              <div class="col-rmd-4 button button1" id="registerStudent" onclick="registerStudent()">Register Student</div>
              </div> 
          `;
  }
  else if (canRegisterStudent == 0 && canSearchNEdit == 1) {
    StudentOptionHTML += `<div class="container" id="studentHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              
              <div class="col-rmd-4">
                  
              </div>
              <div class="col-rmd-4 button button2" id="searchNEdit" onclick="searchNEdit()">Search & Edit</div>
          </div> 
          `;
  }
  else {
    StudentOptionHTML += `<div class="container" id="studentHTML" style="padding-top:5%">
    <div class="text-center">`;
  }
  if (canStudentAttendence == 0 && canStudentReport == 0) {
    StudentOptionHTML += ``;
  }
  else if (canStudentAttendence == 1 && canStudentReport == 0) {
    StudentOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow1">
        <div class="col-rmd-4">
              
        </div>
          <div class="col-rmd-4 button button3" id="studentAttendence" onclick="studentAttendence()">Student Attendence</div>             
      </div>`;
  }
  else if (canStudentAttendence == 0 && canStudentReport == 1) {
    StudentOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow1">
              
        <div class="col-rmd-4">
            
        </div>
        <div class="col-rmd-4 button button4" id="studentReport" onclick="studentReport()">Student Report</div>
    </div>`;
  }
  else if (canStudentAttendence == 1 && canStudentReport == 1) {
    StudentOptionHTML += `<div class="row" style="margin-top:3%;" id="studentOptionsRow1">
        <div class="col-rmd-5 button button3" id="studentAttendence" onclick="studentAttendence()">Student Attendence</div>
        <div class="col-rmd-2">
            
        </div>
        <div class="col-rmd-5 button button4" id="studentReport" onclick="studentReport()">Student Report</div>
      </div>`;
  }

  StudentOptionHTML += `<div class="row" style="margin-top:3%;margin-bottom:3%">
                              <div class="col" id="studentActionHolder" style="background: #EFF3FC; border-radius:10px; padding-top:2%; padding-bottom: 2%">
                                  <h5 id="StudentSelectionHeading">Select one of above operations</h5>
                              </div>                  
                        </div>
                      </div>  
                    <div>`;
  document.getElementById("section_main").innerHTML = StudentOptionHTML;
}



function feesOptionView() {
  FeesOptionHTML = ``;
  if (canGenerateReceipt == 1 && canFeesReport == 1) {
    FeesOptionHTML += `<div class="container" id="feesHTML" style="padding-top:5%">
          <div class="text-center">
            <div class="row" id="studentOptionsRow1"style="margin-top:3%">
                <div class="col-rmd-5 button button1" id="generateReceipt" onclick="generateReceipt()">Generate Receipt</div>
                <div class="col-rmd-2">
                    
                </div>
                <div class="col-rmd-5 button button2" id="feesReport" onclick="feesReport()">Fees Report</div>
            </div>`;
  }
  else if (canGenerateReceipt == 1 && canFeesReport == 0) {
    FeesOptionHTML += `<div class="container" id="feesHTML" style="padding-top:5%">
          <div class="text-center">
            <div class="row" id="studentOptionsRow1"style="margin-top:3%">
                
                <div class="col-rmd-4">
                    
                </div>
                <div class="col-rmd-4 button button1" id="generateReceipt" onclick="generateReceipt()">Generate Receipt</div>
                </div> 
            `;
  }
  else if (canGenerateReceipt == 0 && canFeesReport == 1) {
    FeesOptionHTML += `<div class="container" id="feesHTML" style="padding-top:5%">
          <div class="text-center">
            <div class="row" id="studentOptionsRow1"style="margin-top:3%">
                
                <div class="col-rmd-4">
                    
                </div>
                <div class="col-rmd-4 button button2" id="feesReport" onclick="feesReport()">Fees Report</div>
            </div> 
            `;
  }
  else {
  }
  FeesOptionHTML += `<div class="row" style="margin-top:3%;margin-bottom:3%">
                    <div class="col" id="feesActionHolder" style="background: #EFF3FC; border-radius:10px; padding-top:2%">
                        <h5 id="StudentSelectionHeading">Select one of above operations</h5>
                    </div>                  
                    </div>
                    </div>  
                    <div>`;
  document.getElementById("section_main").innerHTML = FeesOptionHTML;
}
