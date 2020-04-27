
let user;
let myRoleList;
let currentSession;
let canRegisterStudent;
let canSearchNEdit;
let canUpdateStudent;
let canManageClass;
let canGenerateReceipt;
let canStudentAttendence;
let canStudentReport;
let canFeesReport;
let canManageUsers;
let canManageRoles;
let canManageFeesHeads;
let canSchoolDiary;
let canNewAccadamicYear;
let currentStudentOption = '';
let optionColors;
let currentUprMenu = "top";

$(document).ready(function() {
    var data = sessionStorage.getItem('body');
    if (data) {
        document.documentElement.innerHTML = data;
    }
    else{
        console.log("no");
    }
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

    //showNotification("<strong>Welcome</strong>", "to School "+ verName, "success");
    firebase.auth().onAuthStateChanged(function(usr) {
        if (usr) {
            user = usr;

            var getUserReq = $.post("../apis/User.php", { type: "getById", uid: user.uid });
            getUserReq.done(function(user_dat) {
                me_data = JSON.parse(user_dat)[0];
                if (me_data != null) {
                    setMyImage(me_data.photo);
                    var myRoleListReq = $.post("../apis/userGroup.php", { type: "getRoleList", uid: me_data.uid });
                    myRoleListReq.done(function(myRoleListRes) {
                        var temp = "Welcome " + me_data.displayName.split(" ")[0] + "\nyou have ";
                        myRoleList = JSON.parse(myRoleListRes);
                        if (myRoleList.length > 0) {
                            for (var i in myRoleList) {
                                currentRole = myRoleList[i];
                                if (i > 0 && i != myRoleList.length - 1) {
                                    temp += ", ";
                                } else if (i == myRoleList.length - 1 && i >= 1) {
                                    temp += " & ";
                                }
                                temp += currentRole.userType;
                                setPermissions(currentRole);
                            }
                            temp += " powers.";
                            document.getElementById('home_msg').innerText = temp;
                        } else {
                            document.getElementById('home_msg').innerText = temp + " no powers.";
                        }


                        var currentSessionReq = $.post("../apis/academicSession.php", {
                            type: "getCurrentSession",
                            uid: me_data.uid
                        });
                        currentSessionReq.done(function(currentSessionRes) {
                            if (currentSessionRes != "") {
                                currentSession = JSON.parse(currentSessionRes).sessionName;
                            } else {
                                showNotification("<strong>Error</strong>", "No session found - contact admin", "warning");
                            }
                            document.getElementById('loader').style.display = "none"; //HIDE LOADER
                        });
                        currentSessionReq.fail(function(jqXHR, textStatus) { handleNetworkIssues(textStatus) });
                    });
                    myRoleListReq.fail(function(jqXHR, textStatus) { handleNetworkIssues(textStatus) });

                } else {
                    window.location = "../register";
                }
            });
            getUserReq.fail(function(jqXHR, textStatus) { handleNetworkIssues(textStatus) });
        } else {
            document.location = "../";
        }
    });

});

function setMyImage(myImgBase) {
    document.getElementById("me_img").src = myImgBase;
}

function setPermissions(currentRole) {
    if (currentRole.registerStudent == 1) {
        canRegisterStudent = 1;
    } else if (canRegisterStudent == null) {
        canRegisterStudent = 0;
    }
    if (currentRole.searchNEdit == 1) {
        canSearchNEdit = 1;
    } else if (canSearchNEdit == null) {
        canSearchNEdit = 0;
    }
    if (currentRole.updateStudent == 1) {
        canUpdateStudent = 1;
    } else if (canUpdateStudent == null) {
        canUpdateStudent = 0;
    }
    if (currentRole.manageClass == 1) {
        canManageClass = 1;
    } else if (canManageClass == null) {
        canManageClass = 0;
    }
    if (currentRole.generateReceipt == 1) {
        canGenerateReceipt = 1;
    } else if (canGenerateReceipt == null) {
        canGenerateReceipt = 0;
    }
    if (currentRole.feesReport == 1) {
        canFeesReport = 1;
    } else if (canFeesReport == null) {
        canFeesReport = 0;
    }
    if (currentRole.studentAttendence == 1) {
        canStudentAttendence = 1;
    } else if (canStudentAttendence == null) {
        canStudentAttendence = 0;
    }
    if (currentRole.studentReport == 1) {
        canStudentReport = 1;
    } else if (canStudentReport == null) {
        canStudentReport = 0;
    }

    if (currentRole.manageUsers == 1) {
        canManageUsers = 1;
    } else if (canManageUsers == null) {
        canManageUsers = 0;
    }

    if (currentRole.manageRoles == 1) {
        canManageRoles = 1;
    } else if (canManageRoles == null) {
        canManageRoles = 0;
    }

    if (currentRole.manageFeesHeads == 1) {
        canManageFeesHeads = 1;
    } else if (canManageFeesHeads == null) {
        canManageFeesHeads = 0;
    }

    if (currentRole.newAccadamicYear == 1) {
        canNewAccadamicYear = 1;
    } else if (canNewAccadamicYear == null) {
        canNewAccadamicYear = 0;
    }

    if (currentRole.schoolDairy == 1) {
        canSchoolDiary = 1;
    } else if (canNewAccadamicYear == null) {
        canSchoolDiary = 0;
    }
}

