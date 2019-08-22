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
            ],

            onItemUpdating: function(args) {
                // cancel update of the item with empty 'name' field
                if(args.item.name === "") {
                    args.cancel = true;
                    alert("Specify the name of the item!");
                }
                   updateFeeHeadDetails(args.item);
            }
        });
        document.getElementById('jsGrid').style.display = "block";
    });
}

function updateFeeHeadDetails(FeeHeadItem){
    var shouldI = confirm("Are you sure..?");
    if(shouldI){
        let updateHeadItemReq = $.post(baseUrl + "/apis/feesHeads.php",{
            type: "updateById",
            id: FeeHeadItem.headId,
            headName: FeeHeadItem.headName,
            amount_KG1: FeeHeadItem.amount_KG1,
            amount_KG2: FeeHeadItem.amount_KG2,
            amount_Nursery: FeeHeadItem.amount_Nursery,
            amount_1st: FeeHeadItem.amount_1st,
            amount_2nd: FeeHeadItem.amount_2nd,
            amount_3rd: FeeHeadItem.amount_3rd,
            amount_4th: FeeHeadItem.amount_4th,
            amount_5th: FeeHeadItem.amount_5th,
            amount_6th: FeeHeadItem.amount_6th,
            amount_7th: FeeHeadItem.amount_7th,
            amount_8th: FeeHeadItem.amount_8th,
            amount_9th: FeeHeadItem.amount_9th,
            amount_10th: FeeHeadItem.amount_10th
    });

    updateHeadItemReq.done(function(responce){
        if(responce != 200){
            // if failed -> get old view
            makeViewForFeeHeads();
        }
    });
    }    
}