let FeeRepostType;
let FeeSessionSelect;
let isFirstDateReportView = true;
let isClassAndSectionFirst = true;
let dateFrom, dateTo;
var printType = "";

function FeeRepostTypehangeFun() {
    FeeRepostType = document.getElementById('FeeRepostType').value;
    checkReportType();
}

function FeeSessionSelectOnChange() {
    FeeSessionSelect = document.getElementById('FeeSessionSelect').value;
    document.getElementById("errorMessage").style.display = "none";
    checkReportType();
}

function feesReport() {

    clearFilter();
    FeeRepostType = "";
    FeeSessionSelect = "";
    isFirstDateReportView = true;
    isClassAndSectionFirst = true;
    document.getElementById("filterType").value = "0";


    setActiveColorsfees("feesReport");
    searchcNEditHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Fees Report</h4>
      <hr>
    </div>
    
    <div class="row" id="typeHolder">
    <div class="col-md-2" style="text-align:right"><label for="FeeRepostType">Report Type: </label></div>
      <div class="col-md-4">
        <select class="form-control" id="FeeRepostType" onchange="FeeRepostTypehangeFun()">
          <option selected disabled value="">Select Report Type</option>
          <option value="receiptById">Get Receipt By Id</option>
          <option value="deletedReceipt">Get Deleted Receipts</option>
          <option value="byDate">By Date</option>
          <option value="byMonth">By Month</option>
          <option value="bySchool">By School</option>
          <option value="classSummeryReport">Class Summery Report</option>
        </select>
      </div>
      <div class="col-md-4" id="feeSessionDiv">
        <select class="form-control" id="FeeSessionSelect" onchange="FeeSessionSelectOnChange()">
          <option selected disabled value="">Select Accedamic Year</option>
        </select>
      </div>
      <div class="col-md-1" id="filterImg">
      <img src="../img/filter.png" style="width:25px; height:25px;cursor: pointer; margin: 3%;" onclick="showFilters()"></img>
      </div>



      <div class="col-md-4" id="receiptIdBox" style = "display:none">
        <input type = "number" placeholder = "Receipt Id" class = "form-control" id = "receiptIdToGet"> 
      </div>
      <div class="col-md-2" id="receiptGoBox" style = "display:none">
        <button class= "btn btn-secondary" style="`+ CSSbtnPrimary + `" onclick="viewReceipt(this.parentNode.parentNode.childNodes[9].childNodes[1].value)">GO</button> 
      </div>
    </div>

    

    <div class="row" style="margin-top:1.5%; margin-bottom:1.5%">
      <div class="col-md-10">
        <hr>
      </div>
      <div class="col-md-3">
      </div>
      
    </div>
    
    <div class="row" id="feeInfoHolder" style="text-align:center">
    
    </div>
    
    <div class="row" style="margin-top:1.5%; margin-bottom:1.5%;display: none" id="botHR">
      <div class="col-md-12">
        <hr>
      </div>
           
    </div>

    <div class="row" style="margin-top:1.5%;" >
      <div class="col-md-7">
          <div class="alertMine" id="errorMessage" style="display: none">
          </div>
      </div>
    </div>

    <div class="container backgroundDefiner" id="FeeReportHolder" style="background:var(--btnColor3); border-radius: 20px; margin:1%">

    </div>
  </div>`;
    document.getElementById('feesActionHolder').innerHTML = searchcNEditHTML;
    loadAllSessionsAndSetListeners();
}

function loadAllSessionsAndSetListeners() {
    document.getElementById("new_loader").style.display = "block";
    var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
        type: "getAllSessions",
        uid: me_data.uid
    });

    allSessionReq.done(function (allSessions) {
        try {
            allSessions = JSON.parse(allSessions);
            for (var index in allSessions) {
                $('#FeeSessionSelect')
                    .append($('<option>', { value: allSessions[index].sessionName })
                        .text(allSessions[index].sessionName));
            }

            FeeSessionSelect = currentSession;
            document.getElementById("FeeSessionSelect").value = currentSession;
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    allSessionReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });

}

function checkReportType() {
    if (FeeSessionSelect == null || FeeSessionSelect == "") {
        document.getElementById("errorMessage").innerText = "Please select accedamic year";
        document.getElementById("errorMessage").style.display = "block";
    } else {

        if (FeeRepostType == "byDate") {
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById('filterImg').style.display = "block";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-2" style="text-align: end">
                                                            <label for="dateFrom">Date From - To:</label>
                                                          </div>
                                                          <div class="col-md-4">
                                                            <input type="date" class="form-control" id="dateFrom">
                                                          </div>
                                                         
                                                          <div class="col-md-4">
                                                            <input type="date" class="form-control" id="dateTo">
                                                          </div>

                                                          <div class="col-md-1">
                                                          <button id="printBtn" style="float:right; `+ CSSbtnPrimary + `" class="btn btn-secondary" onclick="printReport()" disabled>Print</button>
                                                          </div>
                                                         `;
            if (isFirstDateReportView) {
                $(document).on('change', '#dateFrom', function () {
                    dateFrom = document.getElementById('dateFrom').value;
                    ReportByDates();
                });
                $(document).on('change', '#dateTo', function () {
                    dateTo = document.getElementById('dateTo').value;
                    ReportByDates();
                });
            }
            isFirstDateReportView = false;
            document.getElementById("botHR").style.display = "block";
        } else if (FeeRepostType == "bySchool") {
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById('filterImg').style.display = "none";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-10" style="text-align: end">
                                                              </div>
                                                              <div class="col-md-1">
                                                                <button id="printBtn" style="float:right; `+ CSSbtnPrimary + `" class="btn btn-secondary" onclick="printReport()" disabled>Print</button>
                                                              </div>`;
            document.getElementById("errorMessage").style.display = "none";

            if (FeeSessionSelect != "") {
               reportBySchool();
            }
        } else if (FeeRepostType == "byMonth") {
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('filterImg').style.display = "block";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-10" style="text-align: end">
                                                              </div>
                                                              <div class="col-md-1">
                                                                <button id="printBtn" style="float:right; `+ CSSbtnPrimary + `" class="btn btn-secondary" onclick="printReport()" disabled>Print</button>
                                                              </div>`;
            document.getElementById("errorMessage").style.display = "none";

            if (FeeSessionSelect != "") {
                 getMonthWiseReport();
            }
        } else if (FeeRepostType == "classSummeryReport") {
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById('filterImg').style.display = "block";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("feeInfoHolder").innerHTML = ``;
            if (document.getElementById("filterClass").value == "" || document.getElementById("filterClass").value == null || document.getElementById("filterSection").value == "" || document.getElementById("filterSection").value == null) {
                document.getElementById("errorMessage").innerText = "Set values of Class And Section from filter";
                document.getElementById("errorMessage").style.display = "block";
            } else {
                UpdateFilter();
            }
            document.getElementById("botHR").style.display = "block";
        } else if (FeeRepostType == "receiptById") {
            document.getElementById('feeInfoHolder').innerHTML = ``;
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById('feeSessionDiv').style.display = "none";
            document.getElementById('filterImg').style.display = "none";
            document.getElementById('receiptIdBox').style.display = "block";
            document.getElementById('receiptGoBox').style.display = "block";
            document.getElementById("errorMessage").style.display = "none";
        } else if (FeeRepostType == "deletedReceipt") {
            document.getElementById('filterImg').style.display = "none";
            document.getElementById('receiptIdBox').style.display = "none";
            document.getElementById('receiptGoBox').style.display = "none";
            document.getElementById('feeSessionDiv').style.display = "block";
            document.getElementById('FeeReportHolder').innerHTML = ``;
            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-10" style="text-align: end">
                                                              </div>
                                                              <div class="col-md-1">
                                                                <button id="printBtn" style="float:right; `+ CSSbtnPrimary + `" class="btn btn-secondary" onclick="printReport()" disabled>Print</button>
                                                              </div>`;
            document.getElementById("errorMessage").style.display = "none";
            getDeletedReceiptReport();
        }


    }
}

function getDeletedReceiptReport() {
    document.getElementById("new_loader").style.display = "block";
    var deletedReceiptReq = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "getDeletedReceiptList",
        uid: me_data.uid
    });

    deletedReceiptReq.done(function (data) {
        try {
            let receiptArray = JSON.parse(data);
            document.getElementById('FeeReportHolder').innerHTML = `<div id="jsGrid" style = "display:none"></div>`;
            $("#jsGrid").jsGrid({
                width: "100%",
                inserting: false,
                editing: false,
                sorting: true,
                paging: true,
                pageSize: 100,
                data: receiptArray,
                fields: [
                    { name: "receiptNo", type: "number", width: 80 },
                    { name: "receiptDate", type: "text", width: 80, validate: "required" },
                    { name: "remarkCreation", type: "text", width: 80 },
                    { name: "deletionRemark", type: "text", width: 80 },
                    { name: "deletedBy", type: "text", width: 80 },
                    { name: "createdBy", type: "text", width: 80 }
                ]
            });
            document.getElementById('jsGrid').style.display = "block";
            document.getElementById("new_loader").style.display = "none";
            document.getElementById('printBtn').disabled = false;
        }
        catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
    });
    deletedReceiptReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function filterTypeChangeListener() {
    let type = document.getElementById("filterType").value;
    if (type == 0) {
        document.getElementById("filterSchoolDiv").style.display = "none";
        document.getElementById("classNSectionFilterDiv").style.display = "none";
    }
    else if (type == 2) {
        document.getElementById("filterSchoolDiv").style.display = "none";
        document.getElementById("classNSectionFilterDiv").style.display = "block";
    }
    else if (type == 1) {
        document.getElementById("filterSchoolDiv").style.display = "block";
        document.getElementById("classNSectionFilterDiv").style.display = "none";
    }
}

function classSummeryReport() {
    document.getElementById("new_loader").style.display = "block";
    var classSummeryReportReq = $.post(baseUrl + "/apis/receiptStuff.php", {
        type: "classSummeryReport",
        uid: me_data.uid,
        class: document.getElementById("filterClass").value,
        section: document.getElementById("filterSection").value,
        sessionName: FeeSessionSelect
    });
    classSummeryReportReq.done(function (responseReport) {
        console.log(responseReport);
        try {
            var reportJSON = JSON.parse(responseReport);
            var tFee = 0, bFee = 0, pFee = 0;
            for (var itr in reportJSON) {
                reportJSON[itr].balenceFees = parseInt(reportJSON[itr].totalFees, 10) - parseInt(reportJSON[itr].paidFees, 10);
                tFee += parseInt(reportJSON[itr].totalFees, 10);
                pFee += parseInt(reportJSON[itr].paidFees, 10);
                bFee += reportJSON[itr].balenceFees;
            }
            var obj = new Object();
            obj.fullName = "Total";
            obj.totalFees = tFee;
            obj.balenceFees = bFee;
            obj.paidFees = pFee;
            reportJSON.push(obj);

            document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-10" style="text-align: end">
            </div>
            <div class="col-md-1">
              <button id="printBtn" style="float:right; `+ CSSbtnPrimary + `" class="btn btn-secondary" onclick="printReport()">Print</button>
            </div>`;
            document.getElementById('FeeReportHolder').innerHTML = `<div id="jsGrid" style = "display:none"></div>`;
            $("#jsGrid").jsGrid({
                width: "100%",
                inserting: false,
                editing: false,
                sorting: true,
                paging: true,
                pageSize: 100,
                data: reportJSON,

                fields: [
                    { name: "fullName", type: "text", width: 150, validate: "required" },
                    { name: "totalFees", type: "number", width: 80 },
                    { name: "paidFees", type: "number", width: 80 },
                    { name: "balenceFees", type: "number", width: 80 }
                ]
            });
            document.getElementById('jsGrid').style.display = "block";
            document.getElementById("new_loader").style.display = "none";
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
    });

    classSummeryReportReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function buildFeeReport(report, type) {
    document.getElementById('printBtn').disabled = true;
    document.getElementById('FeeReportHolder').innerHTML = `
  <div class="row" style="margin-bottom:3%">
  <div class="col-md-12">
    <canvas id="myChart" width="100" height="40"></canvas>
  </div>
  </div>

  <div class="row">
    <div id="jsGrid" style = "display:none;"></div>
  </div>`;

    let reportHeads = [];
    let fieldsArr = [],
        i = 0;
    if (report.length >= 1) {
        reportHeads = report[0];
        for (var key in reportHeads) {
            fieldsArr[i] = { name: key, type: "number", width: 120 };
            i++;
        }
        if (type == "ByDate") {
            document.getElementById('FeeReportHolder').innerHTML = ` <div class="row">
      <div id="jsGrid" style = "display:none; text-align:center"></div>
    </div>`;
            for (var itr in report) {
                let finalDateArr = report[itr].receiptDate.split("-");
                if (itr != report.length - 1) {
                    report[itr].receiptDate = finalDateArr[2] + "-" + finalDateArr[1] + "-" + finalDateArr[0];
                }
            }
        }
        //Month Wise Report
        else if (type == "ByMonth") {
            document.getElementById('FeeReportHolder').innerHTML = `
      <div class="row">
        <div class="col-md-12">
          <canvas id="myChart" width="100" height="40"></canvas>
        </div>
      </div>
      <div class="row" style="margin-top:5%">
        <div id="jsGrid" style = "display:none; text-align:center"></div>
      </div>`;
            var months = [];
            var totals = [];
            for (var itr in report) {
                if (itr != (report.length - 1)) {
                    months.push(report[itr].month);
                    totals.push(report[itr].Total);
                }
            }
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Earnings by month',
                        data: totals,
                        borderColor: '#2e86c1',
                        fill: false,
                    }]
                }
            });
        } else if (type == "BySchool") {
            document.getElementById('FeeReportHolder').innerHTML = `
      <div class="row">
        <div class="col-md-12">
          <canvas id="myChart" width="100" height="40"></canvas>
        </div>
      </div>
      <div class="row" style="margin-top:5%">
        <div id="jsGrid" style = "display:none; text-align:center"></div>
      </div>`;
            var months = [];
            var totals = [];
            for (var itr in report) {
                if (itr != (report.length - 1)) {
                    months.push(report[itr].schoolName);
                    totals.push(report[itr].Total);
                }
            }
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'doughnut',

                data: {
                    labels: months,
                    datasets: [{
                        label: 'Earnings By School',
                        data: totals,
                        borderColor: '#2e86c1',
                        backgroundColor: ["#7fb3d5", "#a9cce3", "#fadbd8"],
                    }]
                }
            });
        }

    }

    $("#jsGrid").jsGrid({
        width: "100%",
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        data: report,
        pageSize: 1000,
        fields: fieldsArr
    });
    document.getElementById('jsGrid').style.display = "block";
    document.getElementById('printBtn').disabled = false;
}

