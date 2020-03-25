
function manageClassList() {
    setActiveColorsAdminTasks("manageClassList");
    let manageClassListHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Class List</h5>
          <hr>
    </div>
    <div class="container" style="padding: 1%">
    
    <div id="jsGrid" style = "display:none;" ></div>
    <div class="row" style="margin-top:2%">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="fa fa-plus button button6" style="border-radius:50%; padding:20%" onclick="showClassListDetailsDialog()"></i>
   
    </div>
    </div>
    
    </div>`;
    document.getElementById('adminActionHolder').innerHTML = manageClassListHTML;

    getClassListToShow();
    setValuesInSchoolListSelect();

}

function getClassListToShow() {
    document.getElementById("new_loader").style.display = "block";
    document.getElementById('jsGrid').style.display = "none";
    let classListReq = $.post(baseUrl + "/apis/classList.php", {
        type: "getClassList",
        uid: me_data.uid
    });
    classListReq.done(function (responce) {
        document.getElementById('jsGrid').style.display = "block";
        $("#jsGrid").jsGrid({
            width: "100%",
            inserting: false,
            editing: false,
            sorting: false,
            paging: true,
            fields: [{ name: "schoolName", title: "School Name", type: "text", width: 120 },
            { name: "className", title: "Class Name", type: "text", width: 140 },
            { name: "section", title: "Section", type: "text", width: 120 },
            { name: "displayName", title: "Class Teacher", type: "text", width: 120 },
            ],
            rowClick: function (args) {
                showClassListDetailsDialog(args.item, true);
            },
            data: JSON.parse(responce)
        });
        document.getElementById("new_loader").style.display = "none";
    });
    classListReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    }
    );
}

function showClassListDetailsDialog(args, forEdit) {
    let getTeacherList = $.post(baseUrl + "/apis/classList.php", {
        type: "getUserList",
        uid: me_data.uid
    });

    getTeacherList.done(function (responce) {

        let teacherList = JSON.parse(responce)
        setValuesInClassTeacherSelect(teacherList);

        if (forEdit) {
            document.getElementById("classListModalTitel").innerHTML = '<h4>Edit Class Details</h4>'
            document.getElementById("newClassName").value = args.className;
            document.getElementById("newClassName").disabled = true;
            document.getElementById("newClassSection").value = args.section;
            document.getElementById("newClassSection").disabled = true;
            document.getElementById('newClassTeacher').value = args.uid;
            document.getElementById("newSchoolId").value = args.schoolId;
            document.getElementById("classDeleteBtn").style.display = "block";
        }
        else {
            document.getElementById("newClassName").disabled = false;
            document.getElementById("newClassSection").disabled = false;
            document.getElementById("classDeleteBtn").style.display = "none";
            document.getElementById("newClassName").value = '';
            document.getElementById("newClassSection").value = '';
            document.getElementById("classListModalTitel").innerHTML = '<h4>Create New Class</h4>'
        }

        $("#addEditClassList").modal();
    });

    getTeacherList.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });

}

function setValuesInClassTeacherSelect(teacherList) {
    $('#newClassTeacher').empty();
    $('#newClassTeacher').append($('<option>', {
        value: "",
        text: "Select Class Teacher",
        selected: true,
        disabled: true
    }, '</option>'));
    for (var index in teacherList) {
        $('#newClassTeacher')
            .append($('<option>', {
                value: teacherList[index].uid,
                text: teacherList[index].displayName,
            }, '</option>'));
    }
}

function setValuesInSchoolListSelect() {
    document.getElementById("new_loader").style.display = "block";
    let schoolreq = $.post(baseUrl + "/apis/classList.php", {
        type: "getAllSchools",
        uid: me_data.uid
    });

    schoolreq.done(function (responce) {
        let schoolArray = JSON.parse(responce);
        $('#newSchoolId').empty();
        $('#newSchoolId').append($('<option>', {
            value: "",
            text: "Select School",
            selected: true,
            disabled: true
        }, '</option>'));
        for (var index in schoolArray) {
            $('#newSchoolId')
                .append($('<option>', {
                    value: schoolArray[index].schoolId,
                    text: schoolArray[index].schoolName,
                }, '</option>'));
        }
        document.getElementById("new_loader").style.display = "none";           
    });

    schoolreq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}


function deleteClassListItem() {
    document.getElementById("new_loader").style.display = "block";
    let deleteClassListItemReq = $.post(baseUrl + "/apis/classList.php", {
        type: "deleteClassItem",
        uid: me_data.uid,
        className: document.getElementById("newClassName").value,
        section: document.getElementById("newClassSection").value
    });

    deleteClassListItemReq.done(function (responce) {
        if (responce == 200) {
            showNotification("Success!", "Class Deleted Successfully", "success");
            getClassListToShow();
        }
        else if (responce == 300) {
            showNotification("Error!", "Class is in use", "danger");
        }
        else {
            showNotification("Error!", "Failed to delete Class", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    deleteClassListItemReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function createOrUpdateClass() {
    if (document.getElementById("classListModalTitel").innerHTML.includes("Create")) {

        let classListVal = document.getElementById("newClassName").value;
        let sectionVal = document.getElementById("newClassSection").value;
        let teacherIdVal = document.getElementById('newClassTeacher').value;
        let schoolIdVal = document.getElementById("newSchoolId").value;
        if (classListVal != "" && sectionVal != "" && teacherIdVal != "") {
            document.getElementById("new_loader").style.display = "block";
            let insertClassReq = $.post(baseUrl + "/apis/classList.php", {
                type: "insertClass",
                className: classListVal,
                uid: me_data.uid,
                section: sectionVal,
                schoolId: schoolIdVal,
                teacherId: teacherIdVal
            });

            insertClassReq.done(function (responce) {
                if (responce == 200) {
                    showNotification("Success!", "Class Created Successfully", "success");
                    getClassListToShow();
                }
                else {
                    showNotification("Error!", "Class & Section together must be unique", "danger");
                }
                document.getElementById("new_loader").style.display = "none";
            });

            insertClassReq.fail(function (jqXHR, textStatus) {
                document.getElementById("new_loader").style.display = "none";
                handleNetworkIssues(textStatus)
            });
        }

        else {
            showNotification("Error!", "Class, Section and teacher must be selected", "warning");
        }

    }
    else {

        let classListVal = document.getElementById("newClassName").value;
        let sectionVal = document.getElementById("newClassSection").value;
        let teacherIdVal = document.getElementById('newClassTeacher').value
        let schoolIdVal = document.getElementById("newSchoolId").value;

        document.getElementById("new_loader").style.display = "block";
        let updateClassTeacherReq = $.post(baseUrl + "/apis/classList.php", {
            type: "updateClass",
            uid: me_data.uid,
            className: classListVal,
            teacherId: teacherIdVal,
            schoolId: schoolIdVal,
            section: sectionVal
        });

        
        updateClassTeacherReq.done(function (responce) {
            if (responce == 200) {
                showNotification("Success!", "Class Teacher Updated Successfully", "success");
                manageClassList();
            }
            else {
                showNotification("Error!", "Failed to delete Class", "danger");
            }
            document.getElementById("new_loader").style.display = "none";
        });

        updateClassTeacherReq.fail(function (jqXHR, textStatus) {
            document.getElementById("new_loader").style.display = "none";
            handleNetworkIssues(textStatus)
        });
    }
}

//Handle UPDATE CREATE;
function manageFeesHeads() {
    setActiveColorsAdminTasks("manageFeesHeads");

    let manageFeesHeadsHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Fees Heads</h5>
          <hr>
    </div>
    
    <div class="container" id="manageHeadsHolder">
    </div>
    <div id="jsGrid" style = "display:none"></div>
    </div>`;

    document.getElementById('adminActionHolder').innerHTML = manageFeesHeadsHTML;
    makeViewForFeeHeads();
}

