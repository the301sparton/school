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
            <div style="display: none;" id="userId`+ itr + `"></div>
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
                document.getElementById('userImg' + itr).src = baseUrl +"/img/me.png";
            }
            document.getElementById('displayName' + itr).innerText = allUserArray[itr].displayName;
            document.getElementById('mobileNumber' + itr).innerText = allUserArray[itr].mobileNumber;
            document.getElementById('emailId' + itr).innerText = allUserArray[itr].eid;
        }

    });
}

function deleteUser(deleteUserBtn){
  event.stopPropagation();
  //TODO Implement Delete user
}

function getUserDetails(usersView){

    removeOtherUserViews(usersView);  //remove other users from view
    let uidForThis = usersView.childNodes[1].innerText; //get userId from view
    
    //get usertypes for selected user
    var myRolesListReq = $.post(baseUrl+ "/apis/userGroup.php",{
      type: "getAllRolesForUser",
      uid: uidForThis
    });

    myRolesListReq.done(function(myRoleList){
      let myRoleListArray = JSON.parse(myRoleList);
      document.getElementById('userDetailsHolder').innerHTML = `<div class="text-center">
        <h6>Edit User Groups</h6>
        <hr>
      </div>`;

      if(myRoleListArray.length > 0){
        for(itr in myRoleListArray){
          let roleItemHTML = `<div class="row collapsible" style="cursor:default">
          <div class="col" id="roleId`+itr+`" style="display:none"></div>
          <div class="col-md-10" id="roleName`+itr+`"></div>
          <div class="col-md-2"><i class="fa fa-trash" style="float:right; cursor:pointer" onclick="deleteRoleItem(this)"></i></div>
          </div>`
          document.getElementById('userDetailsHolder').innerHTML += roleItemHTML;
          document.getElementById('roleId'+itr).innerText = myRoleListArray[itr].id;
          document.getElementById('roleName'+itr).innerText = myRoleListArray[itr].userType;
         
        }
      }
      
    });
}

function deleteRoleItem(roleItemView){
//TODO Delete User Role
}

function removeOtherUserViews(usersView){
   document.getElementById("allUserHolder").innerHTML = '';
   document.getElementById("allUserHolder").appendChild(usersView)
}