function manageUsers(){
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

function getUserList(){
    var getAllUsersReq = $.post(baseUrl + "/apis/User.php",{
        type: "getAllUsers"
    });

    getAllUsersReq.done(function(allUserStr){
        console.log(allUserStr);
        let allUserArray = JSON.parse(allUserStr);

        
    });
}