function makeViewForFeeHeads() {
    document.getElementById("new_loader").style.display = "block";
    let getAllfeeData = $.post(baseUrl + "/apis/feesHeads.php", {
        type: "getAllHeads",
        uid: me_data.uid
    });

    getAllfeeData.done(function (responce) {
        try{
            let feeData = JSON.parse(responce);
            $("#jsGrid").jsGrid({
                width: "100%",
                inserting: false,
                editing: true,
                sorting: false,
                paging: true,
    
                data: feeData,
    
                fields: [
                    { name: "headName", type: "text", width: 140 },
                    { name: "amount_KG1", type: "number", width: 120 },
                    { name: "amount_KG2", type: "number", width: 120 },
                    { name: "amount_Nursery", type: "number", width: 160 },
                    { name: "amount_1st", type: "number", width: 120 },
                    { name: "amount_2nd", type: "number", width: 120 },
                    { name: "amount_3rd", type: "number", width: 120 },
                    { name: "amount_4th", type: "number", width: 120 },
                    { name: "amount_5th", type: "number", width: 120 },
                    { name: "amount_6th", type: "number", width: 120 },
                    { name: "amount_7th", type: "number", width: 120 },
                    { name: "amount_8th", type: "number", width: 120 },
                    { name: "amount_9th", type: "number", width: 120 },
                    { name: "amount_10th", type: "number", width: 120 },
                    { type: "control", width: 60 }
                ],
    
                onItemUpdating: function (args) {
                    // cancel update of the item with empty 'name' field
                    if (args.item.headName === "") {
                        args.cancel = true;
                        showNotification("<strong>Error!</strong>", "Enter fees head name.", "warning");
                    }
                    else {
                        updateFeeHeadDetails(args.item);
                    }
    
                }
            });
        }
        catch(e){
             showNotification("Error", "Failed to get data", "danger");
        }
        

        
        document.getElementById('jsGrid').style.display = "block";
        document.getElementById("new_loader").style.display = "none";
    });

    getAllfeeData.fail(function(jqXHR, textStatus){
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function updateFeeHeadDetails(FeeHeadItem) {
    document.getElementById("new_loader").style.display = "block";
        let updateHeadItemReq = $.post(baseUrl + "/apis/feesHeads.php", {
            type: "updateById",
            uid: me_data.uid,
            id: FeeHeadItem.headId,
            headName: FeeHeadItem.headName,
            amount_KG1: FeeHeadItem.amount_KG1,
            amount_KG2: FeeHeadItem.amount_KG2,
            amount_Nursery: FeeHeadItem.amount_Nursery,
            amount_1st: FeeHeadItem.amount_1st,
            amount_2nd: FeeHeadItem.amount_2nd,
            amount_3rd: FeeHeadItem.amount_3rd,
            amount_4th: FeeHeadItem.amount_4th,
            amount_5th: FeeHeadItem.amount_5th,
            amount_6th: FeeHeadItem.amount_6th,
            amount_7th: FeeHeadItem.amount_7th,
            amount_8th: FeeHeadItem.amount_8th,
            amount_9th: FeeHeadItem.amount_9th,
            amount_10th: FeeHeadItem.amount_10th
        });

        updateHeadItemReq.done(function (responce) {
            if (responce != 200) {
                // if failed -> get old view
                showNotification("<strong>Error</strong>", "Failed. loading old data", "danger");
                makeViewForFeeHeads();
            }
            else{
                showNotification("<strong>Success</strong>", "Fees Head Updated", "success");
            }
            document.getElementById("new_loader").style.display = "none";
        });

        updateHeadItemReq.fail(function(jqXHR, textStatus){
            document.getElementById("new_loader").style.display = "none";
            handleNetworkIssues(textStatus)
        });
};function manageRoles() {
    setActiveColorsAdminTasks("manageRoles");
    let userRoleHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage User Roles</h5>
          <hr>
    </div>
    
    <div class="container" id="manageRolesHolder">
    </div>
    <div class="container" style = "margin:2%">
    <div class="row">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="fa fa-plus button button6" style="border-radius:50%; padding:20%" onclick="createUserGroupView()"></i>
   
    </div>
    </div>
    
    </div>`;

    document.getElementById('adminActionHolder').innerHTML = userRoleHTML;
    getRoleList();
}

function getRoleList() {
    document.getElementById("new_loader").style.display = "block";
    var userRoleReq = $.post(baseUrl + "/apis/userGroup.php", {
        type: "getAllRolesWithId",
        uid: me_data.uid
    });

    userRoleReq.done(function(responce) {
        try {
            var RoleArray = JSON.parse(responce);
            if (RoleArray.length > 0) {
                makeRoleEditView(RoleArray);
            }
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    userRoleReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function makeRoleEditView(roleArray) {
    document.getElementById("manageRolesHolder").innerHTML = "";
    for (var itr in roleArray) {
        var itemHtml = `<div class="container">
        <div class="row collapsible" style="padding:2%" id="item` + itr + `" data-toggle="collapse" data-target="#data` + itr + `">
            <div class="col-md-6" style="background:var(--btnColor1); text-align:left" id="groupName` + itr + `"></div>
            <div class="col-md-6" style="background:var(--btnColor1); text-align:right"><i class="fa fa-arrow-down" style="background:var(--btnColor1); display:block"></i></div>
            </div>

            <div id="data` + itr + `" class="collapse" style="padding:2%; border-radius: 15px; margin-left:2%; margin-right:2%">
                   <h6>Group Properties</h6>
                   <hr>
                   <div class="row" style="padding:2%">
                        <div class="col-md-3">
                        <label for="manageUsers` + itr + `" class="checklabel">Manage Users
                            <input type="checkbox" id="manageUsers` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="manageRoles` + itr + `" class="checklabel">Manage Role Groups
                            <input type="checkbox" id="manageRoles` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="manageFeesHeads` + itr + `" class="checklabel">Manage Fees
                            <input type="checkbox" id="manageFeesHeads` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="newAccadamicYear` + itr + `" class="checklabel">Start New Accadamic Year
                            <input type="checkbox" id="newAccadamicYear` + itr + `">
                            <span class="checkmark"></span>
                         </label>
                        </div>
                   </div>

                   <div class="row" style="padding:2%">
                        <div class="col-md-4">
                        <label for="registerStudent` + itr + `" class="checklabel">Register Student
                            <input type="checkbox" id="registerStudent` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-4">
                        <label for="searchNEdit` + itr + `" class="checklabel">Search and edit student data
                            <input type="checkbox" id="searchNEdit` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-4">
                        <label for="manageClass` + itr + `" class="checklabel">Manage Class List
                            <input type="checkbox" id="manageClass` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>
                   </div>

                   <div class="row" style="padding:2%">
                        <div class="col-md-3">
                        <label for="generateReceipt` + itr + `" class="checklabel">Generate Receipt
                            <input type="checkbox" id="generateReceipt` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="feesReport` + itr + `" class="checklabel">View Fees Reports
                            <input type="checkbox" id="feesReport` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="studentAttendence` + itr + `" class="checklabel">Enter Student Attendence
                            <input type="checkbox" id="studentAttendence` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="studentReport` + itr + `" class="checklabel">Student Report
                            <input type="checkbox" id="studentReport` + itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>
                   </div>

                   <div class="row" style="padding:1%">
                    <div class="col-md-12">
                          <button class="btn btn-primary" style="float:right; `+CSSbtnPrimary+`" onclick="updateGroupDetails(this.parentNode.parentNode.parentNode)">Update</button>
                          <button class="btn btn-danger" style="float:right; margin-right:2%; `+CSSbtnDanger+`" onclick="deleteGroup(this.parentNode.parentNode.parentNode)">Delete Group</button> 
                    </div>
                   </div>
            </div>
            </div>
        `;

        document.getElementById("manageRolesHolder").innerHTML += itemHtml;
        document.getElementById("groupName" + itr).innerText = roleArray[itr].userType;
    }

    //set checkbox states
    for (itr in roleArray) {
        if (roleArray[itr].manageUsers == 1) {
            document.getElementById("manageUsers" + itr).checked = true;
        }

        if (roleArray[itr].manageRoles == 1) {
            document.getElementById("manageRoles" + itr).checked = true;
        }
        if (roleArray[itr].manageFeesHeads == 1) {
            document.getElementById("manageFeesHeads" + itr).checked = true;
        }
        if (roleArray[itr].newAccadamicYear == 1) {
            document.getElementById("newAccadamicYear" + itr).checked = true;
        }
        if (roleArray[itr].registerStudent == 1) {
            document.getElementById("registerStudent" + itr).checked = true;
        }
        if (roleArray[itr].searchNEdit == 1) {
            document.getElementById("searchNEdit" + itr).checked = true;
        }
        if (roleArray[itr].manageClass == 1) {
            document.getElementById("manageClass" + itr).checked = true;
        }
        if (roleArray[itr].generateReceipt == 1) {
            document.getElementById("generateReceipt" + itr).checked = true;
        }
        if (roleArray[itr].feesReport == 1) {
            document.getElementById("feesReport" + itr).checked = true;
        }
        if (roleArray[itr].studentAttendence == 1) {
            document.getElementById("studentAttendence" + itr).checked = true;
        }
        if (roleArray[itr].studentReport == 1) {
            document.getElementById("studentReport" + itr).checked = true;
        }

    }
}

function updateGroupDetails(view) {
    //row one
    let manageUsers = view.childNodes[5].childNodes[1].childNodes[1].childNodes[1].checked;
    manageUsers = isCheckedGeneric(manageUsers);
    let manageRoles = view.childNodes[5].childNodes[3].childNodes[1].childNodes[1].checked;
    manageRoles = isCheckedGeneric(manageRoles);
    let manageFeesHeads = view.childNodes[5].childNodes[5].childNodes[1].childNodes[1].checked;
    manageFeesHeads = isCheckedGeneric(manageFeesHeads);
    let newAccadamicYear = view.childNodes[5].childNodes[7].childNodes[1].childNodes[1].checked;
    newAccadamicYear = isCheckedGeneric(newAccadamicYear);

    //row two
    let registerStudent = view.childNodes[7].childNodes[1].childNodes[1].childNodes[1].checked;
    registerStudent = isCheckedGeneric(registerStudent);
    let searchNEdit = view.childNodes[7].childNodes[3].childNodes[1].childNodes[1].checked;
    searchNEdit = isCheckedGeneric(searchNEdit);
    let manageClass = view.childNodes[7].childNodes[5].childNodes[1].childNodes[1].checked;
    manageClass = isCheckedGeneric(manageClass);

    //row three
    let generateReceipt = view.childNodes[9].childNodes[1].childNodes[1].childNodes[1].checked;
    generateReceipt = isCheckedGeneric(generateReceipt);
    let feesReport = view.childNodes[9].childNodes[3].childNodes[1].childNodes[1].checked;
    feesReport = isCheckedGeneric(feesReport);
    let studentAttendence = view.childNodes[9].childNodes[5].childNodes[1].childNodes[1].checked;
    studentAttendence = isCheckedGeneric(studentAttendence);
    let studentReport = view.childNodes[9].childNodes[7].childNodes[1].childNodes[1].checked;
    studentReport = isCheckedGeneric(studentReport);

    let userType = view.parentNode.childNodes[1].childNodes[1].innerText;


    //send request
    document.getElementById("new_loader").style.display = "block";
    var updateGroupReq = $.post(baseUrl + "/apis/userGroup.php", {
        type: "updateUserGroup",
        uid: me_data.uid,
        userType: userType,

        manageUsers: manageUsers,
        manageRoles: manageRoles,
        manageFeesHeads: manageFeesHeads,
        newAccadamicYear: newAccadamicYear,

        registerStudent: registerStudent,
        searchNEdit: searchNEdit,
        manageClass: manageClass,

        generateReceipt: generateReceipt,
        feesReport: feesReport,
        studentAttendence: studentAttendence,
        studentReport: studentReport
    });

    updateGroupReq.done(function(responce) {
        if (responce == 200) {
            showNotification("Success", "User Group Updated", "success");
            getRoleList();
        } else {
            console.log(responce)
            showNotification("<strong>Error</strong>", "Failed to update group", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    updateGroupReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function deleteGroup(view) {
    let userType = view.parentNode.childNodes[1].childNodes[1].innerText;
    document.getElementById("new_loader").style.display = "block";
    var deleteGroupReq = $.post(baseUrl + "/apis/userGroup.php", {
        type: "deleteUserGroup",
        uid: me_data.uid,
        userType: userType
    });
    deleteGroupReq.done(function(responce) {
        if (responce == 200) {
            showNotification("Success", "User Group Deleted", "success");
            view.parentNode.parentNode.removeChild(view.parentNode);
        } else {
            showNotification("<strong>Error</strong>", "Failed to delete group", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    })

    deleteGroupReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function isCheckedGeneric(isChecked) {
    if (isChecked) {
        temp = 1;
    } else {
        temp = 0;
    }
    return temp;
}

function createUserGroupView() {
    $("#createNewUserGroupModal").modal();
}

function createNewUserGroupForSure() {
    let newGroupName = document.getElementById("newUserGroupName").value;
    if (newGroupName == null || newGroupName == "") {
        document.getElementById("groupNotUniqueAlert").style.display = "block";
    } else {
        document.getElementById("groupNotUniqueAlert").style.display = "none";


        let NewNanageUsers = document.getElementById("NewNanageUsers").checked;
        NewNanageUsers = isCheckedGeneric(NewNanageUsers);

        let NewManageRoles = document.getElementById("NewManageRoles").checked;
        NewManageRoles = isCheckedGeneric(NewManageRoles);

        let NewManageFeesHeads = document.getElementById("NewManageFeesHeads").checked;
        NewManageFeesHeads = isCheckedGeneric(NewManageFeesHeads);

        let NewNewAccadamicYear = document.getElementById("NewNewAccadamicYear").checked;
        NewNewAccadamicYear = isCheckedGeneric(NewNewAccadamicYear);

        let NewRegisterStudent = document.getElementById("NewRegisterStudent").checked;
        NewRegisterStudent = isCheckedGeneric(NewRegisterStudent);

        let NwSearchNEdit = document.getElementById("NwSearchNEdit").checked;
        NwSearchNEdit = isCheckedGeneric(NwSearchNEdit);

        let NewManageClass = document.getElementById("NewManageClass").checked;
        NewManageClass = isCheckedGeneric(NewManageClass);

        let NewGenerateReceipt = document.getElementById("NewGenerateReceipt").checked;
        NewGenerateReceipt = isCheckedGeneric(NewGenerateReceipt);

        let NewFeesReport = document.getElementById("NewFeesReport").checked;
        NewFeesReport = isCheckedGeneric(NewFeesReport);

        let NewStudentAttendence = document.getElementById("NewStudentAttendence").checked;
        NewStudentAttendence = isCheckedGeneric(NewStudentAttendence);

        let NewStudentReport = document.getElementById("NewStudentReport").checked;
        NewStudentReport = isCheckedGeneric(NewStudentReport);



        document.getElementById("new_loader").style.display = "block";
        var createNewRoleRequest = $.post(baseUrl + "/apis/userGroup.php", {
            type: "createNewRole",
            uid: me_data.uid,
            newGroupName: newGroupName,
            NewNanageUsers: NewNanageUsers,
            NewManageRoles: NewManageRoles,
            NewManageFeesHeads: NewManageFeesHeads,
            NewNewAccadamicYear: NewNewAccadamicYear,
            NewRegisterStudent: NewRegisterStudent,
            NwSearchNEdit: NwSearchNEdit,
            NewManageClass: NewManageClass,
            NewGenerateReceipt: NewGenerateReceipt,
            NewFeesReport: NewFeesReport,
            NewStudentAttendence: NewStudentAttendence,
            NewStudentReport: NewStudentReport
        });

        createNewRoleRequest.done(function(responce) {
            if (responce == 200) {
                manageRoles();
            }
            document.getElementById("new_loader").style.display = "none";
        });

        createNewRoleRequest.fail(function(jqXHR, textStatus) {
            document.getElementById("new_loader").style.display = "none";
            handleNetworkIssues(textStatus)
        });
    }
};function manageUsers() {
  setActiveColorsAdminTasks("manageUsers");

  let manageUsersHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Users</h5>
          <hr>
    </div>

    
    <div class="row" style="margin:2%">
      <div class="col-md-4">
        <input class="form-control" type="text" placeholder="Search.." onkeyup="sendSearchUserRequest()" id="searchBarView">
      </div>
      <div class="col-md-3">
        <select class="form-control" id="searchByForUser">
          <option selected disabled value="">Search By</option>
          <option value="byName">Name</option>
          <option value="byEmailId">Email Id</option>
          <option value="byPhoneNumber">Phone Number</option>
          <option value="ALL">List All Users</option>
        </select>
      </div>
      <div class="col-md-2" style="text-align: end">
        <label for="maxRowsForUser">Max Rows</label>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="number" id="maxRowsForUser" value = "5">
      </div>
    </div>


    <div class="row" style="margin-top:1.5%;" >
      <div class="col-md-7">
      <div class="alertMine" id="errorMessage" style="display: none">Please Select search methord and number of rows</div>
      </div>
    </div>
    
    <div class="row" id="allUserHolder">
    </div>

    <div class="container" id="userDetailsHolder">
    </div>
    `;
  document.getElementById('adminActionHolder').innerHTML = manageUsersHTML;

  $(document).on('change', '#searchByForUser', function () {
    sendSearchUserRequest();
  });
  $(document).on('change', '#maxRowsForUser', function () {
    sendSearchUserRequest();
  });
}

function sendSearchUserRequest() {
  let queryString = document.getElementById("searchBarView").value;
  
  let userSearchMeathord = document.getElementById("searchByForUser").value;
  if(userSearchMeathord == "ALL"){
    document.getElementById("searchBarView").disabled = true;
  }
  else{
    document.getElementById("searchBarView").disabled = false;
  }

  let maxCols = document.getElementById("maxRowsForUser").value;
  document.getElementById('userDetailsHolder').innerHTML = '';

  if (maxCols == "" || userSearchMeathord == "" || maxCols < parseInt("0", 10)) {
    document.getElementById("errorMessage").style.display = "block";
  }
  else {
    if ((queryString != "" && queryString != null) || userSearchMeathord == "ALL") {
      document.getElementById("errorMessage").style.display = "none";
      if(userSearchMeathord == "ALL"){
        document.getElementById("new_loader").style.display = "block";
      }
      let searchUserReq = $.post(baseUrl + "/apis/User.php", {
        type: "searchUser",
        uid: me_data.uid,
        searchType: userSearchMeathord,
        limit: maxCols,
        inputSearch: queryString
      });

      searchUserReq.done(function (responce) {
        console.log(responce);
        try {
          makeUserView(JSON.parse(responce));
        }
        catch (e) {
          showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
      });

      searchUserReq.fail(function(jqXHR, textStatus){
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
      });
    }
    else {
      document.getElementById('allUserHolder').innerHTML = `<div class="row collapsible">
    <div class="text-center" style="background:var(--btnColor1)"><h5 style="background:var(--btnColor1)">No Result Found</h5>
    </div>
    </div>`;
    }
  }
}


function makeUserView(allUserArray) {
  document.getElementById('allUserHolder').innerHTML = '';
  if (allUserArray.length > 0) {
    for (var itr in allUserArray) {
      userItemHtml = `<div class="row collapsible" onclick="getUserDetails(this)">
               <div class="col-rmd-1" style="background:var(--btnColor1)">
                 <img style="width: 50px; height: 50px; border-radius: 50%" id="userImg`+ itr + `">
               </div>
               <div class="col-rmd-11" style="background:var(--btnColor1)">
                 <div class="row" style="font-size: 18px">
                   <div class="col-rmd-8" style="background:var(--btnColor1)" id="displayName`+ itr + `">
                   </div>
                   <div class="col-rmd-4" style="background:var(--btnColor1)" style="text-align: right; padding-right:1%" id="mobileNumber`+ itr + `"> 
                   </div>
                 </div>
                 <div class="row" style="margin-top:1%">
                   <div class="col-rmd-10" style="background:var(--btnColor1)" id="emailId`+ itr + `">
                   </div>
                   <div style="display: none;" id="userId`+ itr + `"></div>
                   <div class="col-md-2" style="background:var(--btnColor1)"><i class="fa fa-trash" style="float:right; cursor:pointer" onclick="deleteUser(this)"></i></div>
                 </div>
               </div> 
            </div>`;

      document.getElementById('allUserHolder').innerHTML += userItemHtml;

      document.getElementById('userId' + itr).innerText = allUserArray[itr].uid;
      if (allUserArray[itr].photo != "") {
        document.getElementById('userImg' + itr).src = allUserArray[itr].photo;
      }
      else {
        document.getElementById('userImg' + itr).src = baseUrl + "/img/me.png";
      }
      document.getElementById('displayName' + itr).innerText = allUserArray[itr].displayName;
      document.getElementById('mobileNumber' + itr).innerText = allUserArray[itr].mobileNumber;
      document.getElementById('emailId' + itr).innerText = allUserArray[itr].eid;
    }
  }
  else {
    document.getElementById('allUserHolder').innerHTML = `<div class="row collapsible">
    <div class="text-center"><h4>No Result Found</h4>
    </div>
    </div>`;
  }

}

function deleteUser(deleteUserBtn) {
  event.stopPropagation();
  let uidForDelete = deleteUserBtn.parentNode.parentNode.childNodes[3].innerText;
  let confirmDelteUser = confirm("Are you sure about deleting user account..?");
  if (confirmDelteUser == true) {
    document.getElementById("new_loader").style.display = "block";
    let userDeleteReq = $.post(baseUrl + "/apis/User.php", {
      type: "deleteUserByUid",
      uid: uidForDelete
    });

    userDeleteReq.done(function (responce) {
      if (responce == 200) {
        document.getElementById("userDetailsHolder").innerHTML = "";
        document.getElementById("allUserHolder").removeChild(deleteUserBtn.parentNode.parentNode.parentNode.parentNode);
      }
      else {
        showNotification("<strong>Error</strong>", "Failed to delete user", "danger");
      }
      document.getElementById("new_loader").style.display = "none";
    });

    userDeleteReq.fail(function(jqXHR, textStatus){
      document.getElementById("new_loader").style.display = "none";
      handleNetworkIssues(textStatus)
    });
  }

}

function getUserDetails(usersView) {

  removeOtherUserViews(usersView);  //remove other users from view
  let uidForThis = usersView.childNodes[3].childNodes[3].childNodes[3].innerText; //get userId from view

  //get usertypes for selected user
  document.getElementById("new_loader").style.display = "block";
  var myRolesListReq = $.post(baseUrl + "/apis/userGroup.php", {
    type: "getAllRolesForUser",
    uid: uidForThis
  });

  myRolesListReq.done(function (myRoleList) {
    try {
      console.log(myRoleList)
      let myRoleListArray = JSON.parse(myRoleList);
      document.getElementById('userDetailsHolder').innerHTML = `<div class="text-center">
          <h6>Edit User Groups</h6>
          <hr>
        </div>`;

      if (myRoleListArray.length > 0) {
        for (var itr in myRoleListArray) {
          let roleItemHTML = `<div class="row collapsible" style="cursor:default">
            <div class="col" id="roleId`+ itr + `" style="display:none"></div>
            <div class="col-md-10" style="background:var(--btnColor1)" id="roleName`+ itr + `"></div>
            <div class="col-md-2" style="background:var(--btnColor1)"><i class="fa fa-trash" style="float:right; cursor:pointer" onclick="deleteRoleItem(this)"></i></div>
            </div>`;
          document.getElementById('userDetailsHolder').innerHTML += roleItemHTML;
          document.getElementById('roleId' + itr).innerText = myRoleListArray[itr].id;
          document.getElementById('roleName' + itr).innerText = myRoleListArray[itr].userType;
        }
      }
      document.getElementById('userDetailsHolder').innerHTML += `<div class="row" style="margin-top:2%; margin-bottom:2%">
        <div class="col-md-11"></div>
        <div class="col-md-1"> <i class="fa fa-plus button button5" style="border-radius:50%; padding:20%" onclick="addUserGroup(this)"></i>
        </div>
        </div>`;
    }
    catch (e) {
      showNotification("Error", "Failed to get data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  myRolesListReq.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function addUserGroup(addBtnView) {
  let uid = document.getElementById('allUserHolder').childNodes[0].childNodes[3].childNodes[3].childNodes[3].innerText;
  document.getElementById("new_loader").style.display = "block";
  var getUserGroupsToAdd = $.post(baseUrl + "/apis/userGroup.php", {
    type: "getUserGroupsToAdd",
    uid: uid
  });

  getUserGroupsToAdd.done(function (userGroupList) {
    try {
      let userGroupListArray = JSON.parse(userGroupList);
      $("#addRoleModal").modal();
      document.getElementById("addRoleBody").innerHTML = ``;
      if (userGroupListArray.length > 0) {
        document.getElementById('addRoleBtn').style.display = "block";
        for (var itr in userGroupListArray) {
          document.getElementById("addRoleBody").innerHTML += `<div class="row">
          <label for="newRole`+ itr + `" class="checklabel"><div id="newRoleText` + itr + `"></div>
                  <input type="checkbox" id="newRole`+ itr + `">
                  <span class="checkmark"></span>
          </label>
          <div>`;
          document.getElementById("newRoleText" + itr).innerText = userGroupListArray[itr].userType;
        }
      }
      else {
        document.getElementById('addRoleBtn').style.display = "none";
        document.getElementById("addRoleBody").innerHTML = "User is already part of all user groups";
      }
    }
    catch (e) {
      showNotification("Error", "Failed to get data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  getUserGroupsToAdd.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)});
}

function addNewRoleConfirm() {
  let uid = document.getElementById('allUserHolder').childNodes[0].childNodes[3].childNodes[3].childNodes[3].innerText;
  let viewArray = document.getElementById("addRoleBody").childNodes;
  let userTypeArray = [];
  for (itr = 0; itr < viewArray.length; itr++) {
    if (getCheckBoxValue("newRole" + itr)) {
      userTypeArray.push(document.getElementById("newRoleText" + itr).innerText);
    }
  }
  document.getElementById("new_loader").style.display = "block";
  var addNewRolesReq = $.post(baseUrl + "/apis/userGroup.php", {
    type: "addNewRoles",
    uid: uid,
    thingsToAdd: userTypeArray
  });

  addNewRolesReq.done(function (responce) {
    if (responce == 200) {
      getUserDetails(document.getElementById('allUserHolder').childNodes[0]);
    }
    else {
      showNotification("<strong>Error</strong>", "Failed to update user groups", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  addNewRolesReq.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });

}

function deleteRoleItem(roleItemView) {

  var confirmState = confirm("Are you sure about removing this usergroup..?");
  if (confirmState == true) {
    let roleId = roleItemView.parentNode.parentNode.childNodes[1].innerText;
    document.getElementById("new_loader").style.display = "block";
    let deleteRoleReq = $.post(baseUrl + "/apis/userGroup.php", {
      type: "deleteUserGroupById",
      uid: me_data.uid,
      id: roleId
    });

    deleteRoleReq.done(function (responce) {
      if (responce == 200) {
        roleItemView.parentNode.parentNode.parentNode.removeChild(roleItemView.parentNode.parentNode);
      }
      else {
        showNotification("<strong>Error</strong>", "Failed to delete user group", "danger");
      }
      document.getElementById("new_loader").style.display = "none";
    });

    deleteRoleReq.fail(function(jqXHR, textStatus){
      document.getElementById("new_loader").style.display = "none";
      handleNetworkIssues(textStatus)
    });
  }
}

function removeOtherUserViews(usersView) {
  document.getElementById("allUserHolder").innerHTML = '';
  document.getElementById("allUserHolder").appendChild(usersView);
}


//TODO replace getUserList With searchUserForList;
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
};
let isFirstUpdateProfileListener = true;
let updatedProfileImage = '';
let imageDataChanged = false;

function profileSettings() {
    $('#toggleNav').dropdown('toggle');
    profileSettingsHTML = `<div class="backgroundDefiner container" id="profileSettingsHTML" style="background: var(--btnColor3); margin-top:3%; margin-bottom: 3%; width: 50%; border-radius: 15px; padding: 1%">
  <form id="profileUpdateForm">  
  <div class="row" style="margin-top:3%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-8" style="text-align: center">
        <h4>Profile Settings</h4>
      </div>
    </div>

    <div class="row" style="margin-top:3%">
        <div class="col-rmd-2"></div>
        <div class="col-rmd-2">
            <img id="myProfileImgForUpdate" style="border-radius: 50%; height: 60px; width: 60px"> 
        </div>
    </div>

    <div class="row" style="margin-top:2%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-3">
        <input type="file" accept="image/*" id="img_pickerUpdateProfileImage">
      </div>
    </div>

    <div class="row" style="margin-top:2%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-8">
        <label for="up_displayName">Display Name</label>
      </div>
    </div>
    <div class="row" >
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <input type="text" class="form-control" id="up_displayName">
      </div>
    </div>

    <div class="row"style="margin-top:2%">
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <label for="up_mobileNumber">Mobile Number</label>
      </div>
    </div>
    <div class="row" >
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <input type="text" class="form-control" id="up_mobileNumber" maxlength="10" pattern="[789][0-9]{9}" required>
      </div>
    </div>

    <div class="row" style="margin-top:2%">
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <label for="up_emailId">Email - Id</label>
      </div>
    </div>
    <div class="row" >
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <input type="email" class="form-control" id="up_emailId">
      </div>
    </div>
    <div class="row" style="margin-top:2%">
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <button type="submit" style="float: left; `+CSSbtnPrimary+`" class="btn btn-primary">Update</button>
      </div>
    </div>
    </form>
  </div>`;

    document.getElementById("section_main").innerHTML = profileSettingsHTML;
    setProfileDetails();
    updatedProfileImage = me_data.photo;
    if (isFirstUpdateProfileListener) {
        updateProfileListener();
        isFirstUpdateProfileListener = false;
    }
}

function setProfileDetails() {
    document.getElementById("up_displayName").value = me_data.displayName;
    document.getElementById("up_mobileNumber").value = me_data.mobileNumber;
    document.getElementById("up_emailId").value = me_data.eid;
    document.getElementById("myProfileImgForUpdate").src = me_data.photo;
}

function updateProfileListener() {

    $("#img_pickerUpdateProfileImage").change(function() {
        let input = document.getElementById("img_pickerUpdateProfileImage");
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#img_pickerUpdateProfileImage').attr('src', e.target.result);
                updatedProfileImage = e.target.result;
                document.getElementById('myProfileImgForUpdate').src = updatedProfileImage;
                imageDataChanged = true;
            };
            reader.readAsDataURL(input.files[0]);
        }
    });


    $('#profileUpdateForm').submit(function(event) {
        event.preventDefault();
        if (document.getElementById("up_displayName").value != me_data.displayName || document.getElementById("up_emailId").value != me_data.eid || document.getElementById("up_mobileNumber").value != me_data.mobileNumber || imageDataChanged == true) {
            document.getElementById("new_loader").style.display = "block";
            let updateProfileReq = $.post(baseUrl + "/apis/User.php", {
                type: "updateUser",
                uid: me_data.uid,
                displayName: document.getElementById("up_displayName").value,
                eid: document.getElementById("up_emailId").value,
                mobileNumber: document.getElementById("up_mobileNumber").value,
                photo: updatedProfileImage
            });
            updateProfileReq.done(function(updateMeRes) {
                if (updateMeRes == 200) {
                    showNotification("<strong>Suceess</strong>", "Page will refresh", "success");
                    location.reload();
                } else {
                    showNotification("<strong>Error</strong>", "Failed to update profile", "danger");
                }
                document.getElementById("new_loader").style.display = "none";
            });
            updateProfileReq.fail(function(jqXHR, textStatus) {
                document.getElementById("new_loader").style.display = "none";
                handleNetworkIssues(textStatus)
            });

        } else {
            showNotification("<strong>!!</strong>", "No data was changed", "info");
        }
    });
};
let FeeRepostType;
let FeeSessionSelect;
let isFirstDateReportView = true;
let isClassAndSectionFirst = true;
let dateFrom, dateTo;

function FeeRepostTypehangeFun() {
    FeeRepostType = document.getElementById('FeeRepostType').value;
    checkReportType();
}

function FeeSessionSelectOnChange() {
    FeeSessionSelect = document.getElementById('FeeSessionSelect').value;
    document.getElementById("errorMessage").style.display = "none";
    checkReportType();
}

function feesReport() {

    clearFilter();
    FeeRepostType = "";
    FeeSessionSelect = "";
    isFirstDateReportView = true;
    isClassAndSectionFirst = true;


    setActiveColorsfees("feesReport");
    searchcNEditHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Fees Report</h4>
      <hr>
    </div>
    <div class="row" id="typeHolder">
    <div class="col-md-2" style="text-align:right"><label for="FeeRepostType">Report Type: </label></div>
      <div class="col-md-4">
        <select class="form-control" id="FeeRepostType" onchange="FeeRepostTypehangeFun()">
          <option selected disabled value="">Select Report Type</option>
          <option value="receiptById">Get Receipt By Id</option>
          <option value="byDate">By Date</option>
          <option value="byMonth">By Month</option>
          <option value="bySchool">By School</option>
          <option value="classSummeryReport">Class Summery Report</option>
        </select>
      </div>
      <div class="col-md-4" id="feeSessionDiv">
        <select class="form-control" id="FeeSessionSelect" onchange="FeeSessionSelectOnChange()">
          <option selected disabled value="">Select Accedamic Year</option>
        </select>
      </div>
      <div class="col-md-1" id="filterImg">
      <img src="../img/filter.png" style="width:25px; height:25px;cursor: pointer;" onclick="showFilters()"></img>
      </div>



      <div class="col-md-4" id="receiptIdBox" style = "display:none">
        <input type = "number" placeholder = "Receipt Id" class = "form-control" id = "receiptIdToGet"> 
      </div>
      <div class="col-md-2" id="receiptGoBox" style = "display:none">
        <button class= "btn btn-secondary" style="`+CSSbtnPrimary+`" onclick="viewReceipt(this.parentNode.parentNode.childNodes[9].childNodes[1].value)">GO</button> 
      </div>
    </div>

    

    <div class="row" style="margin-top:1.5%; margin-bottom:1.5%">
      <div class="col-md-10">
        <hr>
      </div>
      <div class="col-md-3">
      </div>
      
    </div>
    
    <div class="row" id="feeInfoHolder" style="text-align:center">
    
    </div>
    
    <div class="row" style="margin-top:1.5%; margin-bottom:1.5%;display: none" id="botHR">
      <div class="col-md-12">
        <hr>
      </div>
           
    </div>

    <div class="row" style="margin-top:1.5%;" >
      <div class="col-md-7">
          <div class="alertMine" id="errorMessage" style="display: none">
          </div>
      </div>
    </div>

    <div class="container backgroundDefiner" id="FeeReportHolder" style="background:var(--btnColor3); border-radius: 20px; margin:1%">

    </div>
  </div>`;
    document.getElementById('feesActionHolder').innerHTML = searchcNEditHTML;
    loadAllSessionsAndSetListeners();
}

function loadAllSessionsAndSetListeners() {
    document.getElementById("new_loader").style.display = "block";
    var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
        type: "getAllSessions",
        uid: me_data.uid
    });

    allSessionReq.done(function(allSessions) {
        try {
            allSessions = JSON.parse(allSessions);
            for (var index in allSessions) {
                $('#FeeSessionSelect')
                    .append($('<option>', { value: allSessions[index].sessionName })
                        .text(allSessions[index].sessionName));
            }

            FeeSessionSelect = currentSession;
            document.getElementById("FeeSessionSelect").value = currentSession;
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    allSessionReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });

}

function checkReportType() {
    if (FeeSessionSelect == null || FeeSessionSelect == "") {
        document.getElementById("errorMessage").innerText = "Please select accedamic year";
        document.getElementById("errorMessage").style.display = "block";
    } else {

        if (FeeRepostType == "byDate") {
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById("feeSessionDiv").className = "col-md-5";
            document.getElementById('filterImg').style.display = "none";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-2" style="text-align: end">
                                                            <label for="dateFrom">Date From - To:</label>
                                                          </div>
                                                          <div class="col-md-4">
                                                            <input type="date" class="form-control" id="dateFrom">
                                                          </div>
                                                         
                                                          <div class="col-md-4">
                                                            <input type="date" class="form-control" id="dateTo">
                                                          </div>

                                                          <div class="col-md-1">
                                                          <button id="printBtn" style="float:right; `+CSSbtnSecondary+`" class="btn btn-secondary" onclick="printReport()" disabled>Print</button>
                                                          </div>
                                                         `;
            if (isFirstDateReportView) {
                $(document).on('change', '#dateFrom', function() {
                    dateFrom = document.getElementById('dateFrom').value;
                    ReportByDates();
                });
                $(document).on('change', '#dateTo', function() {
                    dateTo = document.getElementById('dateTo').value;
                    ReportByDates();
                });
            }
            isFirstDateReportView = false;
            document.getElementById("botHR").style.display = "block";
        } else if (FeeRepostType == "bySchool") {
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById("feeSessionDiv").className = "col-md-5";
            document.getElementById('filterImg').style.display = "none";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-10" style="text-align: end">
                                                              </div>
                                                              <div class="col-md-1">
                                                                <button id="printBtn" style="float:right; `+CSSbtnSecondary+`" class="btn btn-secondary" onclick="printReport()" disabled>Print</button>
                                                              </div>`;
            document.getElementById("errorMessage").style.display = "none";

            if (FeeSessionSelect != "") {
                reportBySchool();
            }
        } else if (FeeRepostType == "byMonth") {
            document.getElementById("feeSessionDiv").className = "col-md-5";
            document.getElementById('filterImg').style.display = "none";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-10" style="text-align: end">
                                                              </div>
                                                              <div class="col-md-1">
                                                                <button id="printBtn" style="float:right; `+CSSbtnPrimary+`" class="btn btn-secondary" onclick="printReport()" disabled>Print</button>
                                                              </div>`;
            document.getElementById("errorMessage").style.display = "none";

            if (FeeSessionSelect != "") {
                getMonthWiseReport();
            }
        } else if (FeeRepostType == "classSummeryReport") {
            document.getElementById("feeSessionDiv").className = "col-md-4";
            document.getElementById('filterImg').style.display = "block";
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("feeInfoHolder").innerHTML = ``;
            if (document.getElementById("filterClass").value == "" || document.getElementById("filterClass").value == null || document.getElementById("filterSection").value == "" || document.getElementById("filterSection").value == null) {
                document.getElementById("errorMessage").innerText = "Set values of Class And Section from filter";
                document.getElementById("errorMessage").style.display = "block";
            } else {
                UpdateFilter();
            }
            document.getElementById("botHR").style.display = "block";
        } else if (FeeRepostType == "receiptById") {
            document.getElementById('feeInfoHolder').innerHTML = ``;
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById('feeSessionDiv').style.display = "none";
            document.getElementById('filterImg').style.display = "none";
            document.getElementById('receiptIdBox').style.display = "block";
            document.getElementById('receiptGoBox').style.display = "block";
            document.getElementById("errorMessage").style.display = "none";
        } else {

        }


    }
}

function classSummeryReport() {
    document.getElementById("new_loader").style.display = "block";
    var classSummeryReportReq = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "classSummeryReport",
        uid: me_data.uid,
        class: document.getElementById("filterClass").value,
        section: document.getElementById("filterSection").value,
        sessionName: FeeSessionSelect
    });
    classSummeryReportReq.done(function(responseReport) {
        try {
            var reportJSON = JSON.parse(responseReport);

            for (var itr in reportJSON) {
                reportJSON[itr].balenceFees = parseInt(reportJSON[itr].totalFees, 10) - parseInt(reportJSON[itr].paidFees, 10);
            }

            console.log(reportJSON);
            document.getElementById('FeeReportHolder').innerHTML = `<div id="jsGrid" style = "display:none"></div>`;
            $("#jsGrid").jsGrid({
                width: "100%",
                inserting: false,
                editing: false,
                sorting: true,
                paging: true,

                data: reportJSON,

                fields: [
                    { name: "studentId", type: "number", width: 80 },
                    { name: "fullname", type: "text", width: 150, validate: "required" },
                    { name: "totalFees", type: "number", width: 80 },
                    { name: "paidFees", type: "number", width: 80 },
                    { name: "balenceFees", type: "number", width: 80 }
                ]
            });
            document.getElementById('jsGrid').style.display = "block";
            document.getElementById("new_loader").style.display = "none";
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
    });

    classSummeryReportReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}


function buildFeeReport(report, type) {
    document.getElementById('printBtn').disabled = true;
    document.getElementById('FeeReportHolder').innerHTML = `
  <div class="row" style="margin-bottom:3%">
  <div class="col-md-12">
    <canvas id="myChart" width="100" height="40"></canvas>
  </div>
  </div>

  <div class="row">
    <div id="jsGrid" style = "display:none;"></div>
  </div>`;

    let reportHeads = [];
    let fieldsArr = [],
        i = 0;
    if (report.length >= 1) {
        reportHeads = report[0];
        for (var key in reportHeads) {
            fieldsArr[i] = { name: key, type: "number", width: 120 };
            i++;
        }
        if (type == "ByDate") {
            document.getElementById('FeeReportHolder').innerHTML = ` <div class="row">
      <div id="jsGrid" style = "display:none; text-align:center"></div>
    </div>`;
            for (var itr in report) {
                let finalDateArr = report[itr].receiptDate.split("-");
                if (itr != report.length - 1) {
                    report[itr].receiptDate = finalDateArr[2] + "-" + finalDateArr[1] + "-" + finalDateArr[0];
                }
            }
        }
        //Month Wise Report
        else if (type == "ByMonth") {
            document.getElementById('FeeReportHolder').innerHTML = `
      <div class="row">
        <div class="col-md-12">
          <canvas id="myChart" width="100" height="40"></canvas>
        </div>
      </div>
      <div class="row" style="margin-top:5%">
        <div id="jsGrid" style = "display:none; text-align:center"></div>
      </div>`;
            var months = [];
            var totals = [];
            for (var itr in report) {
                if (itr != (report.length - 1)) {
                    months.push(report[itr].month);
                    totals.push(report[itr].Total);
                }
            }
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Earnings by month',
                        data: totals,
                        borderColor: '#2e86c1',
                        fill: false,
                    }]
                }
            });
        } else if (type == "BySchool") {
            document.getElementById('FeeReportHolder').innerHTML = `
      <div class="row">
        <div class="col-md-12">
          <canvas id="myChart" width="100" height="40"></canvas>
        </div>
      </div>
      <div class="row" style="margin-top:5%">
        <div id="jsGrid" style = "display:none; text-align:center"></div>
      </div>`;
            var months = [];
            var totals = [];
            for (var itr in report) {
                if (itr != (report.length - 1)) {
                    months.push(report[itr].schoolName);
                    totals.push(report[itr].Total);
                }
            }
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'doughnut',

                data: {
                    labels: months,
                    datasets: [{
                        label: 'Earnings By School',
                        data: totals,
                        borderColor: '#2e86c1',
                        backgroundColor: ["#7fb3d5", "#a9cce3", "#fadbd8"],
                    }]
                }
            });
        }

    }

    $("#jsGrid").jsGrid({
        width: "100%",
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        data: report,
        fields: fieldsArr
    });
    document.getElementById('jsGrid').style.display = "block";
    document.getElementById('printBtn').disabled = false;
}

function ReportByDates() {

    if (document.getElementById("dateFrom").value != "" && document.getElementById("dateTo").value != "") {
        document.getElementById("new_loader").style.display = "block";
        var reportByDateReq = $.post(baseUrl + "/apis/feesReport.php", {
            type: "byDay",
            uid: me_data.uid,
            dateFrom: document.getElementById("dateFrom").value,
            dateTo: document.getElementById("dateTo").value,
        });

        reportByDateReq.done(function(reportRes) {
            try {
                var report = JSON.parse(reportRes);
                buildFeeReport(report, "ByDate");
            } catch (e) {
                showNotification("Error", "Failed to get data", "danger");
            }
            document.getElementById("new_loader").style.display = "none";
        });

        reportByDateReq.fail(function(jqXHR, textStatus) {
            document.getElementById("new_loader").style.display = "none";
            handleNetworkIssues(textStatus)
        });
    }
}

function getMonthWiseReport() {
    document.getElementById("new_loader").style.display = "block";
    var monthWiseReportReq = $.post(baseUrl + "/apis/feesReport.php", {
        type: "byMonth",
        uid: me_data.uid,
        sessionName: FeeSessionSelect
    });

    monthWiseReportReq.done(function(reportRes) {

        try {
            buildFeeReport(JSON.parse(reportRes), "ByMonth");
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    monthWiseReportReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function reportBySchool() {
    document.getElementById("new_loader").style.display = "block";
    var monthWiseReportReq = $.post(baseUrl + "/apis/feesReport.php", {
        type: "bySchool",
        uid: me_data.uid,
        sessionName: FeeSessionSelect
    });
    monthWiseReportReq.done(function(reportRes) {
        console.log(reportRes)
        try {
            buildFeeReport(JSON.parse(reportRes), "BySchool");
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    monthWiseReportReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function UpdateFilter() {
    if (FeeRepostType == "byDate") {
        ReportByDates();
    } else if (FeeRepostType == "classSummeryReport") {
        if (document.getElementById("filterClass").value != "" && document.getElementById("filterClass").value != null && document.getElementById("filterSection").value != "" && document.getElementById("filterSection").value != null) {
            document.getElementById("errorMessage").style.display = "none";
            classSummeryReport();
        }

    } else {

    }
}

function showFilters() {
    $.when(loadClassForSelectId("filterClass", "filterSection")).then(function() {
        $("#filterModal").modal({ backdrop: 'static', keyboard: false });
    });
}

function clearFilter() {
    document.getElementById("filterClass").value = "";
    document.getElementById("filterSection").value = "";
}

function printReport() {
    document.body.innerHTML = document.getElementById("jsGrid").innerHTML;
    window.print();
    document.location.reload();
};let searchBarViewReceipt;
let feeHeads;
let ReceiptForStudentId;
let ReceiptClassId;

function generateReceipt() {
    setActiveColorsfees("generateReceipt");
    searchNEdit(true);
}

function getFeesDetails(studentId, classId) {
    ReceiptForStudentId = studentId;
    ReceiptClassId = classId;
    let feesDetailHTML = ` <div class="container backgroundDefiner" style="background:var(--btnColor3); border-radius: 15px; padding: 1%; margin-bottom: 2%">
    <div class="row">
      <div class="col-md-5" style="text-align: start">
       <h5 style="margin-bottom: 10px">Total Fees</h5> 
      </div>
      <div class="col-md-2" style="text-align: center" onclick="showReceiptList()">
       <h6 style="margin-bottom: 10px;" class="myLink">Show Receipt List</h6> 
      </div>
      <div class="col-md-5" style="text-align: end">
          <h5 style="margin-bottom: 10px">Fees Paid</h5> 
      </div>
    </div>
    <div class="row">
      <div class="col-md-6" style="text-align: start">
        <strong>
          <h4 style="margin-bottom: 5px" id="totalFeesValue">

          </h4>
           
        </strong>
       
      </div>
      <div class="col-md-6" style="text-align: end">
          <h4 style="margin-bottom: 5px" id="feesPaidValue" >
               
          </h4>
      </div>
    </div>

    <div class="row">
        <div class="col-rmd-2"></div>
        <div class="col-rmd-8">
            <div class="container" id="receiptHolder">

            </div>
        </div>
    </div>

    <div class="row" style="margin-top:2%;">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="fa fa-plus button button6" style="border:1px solid; border-radius:50%; padding:20%" onclick="newReceiptView()"></i>
    </div>
   
    </div>

</div>`;
    document.getElementById("new_loader").style.display = "block";
    document.getElementById("feeInfoHolder").innerHTML = feesDetailHTML;
    $.when(setAmountPaid(studentId), setTotalFees(studentId)).then(function() {
        document.getElementById("new_loader").style.display = "none";
    });

}

function setAmountPaid(studentId) {
    var AmountRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "getMyPaidAmount",
        uid: me_data.uid,
        studentId: studentId,
        sessionName: sessionSelect
    });

    AmountRequest.done(function(amount) {
        if (amount != "E500") {
            document.getElementById('feesPaidValue').innerText = amount + " ₹";
        }

    });

    AmountRequest.fail(function(jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}

function setTotalFees(studentId) {
    var AmountRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "getTotalFees",
        uid: me_data.uid,
        studentId: studentId,
        sessionName: sessionSelect
    });

    AmountRequest.done(function(amount) {
        if (amount != null) {
            document.getElementById('totalFeesValue').innerText = amount + " ₹";
        }
    });

    AmountRequest.fail(function(jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}

function newReceiptView() {
    document.getElementById("new_loader").style.display = "block";
    var getHeadsReq = $.post(baseUrl + "/apis/feesHeads.php", {
        type: "getActiveFeesHeads",
        uid: me_data.uid,
        classId: ReceiptClassId,
        sessionName: sessionSelect,
        studentId: ReceiptForStudentId
    });

    getHeadsReq.done(function(HeadList) {
        document.getElementById('headHolder').innerHTML = '';
        document.getElementById('totalFees').value = 0;
        var today = new Date();

        document.getElementById("receiptDate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

        try {
            feeHeads = JSON.parse(HeadList);
            for (var itr in feeHeads) {
                FeeHeadHTML = `<div class="row" style="margin-top: 2%">
                <div class="col-md-6">
                  <label id = "headName` + itr + `"></label>
                </div>
                <div class="col-md-1" style="display:none">
                  <label id = "headId` + itr + `"></label>
                </div>
                <div class="col-md-6">
                  <input class="form-control" type="number" id="headValue` + itr + `" onchange="setSum(this.value)" value="0">
                </div>
              </div>`;

                document.getElementById('headHolder').innerHTML += FeeHeadHTML;

                document.getElementById('headName' + itr).innerText = feeHeads[itr].headName + " (" + feeHeads[itr]["0"] + " / " + feeHeads[itr]["amount_" + ReceiptClassId] + ")";

                document.getElementById('headId' + itr).innerText = feeHeads[itr].headId;
            }
            $('#newReceiptModal').modal();

        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    getHeadsReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });

}


$('#newReceiptForm').submit(function(event) {
    event.preventDefault();
    $('#newReceiptModal').modal('toggle');
    let shouldSendReq = false;
    let superBreaksOFF = true;


    feesHeadVal = [];
    for (var itr in feeHeads) {
        if (document.getElementById('headValue' + itr).value != 0) {
            if (document.getElementById('headValue' + itr).value == "" || document.getElementById('headValue' + itr).value == null) {
                superBreaksOFF = false;
                break;
            }
            shouldSendReq = true;
        }
        feesHeadVal[itr] = document.getElementById('headValue' + itr).value;
    }
    console.log(shouldSendReq);
    console.log(superBreaksOFF);
    if (shouldSendReq && superBreaksOFF) {
        document.getElementById("new_loader").style.display = "block";
        var newReceiptRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
            type: "newReceipt",
            uid: me_data.uid,
            userId: me_data.uid,
            studentId: ReceiptForStudentId,
            sessionName: sessionSelect,
            headValues: feesHeadVal,
            classId: ReceiptClassId,
            receiptDate: document.getElementById('receiptDate').value,
            receiptRemark: document.getElementById('receiptRemark').value
        });

        newReceiptRequest.done(function(newReceiptRes) {
            console.log(newReceiptRes);
            try {
                var resjson = JSON.parse(newReceiptRes);
                if (resjson.resCode == 200) {
                    getFeesDetails(ReceiptForStudentId);
                    viewReceipt(resjson.id, ReceiptForStudentId, sessionSelect);
                } else {
                    showNotification("<strong>Error</strong>", "Failed to generate receipt", "danger");
                    console.log(newReceiptRes);
                }
            } catch (e) {
                showNotification("Error", "Failed to get data", "danger");
            }
            document.getElementById("new_loader").style.display = "none";
        });

        newReceiptRequest.fail(function(jqXHR, textStatus) {
            document.getElementById("new_loader").style.display = "none";
            //handleNetworkIssues(textStatus)
        });
    } else {
        showNotification("<strong>Error</strong>", "Invalid Amount - Receipt not created", "danger");
    }
});

function setSum(value) {
    document.getElementById('totalFees').value = parseInt(value, 10) + parseInt(document.getElementById('totalFees').value, 10);
}

function viewReceipt(receiptId) {
    document.location = baseUrl + "/receipt?receiptId=" + receiptId;
}


function showReceiptList() {
    document.getElementById("receiptHolder").innerHTML = '';
    document.getElementById("new_loader").style.display = "block";
    let getReceiptListReq = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "receiptListBySessionAndStudentId",
        uid: me_data.uid,
        studentId: ReceiptForStudentId,
        sessionName: sessionSelect
    });
    getReceiptListReq.done(function(receiptListData) {
        try {
            let receiptListJSON = JSON.parse(receiptListData);
            for (itr in receiptListJSON) {
                let receiptListHTML = `<div class="row button button4" style="margin:1%" onclick="viewReceiptFromList(this)">
                <div class="col-rmd-6" id="receiptIdforList` + itr + `">
                </div>
                <div class="col-rmd-6" id="amountforList` + itr + `">
                </div>          
                </div>`;

                document.getElementById("receiptHolder").innerHTML += receiptListHTML;
                document.getElementById("receiptIdforList" + itr).innerText = "Receipt Id : " + receiptListJSON[itr].receiptId;
                document.getElementById("amountforList" + itr).innerText = "Amount : " + receiptListJSON[itr].recamt + " ₹";
            }

        } catch (e) {
            console.log(e)
            showNotification("<strong>Error</strong>", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    getReceiptListReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function viewReceiptFromList(div) {
    console.log(":", (div.childNodes[1].innerText).split(": "));
    viewReceipt(div.childNodes[1].innerText.split(": ")[1]);
};function registerStudent(){
    currentStudentOption = "registerStudent";
    setActiveColorsStudent("registerStudent");

    registerHTML = `<div class="container" id="registerStudent">
                            <div class="text-center">
                                <h4>Register Student</h4>
                                <hr>
                            </div>
                            <div style="display: none;" id="studID"></div>
                            <div id="step_container">
                                    
                            </div>
                    </div>`;

    document.getElementById('studentActionHolder').innerHTML = registerHTML;
   stepOne();
}



//Extras

function makeAddressSame(){
    document.getElementById("permanentAddress").value = document.getElementById("localAddress").value;
    document.getElementById("permanentState").value = document.getElementById("localState").value;
    document.getElementById("permanentCity").value = document.getElementById("localCity").value;
    document.getElementById("permanentPincode").value = document.getElementById("localPincode").value;
}

function getCheckBoxValue(Boxid){
    var temp;
    var isChecked = document.getElementById(Boxid).checked;
    if(isChecked){
        temp = 1;
    }
    else{
        temp = 0;
    }
    return temp;
}

function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
          $('#studentImg').attr('src', e.target.result);
           imgBase = e.target.result.split(",")[1];
      };
      reader.readAsDataURL(input.files[0]);
      
  }
}
;stepOneHTML = `<div class="row">
    <div class="col-md-2">
     <h5> Student Detail</h5>
    </div>
    <div class="col-md-10">
      <form id="studentDetails">
        <div class="row">
          <div class="col-md-4">
            <input id="formNumber" class="form-control" type="text" placeholder="Form Number">
          </div>
          <div class="col-md-4">
            <input id="admissionNumber" class="form-control" type="text" placeholder="Admission Number" required>
          </div>
          <div class="col-md-4">
            <input id="govermentId" class="form-control" type="text" placeholder="Goverment Id">
          </div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-4">
            <input id="firstName" class="form-control" type="text" placeholder="First Name" required>
          </div>
          <div class="col-md-4">
            <input id="middleName" class="form-control" type="text" placeholder="Middle Name" required>
          </div>
          <div class="col-md-4">
            <input id="lastName" class="form-control" type="text" placeholder="Last Name" required>
          </div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-4">
            <input id="motherName" class="form-control" type="text" placeholder="Mother Name" required>
          </div>
          <div class="col-md-4">
            <input id="fatherName" class="form-control" type="text" placeholder="Father Name" required>
          </div>
          <div class="col-md-4">
            <input id="aadharNumber" maxlength="12" class="form-control" type="text" placeholder="Aadhar Number">
          </div>
        </div>

        <div class="row" style="margin-top:2%">

          <div class="col-md-4">
              <select class="form-control" id="gender">
              <option disabled value="" selected>Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
              </select>
          </div>

          <div class="col-md-1">
            <label for="stud_DOB">
              DOB
            </label>
          </div>
          <div class="col-md-3">
            <input id="stud_DOB" type="date" class="form-control">
          </div>
          
          <div class="col-md-3">
          <label for="rte" class="checklabel">Under RTE?
            <input type="checkbox" id="rte">
            <span class="checkmark"></span>
          </label>
          </div>        
        </div>

        <div class="row"style="margin-top:2%">
            <div class="col-md-2">
              <label for="placeOfBirth">Place of birth</label>
            </div>  
            <div class="col-md-10"><hr></div>
        </div>

          <div class="row" style="margin-top:2%">      
          <div class="col-md-4">
            <input id="pob_city" type="text" class="form-control"  placeholder="(City)">
          </div>

          <div class="col-md-4">
            <input id="pob_dist" type="text" class="form-control"  placeholder="(District)">
          </div>

          <div class="col-md-4">
          <select id="pob_state" class="form-control">
            <option disabled value="" selected>(State)</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
            <option value="Daman and Diu">Daman and Diu</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Orissa">Orissa</option>
            <option value="Pondicherry">Pondicherry</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttaranchal">Uttaranchal</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>

        </div>

        <div class="row" style="margin-top:2%">
            <div class="col-md-10"><hr></div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-4">
            <select id="religion" class="form-control" type="text" placeholder="Religion" required>
                <option value="" selected="selected" disabled="disabled">Select Religion</option>
                <option value="Atheist">Atheist</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Christian">Christian</option>
                <option value="Hindu">Hindu</option>
                <option value="Islam">Islam</option>
                <option value="Muslim">Muslim</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Other">Other</option>
            </select>
          </div>

        <div class="col-md-4">
          <input class = "form-control" id="caste" type="text" placeholder="Caste">
         </div>

          <div class="col-md-4">
            <select id="category" class="form-control" type="text" placeholder="Select Category" required>
              <option value="" selected disabled>Select Category / Race</option>
              <option value="OPEN">OPEN</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="SBC">SBC</option>
              <option value="VJ">VJ</option>
              <option value="NT-A">NT-A</option>
              <option value="NT-B">NT-B</option>
              <option value="NT-C">NT-C</option>
              <option value="NT-D">NT-D</option>
            </select>
          </div>
          
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-6">
            <input id="nationality" class="form-control" type="text" placeholder="Nationality" value="Indian" required>
          </div>
          <div class="col-md-6">
            <input id="motherTounge" class="form-control" type="text" placeholder="Mother Tounge" required>
          </div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-6">
            <input id="lastSchool" class="form-control" type="text" placeholder="Last School">
          </div>
          <div class="col-md-6">
            <input id="lastClass" class="form-control" type="text" placeholder="Last Class">
          </div>
        </div>

        <div class="row" style="margin-top:3%">
          <div class="col-md-3">
            <label for="stud_DOA">
              Date of admission
            </label>
          </div>
          <div class="col-md-4">
            <input id="stud_DOA" class="form-control" type="date" required>
          </div>
          <div class="col-md-5">
            <label for="submittedTC" class="checklabel">Submited TC / Birth Certificate
              <input type="checkbox" id="submittedTC">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>

        <div class="row" style="margin-top: 2%">
          <div class="col-md-10"></div>
          <div class="col-md-2">
            <button class="btn btn-primary" style="`+CSSbtnPrimary+`" type="submit" id="step_one_next" disabled>Next</button>
          </div>
        </div>
      </form>
    </div>
  </div>`;


//stepOne START
function stepOne() {
  document.getElementById('step_container').innerHTML = stepOneHTML;
  //Read from db
  if (document.getElementById('studID').innerText != "") {
    setStudentDetails();
  }
  else {
    $('#step_one_next').removeAttr('disabled');
  }


  $("#studentDetails").submit(function (event) {
    event.preventDefault();
    if (document.getElementById('studID').innerText == "") {
      CreateNewStudent();
    }
    else {
      updateStudentDetails();
    }
  });
}

function setStudentDetails() {
  document.getElementById("new_loader").style.display = "block";
  var setStudentDetailsReq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "getStudentDetailsById",
    uid: me_data.uid,
    studentId: document.getElementById('studID').innerText
  });

  setStudentDetailsReq.done(function (setStudentDetailsRes) {
    try {
      console.log(setStudentDetails);
      studentDetail = JSON.parse(setStudentDetailsRes);
      document.getElementById('formNumber').value = studentDetail.formNumber;
      document.getElementById('admissionNumber').value = studentDetail.admissionNumber;
      document.getElementById('govermentId').value = studentDetail.govermentId;
      document.getElementById('firstName').value = studentDetail.firstName;
      document.getElementById('middleName').value = studentDetail.middleName;
      document.getElementById('lastName').value = studentDetail.lastName;
      document.getElementById('motherName').value = studentDetail.motherName;
      document.getElementById('fatherName').value = studentDetail.fatherName;
      document.getElementById('gender').value = studentDetail.gender;
      document.getElementById('aadharNumber').value = studentDetail.aadharNumber;
      document.getElementById('stud_DOB').value = studentDetail.dob;
      document.getElementById('pob_city').value = studentDetail.pob_city;
      document.getElementById('pob_dist').value = studentDetail.pob_dist;
      document.getElementById('pob_state').value = studentDetail.pob_state;
      document.getElementById('religion').value = studentDetail.religion;
      document.getElementById('category').value = studentDetail.category;
      document.getElementById('caste').value = studentDetail.caste;
      document.getElementById('nationality').value = studentDetail.nationality;
      document.getElementById('motherTounge').value = studentDetail.motherTounge;
      document.getElementById('lastSchool').value = studentDetail.lastSchool;
      document.getElementById('lastClass').value = studentDetail.lastClass;
      document.getElementById('stud_DOA').value = studentDetail.doa;

      if (studentDetail.submittedTC == 1) {
        document.getElementById("submittedTC").checked = true;
      }
      else {
        document.getElementById("submittedTC").checked = false;
      }

      if (studentDetail.rte == 1) {
        document.getElementById("rte").checked = true;
      }
      else {
        document.getElementById("rte").checked = false;
      }
      $('#step_one_next').removeAttr('disabled');
      document.getElementById('loader').style.display = "none";
    }
    catch (e) {
      showNotification("Error", "Failed to get data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  setStudentDetailsReq.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function CreateNewStudent() {
  var submittedTC = getCheckBoxValue("submittedTC");
  var rte = getCheckBoxValue("rte");
  document.getElementById("new_loader").style.display = "block";
  var newStudentDetailReq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "newStudentDetails",
    uid: me_data.uid,
    formNumber: document.getElementById('formNumber').value,
    admissionNumber: document.getElementById('admissionNumber').value,
    govermentId: document.getElementById('govermentId').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    lastName: document.getElementById('lastName').value,
    motherName: document.getElementById('motherName').value,
    fatherName: document.getElementById('fatherName').value,
    gender: document.getElementById('gender').value,
    aadharNumber: document.getElementById('aadharNumber').value,
    dob: document.getElementById('stud_DOB').value,
    pob_city: document.getElementById('pob_city').value,
    pob_dist: document.getElementById('pob_dist').value,
    pob_state: document.getElementById('pob_state').value,
    religion: document.getElementById('religion').value,
    category: document.getElementById('category').value,
    caste: document.getElementById('caste').value,
    nationality: document.getElementById('nationality').value,
    motherTounge: document.getElementById('motherTounge').value,
    lastSchool: document.getElementById('lastSchool').value,
    lastClass: document.getElementById('lastClass').value,
    doa: document.getElementById('stud_DOA').value,
    submittedTC: submittedTC,
    sessionName: currentSession,
    rte: rte,
  });

  newStudentDetailReq.done(function (newStudentDetailRes) {
    console.log(newStudentDetailRes)
    try {
      var responce = JSON.parse(newStudentDetailRes);

      if (responce.resCode == 200) {
        document.getElementById('studID').innerText = responce.id;
        stepTwo();
      }
      else {
        showNotification("<strong>Error</strong>", "Failed to save data", "danger");
      }
    }
    catch (e) {
      showNotification("Error", "Failed to get data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  newStudentDetailReq.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function updateStudentDetails() {
  var submittedTC = getCheckBoxValue("submittedTC");
  var rte = getCheckBoxValue("rte");
  document.getElementById("new_loader").style.display = "block";
  var newStudentDetailReq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "updateStudentId",
    uid: me_data.uid,
    studentId: document.getElementById('studID').innerText,
    formNumber: document.getElementById('formNumber').value,
    admissionNumber: document.getElementById('admissionNumber').value,
    govermentId: document.getElementById('govermentId').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    lastName: document.getElementById('lastName').value,
    motherName: document.getElementById('motherName').value,
    fatherName: document.getElementById('fatherName').value,
    gender: document.getElementById('gender').value,
    aadharNumber: document.getElementById('aadharNumber').value,
    dob: document.getElementById('stud_DOB').value,
    pob_city: document.getElementById('pob_city').value,
    pob_dist: document.getElementById('pob_dist').value,
    pob_state: document.getElementById('pob_state').value,
    religion: document.getElementById('religion').value,
    category: document.getElementById('category').value,
    caste: document.getElementById('caste').value,
    nationality: document.getElementById('nationality').value,
    motherTounge: document.getElementById('motherTounge').value,
    lastSchool: document.getElementById('lastSchool').value,
    lastClass: document.getElementById('lastClass').value,
    doa: document.getElementById('stud_DOA').value,
    submittedTC: submittedTC,
    rte: rte,
  });

  newStudentDetailReq.done(function (newStudentDetailRes) {
    if (newStudentDetailRes == 200) {
      stepTwo(false);
    }
    else {
      console.log(newStudentDetailRes)
      showNotification("<strong>Error</strong>", "Failed to save data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  newStudentDetailReq.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}
//StepOne End
;
let imgBase;
//StepThree Start
function stepThree() {
  stepThreeHTML = ` <div class="row">
<div class="col-md-2">
  Session Detail
</div>
<div class="col-md-10">
  <form id="sessionDetails">
      <div class="row" style="margin-top:3%">
        <div class="col-md-2">
            <div style="display:none" id="detId"></div>
            <img id="studentImg" style="border-radius: 50%; height: 100px; width: 100px"> 
        </div>
        
      </div>
      <div class="row" style="margin-top:3%">
          <div class="col-md-3">
              <input type="file" accept="image/*" id="img_picker">
          </div>
      </div>
    <div class="row" style="margin-top:3%">
      <div class="col-md-6">
        <select id="sessionClass" class="form-control" type="text" placeholder="Next Class" required>
            <option selected disabled value="">Select Class</option>
        </select>
      </div>
      <div class="col-md-6">
        <select id="sessionSection" class="form-control" type="text" placeholder="Section" required>
        <option selected disabled value="">Select Section</option>
        </select>
      </div>
    </div>

    <div class="row" style="margin-top:3%">
      <div class="col-md-6">
        <input id="sessionMedium" class="form-control" type="text" placeholder="Study Medium" required>
      </div>
    </div>
    <div class="row" style="margin-top:3%">
        <div class="col-md-6">
          <input id="sessionTotalFees" class="form-control" type="text" placeholder="Total Session Fees" required>
        </div>
    </div>

    <div class="row" style="margin-top: 2%">
      <div class="col-md-8">
        <h7 style="text-emphasis-color: #86A3F0">All details in the form are checked & verified.</h7>
      </div>
    </div>
    <div class="row" style="margin-top: 2%">
        <div class="col-md-2">
        <button class="btn btn-secondary" style="`+CSSbtnSecondary+`" type="button" onclick="sessionDetailBack()" disabled id="step_three_back">Back</button>
        </div>
      <div class="col-md-4">
        <button type="submit" class="btn btn-primary" style="`+CSSbtnPrimary+`" disabled id="step_three_save">Save</button>
      </div>

    </div>
  </form>
</div>
</div>`;
  document.getElementById('step_container').innerHTML = stepThreeHTML;

  $.when(loadClassForSelectId("sessionClass", "sessionSection")).then(function () {
    setSessionEntry();
  });

  $("#sessionDetails").submit(function (event) {
    event.preventDefault();
    updateSessionEntry(false);
  });
}

function setSessionEntry() {

  $("#img_picker").change(function () {
    readURL(this);
  });
  document.getElementById("new_loader").style.display = "block";
  var setSessionEntryReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "getByStudentId",
    uid: me_data.uid,
    sessionName: currentSession,
    studentId: document.getElementById("studID").innerText
  });
  setSessionEntryReq.done(function (setSessionEntryRes) {
    if (setSessionEntryRes != "null") {
      try {
        var responce = JSON.parse(setSessionEntryRes);
        document.getElementById("detId").innerText = responce.id;
        document.getElementById("studID").innerText = responce.studentId; document.getElementById("sessionClass").value = responce.class;
        $("#sessionClass").trigger("change"); sectionNameRequest.done(function () {
          if (document.getElementById("sessionSection") != null) {
            console.log("doing")
            document.getElementById("sessionSection").value = responce.section;
            document.getElementById('loader').style.display = "none";
          }
        });
        document.getElementById("sessionMedium").value = responce.medium;
        document.getElementById("sessionTotalFees").value = responce.totalFees;
        if (responce.photo != "") {
          document.getElementById("studentImg").src = "data:image/png;base64, " + responce.photo;
        }
        else {
          document.getElementById("studentImg").src = baseUrl + "/img/me.png";
        }
        imgBase = responce.photo;
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }
      document.getElementById("new_loader").style.display = "none";
    }
    $("#step_three_back").removeAttr('disabled');
    $("#step_three_save").removeAttr('disabled');

  });

  setSessionEntryReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function updateSessionEntry(toReturn) {
  let imgBaseEncode;
  if (imgBase == null) {
    imgBaseEncode = "";
  }
  else {
    imgBaseEncode = imgBase;
  }
  document.getElementById("new_loader").style.display = "block";
  var newSessionEntryReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "updateSessionDetailsById",
    uid: me_data.uid,
    id: document.getElementById("detId").innerText,
    class: document.getElementById("sessionClass").value,
    section: document.getElementById("sessionSection").value,
    medium: document.getElementById("sessionMedium").value,
    totalFees: document.getElementById("sessionTotalFees").value,
    photo: imgBaseEncode
  });
  newSessionEntryReq.done(function (newSessionEntryRes) {
    if (newSessionEntryRes == 200) {
      if (!toReturn) {
        showNotification("<strong>Success</strong>", "Data Saved Successfully", "success");
        if (document.location.href.includes("home")) {
          studentOptionsView();
        }

      }
    }
    else {
      showNotification("<strong>Error</strong>", "Failed to save data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  newSessionEntryReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function sessionDetailBack() {
  updateSessionEntry(true);
  stepTwo();

}
//StepThree End

;
stepTwoHTML = `<div class="row">
  <div class="col-md-2">
    Contact Detail
  </div>
  <div class="col-md-10">
    <form id="contactDetails">
      <div class="row">
        <div class="col-md-5">
          <label for="localAddress">Local Address</label>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <textarea id="localAddress" class="form-control" rows="2" placeholder="Address" required></textarea>
        </div>
        <div class="col-md-4">
          <select id="localState" class="form-control" required>
            <option disabled value="" selected>Select State:</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
            <option value="Daman and Diu">Daman and Diu</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Orissa">Orissa</option>
            <option value="Pondicherry">Pondicherry</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttaranchal">Uttaranchal</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>
      </div>

      <div class="row" style="margin-top: 2%">
        <div class="col-md-6">
          <input id="localCity" class="form-control" placeholder="City" type="text" required>
        </div>
        <div class="col-md-6">
          <input id="localPincode" class="form-control" placeholder="Pincode" type="number" required>
        </div>
      </div>

      <div class="row" style="margin-top: 3%">
        <div class="col-md-4">
          <label for="same_address" class="checklabel">Both address are same
            <input id="same_address" type="checkbox" onchange="makeAddressSame()">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="col-md-8">
          <hr>
        </div>
      </div>



      <div class="row" style="margin-top: 3%">
        <div class="col-md-5">
          <label for="permanentAddress">Permenat Address</label>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <textarea id="permanentAddress" class="form-control" rows="2" placeholder="Address" required></textarea>
        </div>
        <div class="col-md-4">
          <select id="permanentState" class="form-control" required>
            <option disabled value="" selected>Select State:</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
            <option value="Daman and Diu">Daman and Diu</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Orissa">Orissa</option>
            <option value="Pondicherry">Pondicherry</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttaranchal">Uttaranchal</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>
      </div>

      <div class="row" style="margin-top: 2%">
        <div class="col-md-6">
          <input id="permanentCity" class="form-control" placeholder="City" type="text" required>
        </div>
        <div class="col-md-6">
          <input id="permanentPincode" class="form-control" placeholder="Pincode" type="number" required>
        </div>
      </div>

      <div class="row" style="margin-top: 3%">
        <div class="col-md-4">
          Local Guardian Details
        </div>
        <div class="col-md-8">
          <hr>
        </div>
      </div>

      <div class="row" style="margin-top: 2%">
          <div class="col-md-4">
            <input id="guardianName" type="text" placeholder="Guardian's Name" class="form-control">
          </div>
          <div class="col-md-4">
            <input id="guardianPhone" type="text" placeholder="Guardian's Phone" class="form-control" maxlength="10" pattern="[789][0-9]{9}">
          </div>
          <div class="col-md-4">
            <input id="guardianEmail" type="email" placeholder="Guardian's Email-id" class="form-control">
          </div>
        </div>

      <div class="row" style="margin-top: 2%">
        <div class="col-md-8"></div>
        <div class="col-md-2">
            <button class="btn btn-secondary" style="`+CSSbtnSecondary+`" type="button" onclick="contactDetailBack()" id="step_two_back" disabled>Back</button>
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn btn-primary" style="`+CSSbtnPrimary+`" disabled id="step_two_next">Next</button>
        </div>
      </div>

    </form>

  </div>
</div>`;



//StepTwo START
function stepTwo() {
  document.getElementById("new_loader").style.display = "block";
  loadContactDetails();
  document.getElementById('step_container').innerHTML = stepTwoHTML;
  $("#contactDetails").submit(function (event) {
    event.preventDefault();
    setContactDetails(true);
  });
}

function loadContactDetails() {
  var loadContactDetailReq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "getContactDetailsById",
    uid: me_data.uid,
    studentId: document.getElementById("studID").innerText
  });

  loadContactDetailReq.done(function (loadContactDetailRes) {
    if (loadContactDetailRes != "null") {
      try {
        let cotactDetails = JSON.parse(loadContactDetailRes);
        if (cotactDetails.localAddress != "") {
          document.getElementById('localAddress').value = cotactDetails.localAddress;
        }
        if (cotactDetails.localState != "") {
          document.getElementById('localState').value = cotactDetails.localState;
        }
        if (cotactDetails.localCity != "") {
          document.getElementById('localCity').value = cotactDetails.localCity;
        }
        if (cotactDetails.localPincode != "") {
          document.getElementById('localPincode').value = cotactDetails.localPincode;
        }
        if (cotactDetails.permanentAddress != "") {
          document.getElementById('permanentAddress').value = cotactDetails.permanentAddress;
        }
        if (cotactDetails.permanentState != "") {
          document.getElementById('permanentState').value = cotactDetails.permanentState;
        }
        if (cotactDetails.permanentCity != "") {
          document.getElementById('permanentCity').value = cotactDetails.permanentCity;
        }
        if (cotactDetails.permanentPincode != "") {
          document.getElementById('permanentPincode').value = cotactDetails.permanentPincode;
        }
        if (cotactDetails.guardianName) {
          document.getElementById('guardianName').value = cotactDetails.guardianName;
        }
        if (cotactDetails.guardianPhone) {
          document.getElementById('guardianPhone').value = cotactDetails.guardianPhone;
        }
        if (cotactDetails.guardianEmail) {
          document.getElementById('guardianEmail').value = cotactDetails.guardianEmail;
        }
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }
    }
    $("#step_two_back").removeAttr('disabled');
    $("#step_two_next").removeAttr('disabled');
    document.getElementById("new_loader").style.display = "none";
  });

  loadContactDetailReq.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
  //Comment
}

function setContactDetails(toReturn) {
  document.getElementById("new_loader").style.display = "none";
  var setContactDetailsreq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "updateContactDetails",
    uid: me_data.uid,
    localAddress: document.getElementById('localAddress').value,
    localState: document.getElementById('localState').value,
    localCity: document.getElementById('localCity').value,
    localPincode: document.getElementById('localPincode').value,
    permanentAddress: document.getElementById('permanentAddress').value,
    permanentState: document.getElementById('permanentState').value,
    permanentCity: document.getElementById('permanentCity').value,
    permanentPincode: document.getElementById('permanentPincode').value,
    guardianName: document.getElementById('guardianName').value,
    guardianPhone: document.getElementById('guardianPhone').value,
    guardianEmail: document.getElementById('guardianEmail').value,
    studentId: document.getElementById('studID').innerText
  });
  setContactDetailsreq.done(function (setContactDetailsres) {
    if (setContactDetailsres == 200) {
      if (toReturn) {
        stepThree();
      }
    }
    else {
      showNotification("<strong>Error</stong>", "Failed to save data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });
  setContactDetailsreq.fail(function(jqXHR, textStatus){
    document.getElementById("new_loader").style.display = "none";
  handleNetworkIssues(textStatus)
});
}

function contactDetailBack() {
  setContactDetails();
  stepOne();
}
//STEPTWO END;
var searchBy;
var maxRows = 5;
var sessionSelect;
var ErrorIsVisible;
var forReceipt;


let searchBarView;
searchNEditHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Search Student</h4>
      <hr>
    </div>
    <div class="row">
      <div class="col-md-4">
        <input class="form-control" type="text" placeholder="Search.." onkeyup="studentSearch(event)" id="searchBarView">
      </div>
      <div class="col-md-3">
        <select class="form-control" id="searchBy">
          <option selected disabled value="">Search By</option>
          <option value="name">Name</option>
          <option value="admissionNumber">Admission Number</option>
          <option value="aadharNumber">Aadhar Number</option>
          <option value="formNumber">Form Number</option>
          <option value="parentPhoneNumber">Parent Phone Number</option>
        </select>
      </div>
      <div class="col-md-2" style="text-align: end">
        <label for="maxRows">Max Rows</label>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="number" id="maxRows" value = "5">
      </div>
    </div>

    

    <div class="row" style="margin-top:1.5%; margin-bottom:1.5%">
      <div class="col-md-6">
        <hr>
      </div>
      <div class="col-md-3">
      </div>
      <div class="col-md-3">
        <select class="form-control" id="sessionSelect">
          <option selected disabled value="">Select Accedamic Year</option>

        </select>
      </div>
    </div>
    <div class="row" style="margin-top:1.5%;" >
      <div class="col-md-7">
      <div class="alertMine" id="errorMessage" style="display: none">
      </div>
      </div>
    </div>
    <div class="row" id="searchResultHolder">
    </div>
    <div class="row" id="feeInfoHolder">
    </div>
  </div>`;
function searchNEdit(forReceiptTemp) {
  forReceipt = forReceiptTemp;
  if (!forReceipt) {
    currentStudentOption = "searchNEdit";
    setActiveColorsStudent("searchNEdit");
    document.getElementById('studentActionHolder').innerHTML = searchNEditHTML;
  }
  else {
    document.getElementById('feesActionHolder').innerHTML = searchNEditHTML;
    document.getElementById('searchHeading').innerText = "Step 1 : Select Student";
  }
  searchBy = null;
  sessionSelect = null;
  searchBarView = document.getElementById('searchBarView');

  loadAllSessions();

  $(document).on('change', '#searchBy', function () {
    searchBy = document.getElementById('searchBy').value;
    studentSearch(searchBarView);
  });
  $(document).on('change', '#maxRows', function () {
    maxRows = document.getElementById('maxRows').value;
    console.log(maxRows);
    studentSearch(searchBarView);
  });
  $(document).on('change', '#sessionSelect', function () {
    sessionSelect = document.getElementById('sessionSelect').value;
    studentSearch(searchBarView);
  });
}

function loadAllSessions() {
  document.getElementById("new_loader").style.display = "block";
  var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
    type: "getAllSessions",
    uid: me_data.uid
  });

  allSessionReq.done(function (allSessions) {
    try {
      allSessions = JSON.parse(allSessions);
      for (var index in allSessions) {

        $('#sessionSelect')
          .append($('<option>', { value: allSessions[index].sessionName })
            .text(allSessions[index].sessionName
            ));
      }

      document.getElementById("sessionSelect").value = currentSession;
      sessionSelect = currentSession;
    }
    catch (e) {
      showNotification("Error", "Failed to get data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  allSessionReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}


function studentSearch(event) {
  clearTimeout($.data(this, 'timer'));
  if (event.keyCode == 13) {
    makeSearchRequest();
  }
  else {
    $(this).data('timer', setTimeout(makeSearchRequest, 500));
  }
}


function makeSearchRequest() {
  let searchQuery = $("#searchBarView").val();
  if (allFieldsAreSet(searchQuery)) {
    var searchByNameReq = $.post(baseUrl + "/apis/searchStudent.php", {
      type: searchBy,
      uid: me_data.uid,
      inputKeyWord: searchQuery,
      limit: maxRows,
      sessionName: sessionSelect
    });


    searchByNameReq.done(function (searchByNameRes) {
      console.log(searchByNameRes)
      try {
        var searchResult = JSON.parse(searchByNameRes);
        createResultView(searchResult, searchQuery);
      }
      catch (e) {
        console.log("LOL");
        showNotification("Error", "Failed to get data", "danger");
      }
    });

    searchByNameReq.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
  }
  else {
    removeResults();
  }
}



function allFieldsAreSet(searchQuery) {
  if ((searchBy != null && maxRows != null && sessionSelect != null)) {
    document.getElementById('errorMessage').style.display = "none";
    ErrorIsVisible = false;
    return true;
  }
  
  else {
    if (ErrorIsVisible == null || ErrorIsVisible == false) {
      document.getElementById('errorMessage').style.display = "block";
      document.getElementById('errorMessage').innerText = "Please select accedamic year and search methord";
      ErrorIsVisible = true;
    }
    return false;
  }
}


function createResultView(searchResult, searchStr) {
  removeResults();
  if (searchResult.length == 0 || searchStr == "") {
    resultView = `<div class="row collapsible">
                      <div class="text-center" style="background:var(--btnColor1)"><h4 style="background:var(--btnColor1)">No Result Found</h4>
                      </div>
                  </div>`;
    document.getElementById("searchResultHolder").innerHTML = resultView;
  }
  else {
    for (var itr in searchResult) {
      if (itr == maxRows) {
        break;
      }
      if (!forReceipt) {
        resultView = `<div class="row collapsible" onclick="viewStudent(this)">
        <div style="display: none;" id="studID`+ itr + `"></div>
        <div style="display: none;" id="studClassId`+ itr + `"></div>
           <div class="col-rmd-1" style="background:var(--btnColor1)">
             <img style="width: 50px; height: 50px; border-radius: 50%" id="studentImg`+ itr + `">
           </div>
           <div class="col-rmd-11" style="background:var(--btnColor1)">
             <div class="row" style="font-size: 18px">
               <div class="col-rmd-8" id="studentName`+ itr + `" style="background:var(--btnColor1)">
                 
               </div>
               <div class="col-rmd-4" style="background:var(--btnColor1); text-align: right; padding-right:1%" id="studentClassNSection`+ itr + `">
                
               </div>
             </div>
             <div class="row" style="background:var(--btnColor1)">
               <div class="col-rmd-8" style="background:var(--btnColor1)" id="admissionNumber`+ itr + `" >
               </div>
              
             </div>
           </div> 
        </div>
        <div class="row content" id="searchContent`+ itr + `">
           
        </div>`;
      }
      else {
        resultView = `<div class="row collapsible" onclick="selectedStudent(this)">
      <div style="display: none;" id="studID`+ itr + `"></div>
      <div style="display: none;" id="studClassId`+ itr + `"></div>
         <div class="col-rmd-1" style="background:var(--btnColor1)">
           <img style="width: 50px; height: 50px; border-radius: 50%" id="studentImg`+ itr + `">
         </div>
         <div class="col-rmd-11" style="background:var(--btnColor1)">
           <div class="row" style="font-size: 18px">
             <div class="col-rmd-8" id="studentName`+ itr + `" style="background:var(--btnColor1)">
               
             </div>
             <div class="col-rmd-4" style="background:var(--btnColor1);text-align: right; padding-right:1%" id="studentClassNSection`+ itr + `">
              
             </div>
           </div>
           <div class="row" style="background:var(--btnColor1)">
             <div class="col-rmd-8" style="background:var(--btnColor1)" id="admissionNumber`+ itr + `">
             </div>
            
           </div>
         </div> 
      </div>
      <div class="row content" id="searchContent`+ itr + `">
         
      </div>`;
      }

      document.getElementById("searchResultHolder").innerHTML += resultView;
      if (searchResult[itr].photo != null && searchResult[itr].photo != "") {
        document.getElementById('studentImg' + itr).src = "data:image/png;base64, " + searchResult[itr].photo;
      }
      else {
        document.getElementById('studentImg' + itr).src = baseUrl + "/img/me.png";
      }

      document.getElementById('studID' + itr).innerText = searchResult[itr].studentId;
      document.getElementById('studClassId' + itr).innerText = searchResult[itr].class;
      document.getElementById('studentName' + itr).innerHTML = searchResult[itr].firstName + " " + searchResult[itr].middleName + " " + searchResult[itr].lastName;
      document.getElementById('studentClassNSection' + itr).innerHTML = "Class " + searchResult[itr].class + " Section " + searchResult[itr].section;
      document.getElementById('admissionNumber' + itr).innerHTML = searchResult[itr].admissionNumber;
    }
  }
}


function removeResults() {
  document.getElementById("searchResultHolder").innerHTML = "";
  document.getElementById('feeInfoHolder').innerHTML = "";
}


function viewStudent(parent) {
  let id = parent.childNodes[1].innerText;
  var mode;
  if (document.getElementById("darkModeSwitch").innerText == "ON") {
    mode = "dark";
  }
  else{
    mode = "light";
  }
  document.location = baseUrl + "/studentView?studentId=" + id + "&sessionName=" + sessionSelect + "&mode=" + mode;
}

function selectedStudent(parent) {
  removeResults();
  //console.log(parent);
  document.getElementById("searchResultHolder").appendChild(parent);
  let classId = parent.childNodes[3].innerText;
  let id = parent.childNodes[1].innerText;
  document.getElementById('searchHeading').innerText = "Step 2 : Click + to genrerate new receipt";
  getFeesDetails(id, classId); // in generateReceipt Module
}







// EXtras
;var studList;

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
        console.log(response);
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
            console.log(response);
            showNotification("Error", "Failed to save attendence", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    saveAttendenceReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
};
function showAttendenceReport(){
    setActiveColorsStudentReport("showAttendenceReport");
};
function generateTC(){
    setActiveColorsStudentReport("generateTC");
};
function showSchoolReport(){
    setActiveColorsStudentReport("showSchoolReport");
    document.getElementById("new_loader").style.display = "block";
    document.getElementById("studentReportHolder").innerHTML = `
    <div class="row">
        <div class="col-md-12">
            <canvas id="myChart" height="350px" width="550px"></canvas>
        </div>
    </div>`;

    var ctx = document.getElementById('myChart').getContext('2d');

    let schoolStudentCountReq = $.post(baseUrl + "/apis/studentReports.php",{
        type: "getSchoolStudentCOunt",
        uid: me_data.uid
    });

    schoolStudentCountReq.done(function(responseReport) {
        //console.log(responseReport);
       
           var reportJSON = JSON.parse(responseReport);
           var schoolNames = new Array();
           var studentCounts = new Array();
           for(itr in reportJSON){
               console.log(reportJSON[itr].studentCount)
                schoolNames.push(reportJSON[itr].schoolName);
                studentCounts.push(reportJSON[itr].studentCount);
           }
           
           //console.log(studentCount);
           
           var myChart = new Chart(ctx, {
            type: 'bar',            
            data: {
                labels: schoolNames,
                datasets: [{   
                    label: "Student Count By School",                 
                    barPercentage: 0.5,
                    barThickness: 20,
                    maxBarThickness: 20,
                    minBarLength: 20,
                    data: studentCounts,
                }]
            }
        });
        document.getElementById("new_loader").style.display = "none";
    });

    schoolStudentCountReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
           
};function studentReport(){
    currentStudentOption = "studentReport";
    setActiveColorsStudent("studentReport");
    document.getElementById('studentActionHolder').innerHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Student Reports</h4>
      <hr>
    </div>
    
    <div class="row" style = "text-align: center; padding: 1%">
        <div class="col-rmd-3 button button1" style = "margin: auto; border-radius: 8px" onclick="showSchoolReport()" id="showSchoolReport">School Report</div>
        <div class="col-rmd-1"></div>
        <div class="col-rmd-3 button button2" style = "margin: auto; border-radius: 8px" onclick="showAttendenceReport()" id="showAttendenceReport">Attendence Report</div>
        <div class="col-rmd-1"></div>
        <div class="col-rmd-3 button button3" style = "margin: auto; border-radius: 8px" onclick="generateTC()" id="generateTC">Generate TC</div>
    </div>

    <hr>

    <div class="row" id="studentReportHolder">
    </div>

    </div>`;
}

function setActiveColorsStudentReport(toSet) {
  limit = ["showSchoolReport","showAttendenceReport","generateTC"];
  for (i = 0; i < limit.length; i++) {
      temp = limit[i];
      itr = document.getElementById(temp);
      if (temp == toSet) {
          itr.style.background = "var(--primaryColor)";
      } else {
          itr.style.background = "var(--btnColor"+i+")";
      }
  }
};

$(document).ready(function() { 
    document.getElementById("header_twitterLink").href = twitterLink;
    document.getElementById("header_facebookLink").href = facebookLink;
    document.getElementById("header_linkedinLink").href = linkedinLink;
    document.getElementById("header_instagramLink").href = instagramLink;
    document.getElementById("footer_twitterLink").href = twitterLink;
    document.getElementById("footer_facebookLink").href = facebookLink;
    document.getElementById("footer_instagramLink").href = instagramLink;
    document.getElementById("footer_linkedinLink").href = linkedinLink;
    
    document.getElementById("footer_tosLink").href = TOSLink;  
    document.getElementById("footer_ppLink").href = PPLink;

    document.getElementById('fotter_WebsiteTitle').innerText = websiteTitle;
    document.getElementById('fotter_WebsiteDesc').innerText = websiteDesc;
    document.getElementById('footer_address').innerHTML = address;


    document.getElementById('about_websiteTitle').innerText = websiteTitle;

});


$("#contactForm").submit(function(event) {         
    event.preventDefault();
    console.log("hel");
    var newMessageReq = $.post(baseUrl+"/apis/connectUs.php",{type:"newMessage",
    uid: me_data.uid,
                            name:document.getElementById("feedbackName").value,
                            email:document.getElementById("feedbackEmail").value,
                            subject:document.getElementById("feedbackSubject").value,
                            message:document.getElementById("feedbackMessgae").value
                        });

    newMessageReq.done(function(data){
        console.log(data);
        if(data=="200"){
            showNotification("<strong>Success</strong>","Message sent", "success");
            document.getElementById('contactForm').reset();
        }
        else{
            showNotification("<strong>Error</strong>","Failed to send message", "danger");
        }
    });

    newMessageReq.fail(function(jqXHR, textStatus){handleNetworkIssues(textStatus)});
});;
var firebaseConfig = {
  apiKey: "AIzaSyD-lUd0mKObtIex9YufmIUkKswmyj2o3Vo",
  authDomain: "vaicomp-fe7af.firebaseapp.com",
  databaseURL: "https://vaicomp-fe7af.firebaseio.com",
  projectId: "vaicomp-fe7af",
  storageBucket: "vaicomp-fe7af.appspot.com",
  messagingSenderId: "91500483285",
  appId: "1:91500483285:web:df2e54c15cc4aea8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
function Logout(){
  firebase.auth().signOut().then(function(){
    window.location = logOutUrl;
  });
}
;
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
let canNewAccadamicYear;
let currentStudentOption = '';
let optionColors;
let currentUprMenu = "top";

$(document).ready(function() {
    $("body").addClass("dark");
    $(".inner-switch").text("ON");
    $(".inner-switch").on("click", function() {
        if ($("body").hasClass("dark")) {
            $("body").removeClass("dark");
            $("body").addClass("light");
            $(".inner-switch").text("OFF");
        } else {
            $("body").addClass("dark");
            $("body").removeClass("light");
            $(".inner-switch").text("ON");
        }
    });

    //showNotification("<strong>Welcome</strong>", "to School "+ verName, "success");
    firebase.auth().onAuthStateChanged(function(usr) {
        if (usr) {
            user = usr;

            var getUserReq = $.post("../apis/User.php", { type: "getById", uid: user.uid });
            getUserReq.done(function(user_dat) {
                console.log(user_dat);
                me_data = JSON.parse(user_dat)[0];
                if (me_data != null) {
                    setMyImage(me_data.photo);
                    var myRoleListReq = $.post("../apis/userGroup.php", { type: "getRoleList", uid: me_data.uid });
                    myRoleListReq.done(function(myRoleListRes) {
                        console.log(myRoleListRes)
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



};
var sectionNameRequest;

(function ($) {
  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-scrolled')) {
            top_space = top_space - 40;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.main-nav, .mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();

    nav_sections.each(function () {
      var top = $(this).offset().top - main_nav_height,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
    });
  });

})(jQuery);


function handleNetworkIssues(textStatus){
  if(textStatus == "error"){
    showNotification("<strong>Error!</strong>","Network Issue", "warning");
  }
 console.log(textStatus);
}


function showNotification(titleMsg, messageBody, typeOfNotifs) {
  $.notify({
    title: titleMsg,
    message: messageBody
  },
    {
      type: typeOfNotifs,
      animate: {
        enter: 'animated bounceIn',
        exit: 'animated bounceOut'
      },
      allow_dismiss: true,
      placement: {
        from: 'top',
        align: 'right'
      },
      offset: {
        x: 50,
        y: 105
      }
    });
}


function loadClassForSelectId(idofSelect, idofSectionSelect) {

  if ($("#" + idofSelect).find('option').length < 2) {
    $('#' + idofSectionSelect)
    .find('option')
    .remove()
    .end()
    .append('<option value="" selected disabled>Select Section</option>')
    .val('')
    ;
    $("#" + idofSelect).change(function () {
      loadSectionForClassName(idofSelect, idofSectionSelect);
    });

    let classNameReq = $.post(baseUrl + "/apis/classList.php", {
      type: "getOnlyClassName",
      uid: me_data.uid
    });

    classNameReq.done(function (response) {
      try {
        let classNames = JSON.parse(response);
        $('#' + idofSelect)
          .find('option')
          .remove()
          .end()
          .append('<option value="" selected disabled>Select Class</option>')
          .val('')
          ;
        for (var index in classNames) {
          $('#' + idofSelect)
            .append($('<option>', { value: classNames[index].className })
              .text(classNames[index].className
              ));
        }
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }
    });

    classNameReq.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
  }

}

function loadSectionForClassName(idofSelect, idofSectionSelect) {
  sectionNameRequest = $.post(baseUrl + "/apis/classList.php", {
      type: "getSectionForClassName",
      uid: me_data.uid,
      className: document.getElementById(idofSelect).value
    });

    sectionNameRequest.done(function (response) {
      try {
        let sectionNames = JSON.parse(response);
        $('#' + idofSectionSelect)
          .find('option')
          .remove()
          .end()
          .append('<option value="" selected disabled>Select Section</option>')
          .val('')
          ;
        for (var index in sectionNames) {
          $('#' + idofSectionSelect)
            .append($('<option>', { value: sectionNames[index].section })
              .text(sectionNames[index].section
              ));
        }
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }

    });

    sectionNameRequest.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}