function manageFeesHeads() {
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

function makeViewForFeeHeads() {
    document.getElementById("new_loader").style.display = "block";
    let getAllfeeData = $.post(baseUrl + "/apis/feesHeads.php", {
        type: "getAllHeads",
        uid: me_data.uid
    });

    getAllfeeData.done(function (responce) {
        try {
            let feeData = JSON.parse(responce);
            let fieldsArr = [], i = 0;
            console.log(feeData);
            for (itr in feeData[0]) {
                if (itr != "headId") {
                    if (itr.length > 10) {
                        fieldsArr[i] = { name: itr, type: "number", width: 160 };
                    }
                    else {
                        if (itr == "headName") {
                            fieldsArr[i] = { name: itr, type: "text", width: 120 };
                        }
                        else {
                            fieldsArr[i] = { name: itr, type: "number", width: 120 };
                        }
                    }
                    i++;
                }
            }
            fieldsArr[i] = { type: "control", width: 60 };

            $("#jsGrid").jsGrid({
                width: "100%",
                inserting: false,
                editing: true,
                sorting: false,
                paging: true,

                data: feeData,
                fields: fieldsArr,

                onItemUpdating: function (args) {
                    // cancel update of the item with empty 'name' field
                    if (args.item.headName === "") {
                        args.cancel = true;
                        showNotification("<strong>Error!</strong>", "Enter fees head name.", "warning");
                    }
                    else {
                        console.log(args.item);
                        updateFeeHeadDetails(args.item);
                    }

                }
            });
        }
        catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }



        document.getElementById('jsGrid').style.display = "block";
        document.getElementById("new_loader").style.display = "none";
    });

    getAllfeeData.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function updateFeeHeadDetails(FeeHeadItem) {
    document.getElementById("new_loader").style.display = "block";
    headList = new Array();
    for(itr in FeeHeadItem){
        if(itr != "sessionName"){
            headList.push(itr);
        }
    }
    let updateHeadItemReq = $.post(baseUrl + "/apis/feesHeads.php", {
        type: "updateById",
        uid: me_data.uid,
        id: FeeHeadItem.headId,
        headList: headList,
        FeeHeadItem: FeeHeadItem
    });

    
    updateHeadItemReq.done(function (responce) {
        console.log(responce);
        if (responce != 200) {
            // if failed -> get old view
            showNotification("<strong>Error</strong>", "Failed. loading old data", "danger");
            makeViewForFeeHeads();
        }
        else {
            showNotification("<strong>Success</strong>", "Fees Head Updated.!", "success");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    updateHeadItemReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}