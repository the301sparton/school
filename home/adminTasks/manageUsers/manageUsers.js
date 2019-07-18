function manageUsers(){
    setActiveColorsAdminTasks("manageUsers");
   
    let manageUsersHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Users</h5>
          <hr>
    </div>`;
    document.getElementById('adminActionHolder').innerHTML = manageUsersHTML;
    getUserList();

}

function getUserList(){
    var getAllUsersReq = $.post(baseUrl + "/apis/User.php",{
        type: "getAllUsers"
    });

    getAllUsersReq.done(function(allUserStr){
        console.log(allUserStr);
    });
}