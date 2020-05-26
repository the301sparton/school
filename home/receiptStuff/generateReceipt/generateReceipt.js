let searchBarViewReceipt;
let feeHeads;
let ReceiptForStudentId;
let ReceiptClassId;

function generateReceipt() {
    setActiveColorsfees("generateReceipt");
    searchNEdit(true);
}

function getFeesDetails(studentId, classId) {
    ReceiptForStudentId = studentId;
    ReceiptClassId = classId;
    let feesDetailHTML = ` <div class="container backgroundDefiner" style="background:var(--btnColor3); border-radius: 15px; padding: 1%; margin-bottom: 2%">
    <div class="row">
      <div class="col-md-5" style="text-align: start">
       <h5 style="margin-bottom: 10px">Total Fees</h5> 
      </div>
      <div class="col-md-2" style="text-align: center" onclick="showReceiptList()">
       <h6 style="margin-bottom: 10px;" class="myLink">Show Receipt List</h6> 
      </div>
      <div class="col-md-5" style="text-align: end">
          <h5 style="margin-bottom: 10px">Fees Paid</h5> 
      </div>
    </div>
    <div class="row">
      <div class="col-md-6" style="text-align: start">
        <strong>
          <h4 style="margin-bottom: 5px" id="totalFeesValue">

          </h4>
           
        </strong>
       
      </div>
      <div class="col-md-6" style="text-align: end">
          <h4 style="margin-bottom: 5px" id="feesPaidValue" >
               
          </h4>
      </div>
    </div>

    <div class="row">
        <div class="col-rmd-2"></div>
        <div class="col-rmd-8">
            <div class="container" id="receiptHolder">

            </div>
        </div>
    </div>

    <div class="row" style="margin-top:2%;">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="fa fa-plus button button6" style="border:1px solid; border-radius:50%; padding:20%" onclick="newReceiptView()"></i>
    </div>
   
    </div>

</div>`;
    document.getElementById("new_loader").style.display = "block";
    document.getElementById("feeInfoHolder").innerHTML = feesDetailHTML;
    $.when(setAmountPaid(studentId), setTotalFees(ReceiptClassId)).then(function () {
        document.getElementById("new_loader").style.display = "none";
    });

}

function setAmountPaid(studentId) {
    var AmountRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "getMyPaidAmount",
        uid: me_data.uid,
        studentId: studentId,
        sessionName: sessionSelect
    });

    AmountRequest.done(function (amount) {
        if (amount != "E500") {
            document.getElementById('feesPaidValue').innerText = amount + " ₹";
        }

    });

    AmountRequest.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}

function setTotalFees(className) {
    var AmountRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "getTotalFees",
        uid: me_data.uid,
        className: className,
        sessionName: sessionSelect
    });

    AmountRequest.done(function (amount) {
        if (amount != null) {
            document.getElementById('totalFeesValue').innerText = amount + " ₹";
        }
    });

    AmountRequest.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
}

function newReceiptView() {
    document.getElementById("new_loader").style.display = "block";
    var getHeadsReq = $.post(baseUrl + "/apis/feesHeads.php", {
        type: "getActiveFeesHeads",
        uid: me_data.uid,
        classId: ReceiptClassId,
        sessionName: sessionSelect,
        studentId: ReceiptForStudentId
    });

    getHeadsReq.done(function (HeadList) {
        document.getElementById('headHolder').innerHTML = '';
        document.getElementById('totalFees').value = 0;
        var today = new Date();

        document.getElementById("receiptDate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

        try {
            feeHeads = JSON.parse(HeadList);
            for (var itr in feeHeads) {
                FeeHeadHTML = `<div class="row" style="margin-top: 2%">
                <div class="col-md-6">
                  <label id = "headName` + itr + `"></label>
                </div>
                <div class="col-md-1" style="display:none">
                  <label id = "headId` + itr + `"></label>
                </div>
                <div class="col-md-6">
                  <input style = "background: var(--colorPrimary)" class="form-control" type="number" id="headValue` + itr + `" onchange="setSum(this.value)" value="0">
                </div>
              </div>`;

                document.getElementById('headHolder').innerHTML += FeeHeadHTML;

                document.getElementById('headName' + itr).innerText = feeHeads[itr].headName + " (" + feeHeads[itr]["0"] + " / " + feeHeads[itr]["amount_" + ReceiptClassId] + ")";

                document.getElementById('headId' + itr).innerText = feeHeads[itr].headId;
            }
            $('#newReceiptModal').modal();

        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    getHeadsReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });

}

$('#newReceiptForm').submit(function (event) {
    event.preventDefault();
    $('#newReceiptModal').modal('toggle');
    let shouldSendReq = false;
    let superBreaksOFF = true;

    feesHeadVal = [];
    for (var itr in feeHeads) {
        console.log(feeHeads[itr])
        if (document.getElementById('headValue' + itr).value != 0) {
            if (document.getElementById('headValue' + itr).value == "" || document.getElementById('headValue' + itr).value == null 
            || document.getElementById('headValue' + itr).value < 0 || document.getElementById('headValue' + itr).value > ( parseInt(feeHeads[itr]["amount_" + ReceiptClassId], 10) - (feeHeads[itr][0]))) {
                superBreaksOFF = false;
                break;
            }
            shouldSendReq = true;
        }
        feesHeadVal[itr] = document.getElementById('headValue' + itr).value;
    }
    if (shouldSendReq && superBreaksOFF) {
        document.getElementById("new_loader").style.display = "block";
        var newReceiptRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
            type: "newReceipt",
            uid: me_data.uid,
            userId: me_data.uid,
            studentId: ReceiptForStudentId,
            sessionName: sessionSelect,
            headValues: feesHeadVal,
            classId: ReceiptClassId,
            receiptDate: document.getElementById('receiptDate').value,
            receiptRemark: document.getElementById('receiptRemark').value
        });

        newReceiptRequest.done(function (newReceiptRes) {
            console.log(newReceiptRes);
            try {
                var resjson = JSON.parse(newReceiptRes);
                if (resjson.resCode == 200) {
                    //getFeesDetails(ReceiptForStudentId);
                    viewReceipt(resjson.id, ReceiptForStudentId, sessionSelect);
                } else {
                    showNotification("<strong>Error</strong>", "Failed to generate receipt", "danger");
                }
            } catch (e) {
                showNotification("Error", "Failed to get data", "danger");
            }
            document.getElementById("new_loader").style.display = "none";
        });

        newReceiptRequest.fail(function (jqXHR, textStatus) {
            document.getElementById("new_loader").style.display = "none";
            //handleNetworkIssues(textStatus)
        });
    } else {
        showNotification("<strong>Error</strong>", "Invalid Amount - Receipt not created", "danger");
    }
});

