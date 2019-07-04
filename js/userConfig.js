let canRegisterStudent; let canSearchNEdit; let canUpdateStudent; let canDeleteStudent; let canGenerateReceipt; let canStudentAttendence; let canStudentReport;
$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (usr) {
        if (usr) {
            user = usr;
            var getUserReq = $.post("../apis/User.php", { type: "getById", uid: user.uid });
            getUserReq.done(function (user_dat) {
                me_data = JSON.parse(user_dat)[0];
                console.log(me_data);
                if (me_data != null) {
                    var myRoleListReq = $.post("../apis/userGroup.php", { type: "getRoleList", uid: me_data.uid });
                    myRoleListReq.done(function (myRoleListRes) {
                        myRoleList = JSON.parse(myRoleListRes);
                        if (myRoleList.length > 0) {
                            for (i in myRoleList) {
                                currentRole = myRoleList[i];
                                setPermissions(currentRole);
                            }
                        }
                    });
                }
                else {
                    window.location = "../register";
                }
            });
        }
        else {
            document.location = logOutUrl;
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