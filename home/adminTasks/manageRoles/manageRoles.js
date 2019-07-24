function manageRoles(){
    setActiveColorsAdminTasks("manageRoles");
    let userRoleHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage User Roles</h5>
          <hr>
    </div>
    
    <div class="row" id="manageRolesHolder">
    </div>
    
    </div>`;

    document.getElementById('adminActionHolder').innerHTML = userRoleHTML;
    getRoleList();
}

function getRoleList(){
    var userRoleReq = $.post(baseUrl + "/apis/userGroup.php",{
        type: "getAllRolesWithId"
    });

    userRoleReq.done(function(responce){
        console.log(responce);
    });
}