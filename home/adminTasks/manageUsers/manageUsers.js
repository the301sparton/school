function manageUsers() {
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


//TODO replace getUserList With searchUserForList