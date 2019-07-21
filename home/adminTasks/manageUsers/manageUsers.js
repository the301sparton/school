function manageUsers() {
  setActiveColorsAdminTasks("manageUsers");

  let manageUsersHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Users</h5>
          <hr>
    </div>
    
    <div class="row" id="allUserHolder">
    </div>

    <div class="container" id="userDetailsHolder">
    </div>
    `;
  document.getElementById('adminActionHolder').innerHTML = manageUsersHTML;
  getUserList();

}

function getUserList() {
  var getAllUsersReq = $.post(baseUrl + "/apis/User.php", {
    type: "getAllUsers"
  });

  getAllUsersReq.done(function (allUserStr) {
    let allUserArray = JSON.parse(allUserStr);
    document.getElementById('allUserHolder').innerHTML = '';
    for (itr in allUserArray) {
      userItemHtml = `<div class="row collapsible" onclick="getUserDetails(this)">
            
               <div class="col-rmd-1">
                 <img style="width: 50px; height: 50px; border-radius: 50%" id="userImg`+ itr + `">
               </div>
               <div class="col-rmd-11">
                 <div class="row" style="font-size: 18px">
                   <div class="col-rmd-8" id="displayName`+ itr + `">
                     
                   </div>
                   <div class="col-rmd-4" style="text-align: right; padding-right:1%" id="mobileNumber`+ itr + `"> 
                   </div>
                 </div>
                 <div class="row" style="margin-top:1%">
                   <div class="col-rmd-10" id="emailId`+ itr + `">
                   </div>
                   <div style="display: none;" id="userId`+ itr + `"></div>
                   <div class="col-md-2"><i class="fa fa-trash" style="float:right; cursor:pointer" onclick="deleteUser(this)"></i></div>

                  
                 </div>
               </div> 
            </div>`

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

  });
}

function deleteUser(deleteUserBtn) {
  event.stopPropagation();
  let uidForDelete = deleteUserBtn.parentNode.parentNode.childNodes[3].innerText;
  let confirmDelteUser = confirm("Are you sure about deleting user account..?");
  if (confirmDelteUser == true) {
    let userDeleteReq = $.post(baseUrl + "/apis/User.php", {
      type: "deleteUserByUid",
      uid: uidForDelete
    });

    userDeleteReq.done(function (responce) {
      if (responce == 200) {
        document.getElementById("allUserHolder").removeChild(deleteUserBtn.parentNode.parentNode.parentNode.parentNode)
      }
      else {
        alert("Failed to delete user :(");
      }
    });
  }

}

function getUserDetails(usersView) {

  removeOtherUserViews(usersView);  //remove other users from view
  let uidForThis = usersView.childNodes[3].childNodes[3].childNodes[3].innerText //get userId from view

  //get usertypes for selected user
  var myRolesListReq = $.post(baseUrl + "/apis/userGroup.php", {
    type: "getAllRolesForUser",
    uid: uidForThis
  });

  myRolesListReq.done(function (myRoleList) {
    let myRoleListArray = JSON.parse(myRoleList);
    document.getElementById('userDetailsHolder').innerHTML = `<div class="text-center">
        <h6>Edit User Groups</h6>
        <hr>
      </div>`;

    if (myRoleListArray.length > 0) {
      for (itr in myRoleListArray) {
        let roleItemHTML = `<div class="row collapsible" style="cursor:default">
          <div class="col" id="roleId`+ itr + `" style="display:none"></div>
          <div class="col-md-10" id="roleName`+ itr + `"></div>
          <div class="col-md-2"><i class="fa fa-trash" style="float:right; cursor:pointer" onclick="deleteRoleItem(this)"></i></div>
          </div>`
        document.getElementById('userDetailsHolder').innerHTML += roleItemHTML;
        document.getElementById('roleId' + itr).innerText = myRoleListArray[itr].id;
        document.getElementById('roleName' + itr).innerText = myRoleListArray[itr].userType;
      }

      document.getElementById('userDetailsHolder').innerHTML += `<div class="row" style="margin-top:2%; margin-bottom:2%">
      <div class="col-md-11"></div>
      <div class="col-md-1"> <i class="fa fa-plus button button5" style="border-radius:50%; padding:20%" onclick="addUserGroup(this)"></i>
      </div>
      </div>`
    }
  });
}

function addUserGroup(addBtnView){
  let uid = document.getElementById('allUserHolder').childNodes[0].childNodes[3].childNodes[3].childNodes[3].innerText;
  
  var getUserGroupsToAdd = $.post(baseUrl+ "/apis/userGroup.php",{
    type: "getUserGroupsToAdd",
    uid: uid
  });

  getUserGroupsToAdd.done(function(userGroupList){
    let userGroupListArray = JSON.parse(userGroupList);
    $("#addRoleModal").modal();
    document.getElementById("addRoleBody").innerHTML = ``;
    for(itr in userGroupListArray){
      document.getElementById("addRoleBody").innerHTML += `<div class="row">
      <label for="newRole`+itr+`" class="checklabel"><div id="newRoleText`+itr+`"></div>
              <input type="checkbox" id="newRole`+itr+`">
              <span class="checkmark"></span>
      </label>
      <div>`;
      document.getElementById("newRoleText"+itr).innerText = userGroupListArray[itr].userType;
    }
  });
}

function addNewRoleConfirm(){
  let uid = document.getElementById('allUserHolder').childNodes[0].childNodes[3].childNodes[3].childNodes[3].innerText;

}

function deleteRoleItem(roleItemView) {
  //TODO Delete User Role
  var confirmState = confirm("Are you sure about removing this usergroup..?");
  if (confirmState == true) {
    let roleId = roleItemView.parentNode.parentNode.childNodes[1].innerText;
    let deleteRoleReq = $.post(baseUrl + "/apis/userGroup.php", {
      type: "deleteUserGroupById",
      id: roleId
    });

    deleteRoleReq.done(function (responce) {
      if (responce == 200) {
        roleItemView.parentNode.parentNode.parentNode.removeChild(roleItemView.parentNode.parentNode);
      }
      else {
        alert("Failed to delete usergroup. :(");
      }
    })
  }
}

function removeOtherUserViews(usersView) {
  document.getElementById("allUserHolder").innerHTML = '';
  document.getElementById("allUserHolder").appendChild(usersView)
}