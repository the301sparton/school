function manageFeesHeads() {
    setActiveColorsAdminTasks("manageFeesHeads");

    let manageFeesHeadsHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Fees Heads</h5>
          <hr>
    </div>
    
    <div class="container" id="manageHeadsHolder">
    </div>

    <div class="row">
        <div class="col-md-10"></div>
        <div class="col-md-2">
        <select class="form-control" id="sessionSelect" onchange="makeViewForFeeHeads()">
        <option selected disabled value="">Select Accedamic Year</option>

      </select>
        </div>
    </div>

    <div class="row" style = "margin-top: 2%">
    <div id="jsGrid" style = "display:none"></div>
    </div>
    </div>`;

    document.getElementById('adminActionHolder').innerHTML = manageFeesHeadsHTML;
    loadAllSessionsForFeeHeads();

}


function loadAllSessionsForFeeHeads() {
    document.getElementById("new_loader").style.display = "block";
    var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
        type: "getAllSessions",
        uid: me_data.uid
    });

    allSessionReq.done(function (allSessions) {
        try {
            allSessions = JSON.parse(allSessions);
            for (var index in allSessions) {

                $('#sessionSelect')
                    .append($('<option>', { value: allSessions[index].sessionName })
                        .text(allSessions[index].sessionName
                        ));
            }

            document.getElementById("sessionSelect").value = currentSession;
            makeViewForFeeHeads();
        }
        catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    allSessionReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function makeViewForFeeHeads() {
    document.getElementById("new_loader").style.display = "block";
    let getAllfeeData = $.post(baseUrl + "/apis/feesHeads.php", {
        type: "getAllHeads",
        sessionName: document.getElementById("sessionSelect").value,
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
                        if (itr == "sessionName") {
                            fieldsArr[i] = { name: itr, type: "text", width: 120, editing: false, filtering: false };
                        }
                        else {
                            fieldsArr[i] = { name: itr, type: "number", width: 160, filtering: false };
                        }
                    }
                    else {
                        if (itr == "headName") {
                            fieldsArr[i] = { name: itr, type: "text", width: 160, editing: false, filtering: true  };
                        }
                        else {
                            fieldsArr[i] = { name: itr, type: "number", width: 120, filtering: false  };
                        }
                    }
                    i++;
                }
            }
            fieldsArr[i] = { type: "control", width: 60 };

            $("#jsGrid").jsGrid({
                width: "100%",
                filtering: true,
                editing: true,
                sorting: true,
                paging: true,
                autoload: true,
                pageSize: 8,
                fields: fieldsArr,
                controller: {
                    loadData: function (filter) {
                        var toReturn = $.Deferred();
                        let data = JSON.parse(responce);
                        var result = [];
                        if (filter.headName !== "") {
                            data.forEach(function (element) {
                                if (element.headName.indexOf(filter.headName) > -1) {
                                    result.push(element);
                                }
                            }, this);
                            data = result;
                        }
                        else result = data;

                        toReturn.resolve(result);
                        return toReturn.promise();
                    },
                },

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
    for (itr in FeeHeadItem) {
        if (itr != "sessionName") {
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