function ReportByDates() {

    if (document.getElementById("dateFrom").value != "" && document.getElementById("dateTo").value != "") {
        document.getElementById("new_loader").style.display = "block";
        var reportByDateReq = $.post(baseUrl + "/apis/feesReport.php", {
            type: "byDay",
            uid: me_data.uid,
            dateFrom: document.getElementById("dateFrom").value,
            dateTo: document.getElementById("dateTo").value,
            searchType: document.getElementById("filterType").value,
            schoolId: document.getElementById("filterSchool").value,
            classId: document.getElementById("filterClass").value,
            sectionId: document.getElementById("filterSection").value
        });

        reportByDateReq.done(function (reportRes) {
            console.log(reportRes);
            try {
                var report = JSON.parse(reportRes);
                buildFeeReport(report, "ByDate");
            } catch (e) {
                showNotification("Error", "Failed to get data", "danger");
            }
            document.getElementById("new_loader").style.display = "none";
        });

        reportByDateReq.fail(function (jqXHR, textStatus) {
            document.getElementById("new_loader").style.display = "none";
            handleNetworkIssues(textStatus)
        });
    }
}

function getMonthWiseReport() {
    document.getElementById("new_loader").style.display = "block";
    var monthWiseReportReq = $.post(baseUrl + "/apis/feesReport.php", {
        type: "byMonth",
        uid: me_data.uid,
        sessionName: FeeSessionSelect,
        searchType: document.getElementById("filterType").value,
        schoolId: document.getElementById("filterSchool").value,
        classId: document.getElementById("filterClass").value,
        sectionId: document.getElementById("filterSection").value
    });

    monthWiseReportReq.done(function (reportRes) {
        console.log(reportRes);
        try {
            buildFeeReport(JSON.parse(reportRes), "ByMonth");
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    monthWiseReportReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function reportBySchool() {
    document.getElementById("new_loader").style.display = "block";
    var monthWiseReportReq = $.post(baseUrl + "/apis/feesReport.php", {
        type: "bySchool",
        uid: me_data.uid,
        sessionName: FeeSessionSelect
    });
    monthWiseReportReq.done(function (reportRes) {
        console.log(reportRes);
        try {
            buildFeeReport(JSON.parse(reportRes), "BySchool");
        } catch (e) {
            showNotification("Error", "Failed to get data", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    monthWiseReportReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function UpdateFilter() {
    if (FeeRepostType == "byDate") {
        ReportByDates();
    } else if (FeeRepostType == "classSummeryReport") {
        if (document.getElementById("filterClass").value != "" && document.getElementById("filterClass").value != null && document.getElementById("filterSection").value != "" && document.getElementById("filterSection").value != null) {
            classSummeryReport();
        }

    }
    else if (FeeRepostType == "byMonth") {
        getMonthWiseReport();
    }
}

function showFilters() {
    $.when(loadClassForSelectId("filterClass", "filterSection"), setValuesInSchoolListSelect("filterSchool")).then(function () {
        $("#filterModal").modal({ backdrop: 'static', keyboard: false });
    });
}

function clearFilter() {
    document.getElementById("filterClass").value = "";
    document.getElementById("filterSection").value = "";
}


function printReport() {
    
    var type = "Fees Report By: " + $( "#FeeRepostType option:selected" ).text();
    var filter = "";
    var dateStr = ""
    if(type != ""){
        let school = $( "#filterSchool option:selected" ).text();
        let className = $( "#filterClass option:selected" ).text();
        let sectionName = $( "#filterSection option:selected" ).text();
        if(document.getElementById("filterType").value == 1){
            filter = "For: "+ school;
        }
        else if(document.getElementById("filterType").value == 2){
            filter = "For Class: "+ className+ " Section: "+sectionName;
        }
        else{
            filter = "No Filter";
        }

        if(FeeRepostType == "byDate"){
            filter += ", From: " + dateFrom + " - To: " +dateTo;
        }

        let temp = new Date();
        dateStr = temp.toUTCString();
    }


    var prtContent = document.getElementById("jsGrid");
    var WinPrint = window.open('', '', 'left=0,top=0,width=' + screen.width + ',height=' + screen.height + ',toolbar=0,scrollbars=0,status=0');
    var initHTML = `<html lang="en">
<head>
  <meta charset="utf-8">
  <title>School | Home</title>
  <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.css" />
  <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid-theme.min.css" />
  <style type="text/css" media="print">
@page {
    size: auto;   /* auto is the initial value */
    margin: 0;  /* this affects the margin in the printer settings */
}
</style></head>
<body>
<div class="row"><h3 style="text-align:center">`+type+`</h3></div>
<div class="row"><h5 style="text-align:center">`+filter+`</h5></div>
<div class="row"><h5 style="text-align:center">`+dateStr+`</h5></div>

`
    var printJS = `
<script>
window.onload = function() {
    window.print();
    window.close();
  };
  </script>`
    WinPrint.document.write(initHTML + prtContent.innerHTML + printJS + "</body></html>");
    WinPrint.document.close();
    WinPrint.focus();
}