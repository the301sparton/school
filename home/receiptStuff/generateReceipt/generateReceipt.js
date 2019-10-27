
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
    let feesDetailHTML = ` <div class="container" style="background: #e9f1ff; border-radius: 15px; padding: 1%; margin-bottom: 2%">
    <div class="row">
      <div class="col-md-5" style="text-align: start">
       <h5 style="margin-bottom: 10px">Total Fees</h5> 
      </div>
      <div class="col-md-2" style="text-align: center">
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

    <div class="row" id="receiptHolder">

    </div>
    <div class="row" style="margin-top:2%;">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="fa fa-plus button button5" style="border-radius:50%; padding:20%" onclick="newReceiptView()"></i>
    </div>
   
    </div>

</div>`;

    document.getElementById("feeInfoHolder").innerHTML = feesDetailHTML;
    setAmountPaid(studentId);
    setTotalFees(studentId);
}

function setAmountPaid(studentId) {
    console.log(sessionSelect);
    var AmountRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "getMyPaidAmount",
        studentId: studentId,
        sessionName: sessionSelect
    });

    AmountRequest.done(function (amount) {
        if (amount != "E500") {
            document.getElementById('feesPaidValue').innerText = amount + " ₹";
        }

    });
}

function setTotalFees(studentId) {
    var AmountRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "getTotalFees",
        studentId: studentId,
        sessionName: sessionSelect
    });

    AmountRequest.done(function (amount) {
        if (amount != null) {
            document.getElementById('totalFeesValue').innerText = amount + " ₹";
        }
    });
}

function newReceiptView() {
    var getHeadsReq = $.post(baseUrl + "/apis/feesHeads.php", {
        type: "getActiveFeesHeads",
        classId: ReceiptClassId,
        sessionName: sessionSelect,
        studentId: ReceiptForStudentId
    });

    getHeadsReq.done(function (HeadList) {
        document.getElementById('headHolder').innerHTML = '';
        document.getElementById('totalFees').value = 0;
        var today = new Date();

        document.getElementById("receiptDate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

        
        feeHeads = JSON.parse(HeadList);
        for (var itr in feeHeads) {
            FeeHeadHTML = `<div class="row" style="margin-top: 2%">
            <div class="col-md-6">
              <label id = "headName`+ itr + `"></label>
            </div>
            <div class="col-md-1" style="display:none">
              <label id = "headId`+ itr + `"></label>
            </div>
            <div class="col-md-6">
              <input class="form-control" type="number" id="headValue`+ itr + `" onchange="setSum(this.value)" value="0">
            </div>
          </div>`;
          
            document.getElementById('headHolder').innerHTML += FeeHeadHTML;

            document.getElementById('headName' + itr).innerText = feeHeads[itr].headName+" ("+feeHeads[itr]["0"]+" / "+feeHeads[itr]["amount_"+ReceiptClassId]+")";

            document.getElementById('headId' + itr).innerText = feeHeads[itr].headId;
        }
        $('#newReceiptModal').modal();

    });

}

$('#newReceiptForm').submit(function (event) {
    event.preventDefault();
    $('#newReceiptModal').modal('toggle');
    let shouldSendReq = false;
    let superBreaksOFF = true;
    
    
    feesHeadVal = [];
    for (var itr in feeHeads) {
        if (document.getElementById('headValue' + itr).value != 0 ) {
            if(document.getElementById('headValue' + itr).value == "" || document.getElementById('headValue' + itr).value == null){
                superBreaksOFF = false;
                break;
            }
            shouldSendReq = true;
        }
        feesHeadVal[itr] = document.getElementById('headValue' + itr).value;
    }
    console.log(shouldSendReq);
    console.log(superBreaksOFF);
    if (shouldSendReq && superBreaksOFF) {
        var newReceiptRequest = $.post(baseUrl + "/apis/receiptStuff.php", {
            type: "newReceipt",
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
            var resjson = JSON.parse(newReceiptRes);
            if (resjson.resCode == 200) {
                getFeesDetails(ReceiptForStudentId);
                viewReceipt(resjson.id, ReceiptForStudentId, sessionSelect);
            }
            else {
                showNotification("<strong>Error</strong>","Failed to generate receipt", "danger");
                console.log(newReceiptRes);
            }
        });
    }
    else{
        showNotification("<strong>Error</strong>","Invalid Amount - Receipt not created", "danger");
    }
});

function setSum(value) {
    document.getElementById('totalFees').value = parseInt(value, 10) + parseInt(document.getElementById('totalFees').value, 10);
}

function viewReceipt(receiptId){
    document.location = baseUrl+"/receipt?receiptId="+receiptId;
}