function setSum(value) {
    document.getElementById('totalFees').value = parseInt(value, 10) + parseInt(document.getElementById('totalFees').value, 10);
}

function viewReceipt(receiptId) {
    document.location = baseUrl + "/receipt?receiptId=" + receiptId;
}


function showReceiptList() {
    document.getElementById("receiptHolder").innerHTML = '';
    document.getElementById("new_loader").style.display = "block";
    let getReceiptListReq = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "receiptListBySessionAndStudentId",
        uid: me_data.uid,
        studentId: ReceiptForStudentId,
        sessionName: sessionSelect
    });
    getReceiptListReq.done(function (receiptListData) {
        try {
            let receiptListJSON = JSON.parse(receiptListData);
            for (itr in receiptListJSON) {
                let receiptListHTML = `<div class="row button button3" style="margin:1%; background:var(--btnColor2)" onclick="viewReceiptFromList(this)">
                <div class="col-rmd-5" style="background:var(--btnColor2)" id="receiptIdforList` + itr + `">
                </div>
                <div class="col-rmd-6" style="background:var(--btnColor2)" id="amountforList` + itr + `"></div>
                <div class="col-rmd-1" style="background:var(--btnColor2)"><i class="fa fa-trash" style="background:var(--btnColor2)" onclick="deleteReceiptModal(event, this.parentNode.parentNode)"></i></div>    
                </div>`;

                document.getElementById("receiptHolder").innerHTML += receiptListHTML;
                document.getElementById("receiptIdforList" + itr).innerText = "Receipt Id : " + receiptListJSON[itr].receiptId;
                document.getElementById("amountforList" + itr).innerText = "Amount : " + receiptListJSON[itr].recamt + " ₹";
            }

        } catch (e) {
            showNotification("<strong>Error</strong>", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    getReceiptListReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

var idForReceiptToDelete = 0;

function deleteReceiptModal(e, view) {
    e.stopPropagation();
    idForReceiptToDelete = view.childNodes[1].innerText.split(": ")[1];
    $("#deleteReceiptModal").modal();
}

function deleteReceipt() {
    let remark = document.getElementById("deleteionRemark").value;
    if (idForReceiptToDelete != 0 && remark != "") {
        document.getElementById("new_loader").style.display = "block";
        var deleteReceiptReq = $.post(baseUrl + "/apis/receiptStuff.php", {
            type: "deleteReceiptById",
            uid: me_data.uid,
            id: idForReceiptToDelete,
            remark: remark
        });
        deleteReceiptReq.done(function (res) {
            console.log(res);
            if (res == 200) {
                showNotification("Success!", "Receipt Deleted Successfully..!", "success");
                showReceiptList();
            } else {
                showNotification("<strong>Error</strong>", "Failed to delete receipt", "danger");
            }
            document.getElementById("new_loader").style.display = "none";
        });
    }
    else {
        showNotification("<strong>Error</strong>", "Please Enter Remark", "danger");
    }
}

function viewReceiptFromList(div) {
    viewReceipt(div.childNodes[1].innerText.split(": ")[1]);
}