function setActiveColorsStudent(toSet) {
    limit = getlimitStudent();
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

function setActiveColorsfees(toSet) {
    limit = getlimitFees();
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

function setActiveColorsAdminTasks(toSet) {
    limit = getlimitAdminTasks();
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



function getlimitStudent() {
    let limit = [];
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
    if (canSchoolDiary == 1) {
        limit.push("schoolDiary");
    }
    return limit;
}

function getlimitFees() {
    let limit = [];
    if (canFeesReport == 1) {
        limit.push("feesReport");
    }
    if (canGenerateReceipt == 1) {
        limit.push("generateReceipt");
    }
    return limit;
}

function getlimitAdminTasks() {
    let limit = [];
    if (canManageUsers == 1) {
        limit.push("manageUsers");
    }
    if (canManageRoles) {
        limit.push("manageRoles");
    }
    if (canManageFeesHeads == 1) {
        limit.push("manageFeesHeads");
    }
    if (canNewAccadamicYear == 1) {
        limit.push("newAccadamicYear");
    }
    if (canManageClass == 1) {
        limit.push("manageClassList");
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
    } else if (canRegisterStudent == 1 && canSearchNEdit == 0) {
        StudentOptionHTML += `<div class="container" id="studentHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              
              <div class="col-rmd-4">
                  
              </div>
              <div class="col-rmd-4 button button1" id="registerStudent" onclick="registerStudent()">Register Student</div>
              </div> 
          `;
    } else if (canRegisterStudent == 0 && canSearchNEdit == 1) {
        StudentOptionHTML += `<div class="container" id="studentHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              
              <div class="col-rmd-4">
                  
              </div>
              <div class="col-rmd-4 button button2" id="searchNEdit" onclick="searchNEdit()">Search & Edit</div>
          </div> 
          `;
    } else {
        StudentOptionHTML += `<div class="container" id="studentHTML" style="padding-top:5%">
    <div class="text-center">`;
    }
    if (canStudentAttendence == 0 && canStudentReport == 0) {
        StudentOptionHTML += ``;
    } else if (canStudentAttendence == 1 && canStudentReport == 0) {
        StudentOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow1">
        <div class="col-rmd-4">
              
        </div>
          <div class="col-rmd-4 button button3" id="studentAttendence" onclick="studentAttendence()">Student Attendence</div>             
      </div>`;
    } else if (canStudentAttendence == 0 && canStudentReport == 1) {
        StudentOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow1">
              
        <div class="col-rmd-4">
            
        </div>
        <div class="col-rmd-4 button button4" id="studentReport" onclick="studentReport()">Student Report</div>
    </div>`;
    } else if (canStudentAttendence == 1 && canStudentReport == 1) {
        StudentOptionHTML += `<div class="row" style="margin-top:3%;" id="studentOptionsRow1">
        <div class="col-rmd-5 button button3" id="studentAttendence" onclick="studentAttendence()">Student Attendence</div>
        <div class="col-rmd-2">
            
        </div>
        <div class="col-rmd-5 button button4" id="studentReport" onclick="studentReport()">Student Report</div>
      </div>`;
    }

    if (canSchoolDiary) {
        StudentOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow3">
    <div class="col-rmd-4">
          
    </div>
      <div class="col-rmd-4 button button5" id="schoolDiary" onclick="schoolDiary()">School Diary</div>             
  </div>`;
    }

    StudentOptionHTML += `<div class="row" style="margin-top:3%;margin-bottom:3%">
  <div class="col backgroundDefiner" id="studentActionHolder" style="background: var(--btnColor3); border-radius:10px; padding-top:2%">
      <h5 id="StudentSelectionHeading">Select one of above operations</h5>
  </div>                  
  </div>
  </div>  
  <div>`;
    document.getElementById(currentUprMenu).className = "";
    document.getElementById("student").className = "active";
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
    } else if (canGenerateReceipt == 1 && canFeesReport == 0) {
        FeesOptionHTML += `<div class="container" id="feesHTML" style="padding-top:5%">
          <div class="text-center">
            <div class="row" id="studentOptionsRow1"style="margin-top:3%">
                
                <div class="col-rmd-4">
                    
                </div>
                <div class="col-rmd-4 button button1" id="generateReceipt" onclick="generateReceipt()">Generate Receipt</div>
                </div> 
            `;
    } else if (canGenerateReceipt == 0 && canFeesReport == 1) {
        FeesOptionHTML += `<div class="container" id="feesHTML" style="padding-top:5%">
          <div class="text-center">
            <div class="row" id="studentOptionsRow1"style="margin-top:3%">
                
                <div class="col-rmd-4">
                    
                </div>
                <div class="col-rmd-4 button button2" id="feesReport" onclick="feesReport()">Fees Report</div>
            </div> 
            `;
    } else {}
    FeesOptionHTML += `<div class="row" style="margin-top:3%;margin-bottom:3%">
                    <div class="col backgroundDefiner" id="feesActionHolder" style="background: var(--btnColor3); border-radius:10px; padding-top:2%">
                        <h5 id="StudentSelectionHeading">Select one of above operations</h5>
                    </div>                  
                    </div>
                    </div>  
                    <div>`;
    document.getElementById(currentUprMenu).className = "";
    document.getElementById("fees").className = "active";
    document.getElementById("section_main").innerHTML = FeesOptionHTML;
}

function adminTasksView() {

    var AdminOptionHTML = ``;
    if (canManageUsers == 1 && canManageRoles == 1) {
        AdminOptionHTML += `<div class="container" id="adminHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              <div class="col-rmd-5 button button1" id="manageUsers" onclick="manageUsers()">Manage Users</div>
              <div class="col-rmd-2">
                  
              </div>
              <div class="col-rmd-5 button button2" id="manageRoles" onclick="manageRoles()">Manage User Groups</div>
          </div>`;
    } else if (canManageUsers == 1 && canManageRoles == 0) {
        AdminOptionHTML += `<div class="container" id="adminHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              
              <div class="col-rmd-4">
                  
              </div>
              <div class="col-rmd-4 button button1" id="manageUsers" onclick="manageUsers()">Manage Users</div>
              </div> 
          `;
    } else if (canManageUsers == 0 && canManageRoles == 1) {
        AdminOptionHTML += `<div class="container" id="adminHTML" style="padding-top:5%">
        <div class="text-center">
          <div class="row" id="studentOptionsRow1"style="margin-top:3%">
              
              <div class="col-rmd-4">
                  
              </div>
              <div class="col-rmd-4 button button2" id="manageRoles" onclick="manageRoles()">Manage User Groups</div>
          </div> 
          `;
    } else {
        AdminOptionHTML += `<div class="container" id="adminHTML" style="padding-top:5%">
    <div class="text-center">`;
    }



    if (canManageFeesHeads == 0 && canNewAccadamicYear == 0) {
        AdminOptionHTML += ``;
    } else if (canManageFeesHeads == 1 && canNewAccadamicYear == 0) {
        AdminOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow2">
        <div class="col-rmd-4">
              
        </div>
          <div class="col-rmd-4 button button3" id="manageFeesHeads" onclick="manageFeesHeads()">Manage Fees Heads</div>             
      </div>`;
    } else if (canManageFeesHeads == 0 && canNewAccadamicYear == 1) {
        AdminOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow1">
              
        <div class="col-rmd-4">
            
        </div>
        <div class="col-rmd-4 button button4" id="newAccadamicYear" onclick="newAccadamicYear()">Start New Accedamic Year</div>
    </div>`;
    } else {
        AdminOptionHTML += `<div class="row" style="margin-top:3%;" id="studentOptionsRow1">
        <div class="col-rmd-5 button button3" id="manageFeesHeads" onclick="manageFeesHeads()">Manage Fees Heads</div>
        <div class="col-rmd-2">
            
        </div>
        <div class="col-rmd-5 button button4" id="newAccadamicYear" onclick="newAccadamicYear()">Start New Accedamic Year</div>
      </div>`;
    }



    if (canManageClass) {
        AdminOptionHTML += `<div class="row" style="margin-top:3%" id="studentOptionsRow3">
    <div class="col-rmd-4">
          
    </div>
      <div class="col-rmd-4 button button5" id="manageClassList" onclick="manageClassList()">Manage Class List</div>             
  </div>`;
    }



    AdminOptionHTML += ` <div class="row" style="margin-top:3%;margin-bottom:3%">
  <div class="col backgroundDefiner" id="adminActionHolder" style="background:var(--btnColor3); border-radius:10px; padding-top:2%">
      <h5 id="StudentSelectionHeading">Select one of above operations</h5>
  </div>                  
  </div>
  </div>  
  <div>`;
    document.getElementById(currentUprMenu).className = "";
    document.getElementById("admin").className = "active";
    document.getElementById("section_main").innerHTML = AdminOptionHTML;



}