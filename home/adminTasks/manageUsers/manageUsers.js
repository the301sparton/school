function manageUsers() {
    setActiveColorsAdminTasks("manageUsers");

    let manageUsersHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Users</h5>
          <hr>
    </div>
    
    <div class="row" id="allUserHolder">
    </div>
    `;
    document.getElementById('adminActionHolder').innerHTML = manageUsersHTML;
    getUserList();

}
//run tavis
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
                 <div class="row">
                   <div class="col-rmd-8" id="emailId`+ itr + `">
                   </div>
                  
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

function getUserDetails(usersView){
    removeOtherUserViews(usersView);
}

function removeOtherUserViews(usersView){
   document.getElementById("allUserHolder").innerHTML = '';
   document.getElementById("allUserHolder").appendChild(usersView)
}