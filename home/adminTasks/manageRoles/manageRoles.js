function manageRoles() {
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
    <div class="col-md-1"> <i class="fa fa-plus button button5" style="border-radius:50%; padding:20%" onclick="createUserGroupView()"></i>
   
    </div>
    </div>
    
    </div>`;

    document.getElementById('adminActionHolder').innerHTML = userRoleHTML;
    getRoleList();
}

function getRoleList() {
    var userRoleReq = $.post(baseUrl + "/apis/userGroup.php", {
        type: "getAllRolesWithId"
    });

    userRoleReq.done(function (responce) {
        var RoleArray = JSON.parse(responce);
        if (RoleArray.length > 0) {
            makeRoleEditView(RoleArray);
        }
    });
}

function makeRoleEditView(roleArray) {
    document.getElementById("manageRolesHolder").innerHTML = "";
    for (var itr in roleArray) {
        var itemHtml = `<div class="container">
        <div class="row collapsible" style="padding:2%" id="item`+ itr + `" data-toggle="collapse" data-target="#data` + itr + `">
            <div class="col-md-6" style="text-align:left" id="groupName`+ itr + `"></div>
            <div class="col-md-6" style="text-align:right"><i class="fa fa-arrow-down" style="display:block"></i></div>
            </div>

            <div id="data`+ itr + `" class="collapse" style="background:#d4e6f1; padding:2%; border-radius: 15px; margin-left:2%; margin-right:2%">
                   <h6>Group Properties</h6>
                   <hr>
                   <div class="row" style="padding:2%">
                        <div class="col-md-3">
                        <label for="manageUsers`+ itr + `" class="checklabel">Manage Users
                            <input type="checkbox" id="manageUsers`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="manageRoles`+ itr + `" class="checklabel">Manage Role Groups
                            <input type="checkbox" id="manageRoles`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="manageFeesHeads`+ itr + `" class="checklabel">Manage Fees
                            <input type="checkbox" id="manageFeesHeads`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="newAccadamicYear`+ itr + `" class="checklabel">Start New Accadamic Year
                            <input type="checkbox" id="newAccadamicYear`+ itr + `">
                            <span class="checkmark"></span>
                         </label>
                        </div>
                   </div>

                   <div class="row" style="padding:2%">
                        <div class="col-md-4">
                        <label for="registerStudent`+ itr + `" class="checklabel">Register Student
                            <input type="checkbox" id="registerStudent`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-4">
                        <label for="searchNEdit`+ itr + `" class="checklabel">Search and edit student data
                            <input type="checkbox" id="searchNEdit`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-4">
                        <label for="deleteStudent`+ itr + `" class="checklabel">Delete all student data
                            <input type="checkbox" id="deleteStudent`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>
                   </div>

                   <div class="row" style="padding:2%">
                        <div class="col-md-3">
                        <label for="generateReceipt`+ itr + `" class="checklabel">Generate Receipt
                            <input type="checkbox" id="generateReceipt`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="feesReport`+ itr + `" class="checklabel">View Fees Reports
                            <input type="checkbox" id="feesReport`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="studentAttendence`+ itr + `" class="checklabel">Enter Student Attendence
                            <input type="checkbox" id="studentAttendence`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>

                        <div class="col-md-3">
                        <label for="studentReport`+ itr + `" class="checklabel">Student Report
                            <input type="checkbox" id="studentReport`+ itr + `">
                            <span class="checkmark"></span>
                        </label>
                        </div>
                   </div>

                   <div class="row" style="padding:1%">
                    <div class="col-md-12">
                          <button class="btn btn-primary" style="float:right" onclick="updateGroupDetails(this.parentNode.parentNode.parentNode)">Update</button>
                           <button class="btn btn-danger" style="float:right; margin-right:2%" onclick="deleteGroup(this.parentNode.parentNode.parentNode)">Delete Group</button> 
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
        if (roleArray[itr].deleteStudent == 1) {
            document.getElementById("deleteStudent" + itr).checked = true;
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
    let deleteStudent = view.childNodes[7].childNodes[5].childNodes[1].childNodes[1].checked;
    deleteStudent = isCheckedGeneric(deleteStudent);

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
    var updateGroupReq = $.post(baseUrl + "/apis/userGroup.php",{
        type:"updateUserGroup",

        userType: userType,

        manageUsers: manageUsers,
        manageRoles:manageRoles,
        manageFeesHeads:manageFeesHeads,
        newAccadamicYear:newAccadamicYear,

        registerStudent:registerStudent,
        searchNEdit:searchNEdit,
        deleteStudent:deleteStudent,

        generateReceipt:generateReceipt,
        feesReport:feesReport,
        studentAttendence:studentAttendence,
        studentReport:studentReport
    });

    updateGroupReq.done(function(responce){
        if(responce == 200){
            alert("User role updated..!");
            getRoleList();
        }
        else{
            console.log(responce)
            alert("Failed to update user role");
        }
    });
}

function deleteGroup(view) {
    let userType = view.parentNode.childNodes[1].childNodes[1].innerText;
    var deleteGroupReq = $.post(baseUrl + "/apis/userGroup.php",{
        type: "deleteUserGroup",
        userType: userType
    });
    deleteGroupReq.done(function(responce){
        if(responce == 200){
            alert("User group deleted..!");
            view.parentNode.parentNode.removeChild(view.parentNode);
        }
        else{
            alert("Failed to delete user group.. :(");
        }
    })
}

function isCheckedGeneric(isChecked){
    if(isChecked){
        temp = 1;
    }
    else{
        temp = 0;
    }
    return temp;
}

function createUserGroupView(){
    $("#createNewUserGroupModal").modal();
}

function createNewUserGroupForSure(){
    let newGroupName = document.getElementById("newUserGroupName").value;
    if(newGroupName == null || newGroupName == ""){
        document.getElementById("groupNotUniqueAlert").style.display = "block";
    }
    else{
        document.getElementById("groupNotUniqueAlert").style.display = "none";
    }
}