function manageFeesHeads(){
    setActiveColorsAdminTasks("manageFeesHeads");

    let manageFeesHeadsHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Fees Heads</h5>
          <hr>
    </div>
    
    <div class="container" id="manageHeadsHolder">
    </div>
    
    </div>`;

    document.getElementById('adminActionHolder').innerHTML = manageFeesHeadsHTML;
    makeViewForFeeHeads();
}

function makeViewForFeeHeads(){
    let getAllfeeData = $.post(baseUrl + "/apis/feesHeads.php",{
        type: "getAllHeads"
    });

    getAllfeeData.done(function(responce){
        let feeData = JSON.parse(responce);
        
    });
}