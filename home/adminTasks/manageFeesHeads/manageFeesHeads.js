function manageFeesHeads(){
    setActiveColorsAdminTasks("manageFeesHeads");

    let manageFeesHeadsHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Fees Heads</h5>
          <hr>
    </div>
    
    <div class="container" id="manageHeadsHolder">
    </div>
    <div id="jsGrid" style = "display:none"></div>
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

        $("#jsGrid").jsGrid({
            width: "100%",
            inserting: false,
            editing: true,
            sorting: false,
            paging: true,
      
            data: feeData,
      
            fields: [
              { name: "headName", type: "text", width: 140 },
              { name: "amount_KG1", type: "number", width: 120},
              { name: "amount_KG2", type: "number", width: 120 },
              { name: "amount_Nursery", type: "number", width: 160 },
              { name: "amount_1st", type: "number", width: 120 },
              { name: "amount_2nd", type: "number", width: 120 },
              { name: "amount_3rd", type: "number", width: 120 },
              { name: "amount_4th", type: "number", width: 120 },
              { name: "amount_5th", type: "number", width: 120 },
              { name: "amount_6th", type: "number", width: 120 },
              { name: "amount_7th", type: "number", width: 120 },
              { name: "amount_8th", type: "number", width: 120 },
              { name: "amount_9th", type: "number", width: 120 },
              { name: "amount_10th", type: "number", width: 120 },
              { type: "control",width: 60 }
            ]
        });
        document.getElementById('jsGrid').style.display = "block";

    });
}