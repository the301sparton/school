function manageClassList(){
    setActiveColorsAdminTasks("manageClassList");
    let manageClassListHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Class List</h5>
          <hr>
    </div>
     
    <div class="container" id="manageHeadsHolder">
    </div>
    <div id="jsGrid" style = "display:none"></div>
    </div>`;
    document.getElementById('adminActionHolder').innerHTML = manageClassListHTML;
}