let FeeRepostType;
let FeeSessionSelect;
let isFirstDateReportView = true;
let isClassAndSectionFirst = true;
let dateFrom, dateTo;
function feesReport() {

  clearFilter()
  FeeRepostType = "";
  FeeSessionSelect = "";
  isFirstDateReportView = true;
  isClassAndSectionFirst = true;


  setActiveColorsfees("feesReport");
  searchcNEditHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Fees Report</h4>
      <hr>
    </div>
    <div class="row" id="typeHolder">
    <div class="col-md-2" style="text-align:right"><label for="FeeRepostType">Report Type: </label></div>
      <div class="col-md-4">
        <select class="form-control" id="FeeRepostType">
          <option selected disabled value="">Select Report Type</option>
          <option value="receiptById">Get Receipt By Id</option>
          <option value="byDate">By Date</option>
          <option value="byMonth">By Month</option>
          <option value="classSummeryReport">Class Summery Report</option>
        </select>
      </div>
      <div class="col-md-4" id="feeSessionDiv">
        <select class="form-control" id="FeeSessionSelect">
          <option selected disabled value="">Select Accedamic Year</option>
        </select>
      </div>
      <div class="col-md-1" id="filterImg">
      <img src="../img/filter.png" style="width:25px; height:25px;cursor: pointer;" onclick="showFilters()"></img>
      </div>



      <div class="col-md-4" id="receiptIdBox" style = "display:none">
        <input type = "number" placeholder = "Receipt Id" class = "form-control" id = "receiptIdToGet"> 
      </div>
      <div class="col-md-2" id="receiptGoBox" style = "display:none">
        <button class= "btn btn-secondary" onclick="viewReceipt(this.parentNode.parentNode.childNodes[9].childNodes[1].value)">GO</button> 
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
          <div class="alert" id="errorMessage" style="display: none">
          </div>
      </div>
    </div>

    <div class="container" id="FeeReportHolder" style="background: #e3f1fd; border-radius: 20px; margin:1%">
    
    </div>
  </div>`;
  document.getElementById('feesActionHolder').innerHTML = searchcNEditHTML;
  loadAllSessionsAndSetListeners();
}

function loadAllSessionsAndSetListeners() {
  var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
    type: "getAllSessions"
  });

  allSessionReq.done(function (allSessions) {
    allSessions = JSON.parse(allSessions);
    for (index in allSessions) {
      $('#FeeSessionSelect')
        .append($('<option>', { value: allSessions[index].sessionName })
          .text(allSessions[index].sessionName
          ));
    }

    FeeSessionSelect = currentSession;
    document.getElementById("FeeSessionSelect").value = currentSession;

    $(document).on('change', '#FeeRepostType', function () {
      FeeRepostType = document.getElementById('FeeRepostType').value;
      checkReportType();
    });

    $(document).on('change', '#FeeSessionSelect', function () {
      FeeSessionSelect = document.getElementById('FeeSessionSelect').value;
      document.getElementById("errorMessage").style.display = "none";
      checkReportType();
    });
  });



}

function checkReportType() {
  if (FeeSessionSelect == null || FeeSessionSelect == "") {
    document.getElementById("errorMessage").innerText = "Please select accedamic year";
    document.getElementById("errorMessage").style.display = "block"; 
  }
  else {

    if (FeeRepostType == "byDate") {
      document.getElementById('feeSessionDiv').style.display = "block";
      document.getElementById("feeSessionDiv").className = "col-md-5";
      document.getElementById('filterImg').style.display = "none";
      document.getElementById('receiptIdBox').style.display = "none";
      document.getElementById('receiptGoBox').style.display = "none";
      document.getElementById('FeeReportHolder').innerHTML = ``;
      document.getElementById("errorMessage").style.display = "none";
      document.getElementById("feeInfoHolder").innerHTML = `<div class="col-md-2" style="text-align: end">
                                                            <label for="dateFrom">From:</label>
                                                          </div>
                                                          <div class="col-md-3">
                                                            <input type="date" class="form-control" id="dateFrom">
                                                          </div>
                                                          <div class="col-md-2" style="text-align: end">
                                                            <label for="dateTo">To:</label>
                                                          </div>
                                                          <div class="col-md-3">
                                                            <input type="date" class="form-control" id="dateTo">
                                                          </div>`;
      if (isFirstDateReportView) {
        $(document).on('change', '#dateFrom', function () {
          dateFrom = document.getElementById('dateFrom').value
          ReportByDates();
        });
        $(document).on('change', '#dateTo', function () {
          dateTo = document.getElementById('dateTo').value
          ReportByDates();
        });
      }
      isFirstDateReportView = false;
      document.getElementById("botHR").style.display = "block";
    }

    else if(FeeRepostType == "byMonth"){
      document.getElementById("feeSessionDiv").className = "col-md-5";
      document.getElementById('filterImg').style.display = "none";
      document.getElementById('receiptIdBox').style.display = "none";
      document.getElementById('receiptGoBox').style.display = "none";
      document.getElementById('feeSessionDiv').style.display = "block";
      document.getElementById('FeeReportHolder').innerHTML = ``;
      document.getElementById("errorMessage").style.display = "none";

      if(FeeSessionSelect != ""){
        getMonthWiseReport();
      }
    }

    else if (FeeRepostType == "classSummeryReport") {
      document.getElementById("feeSessionDiv").className = "col-md-4";
      document.getElementById('filterImg').style.display = "block";
      document.getElementById('feeSessionDiv').style.display = "block";
      document.getElementById('receiptIdBox').style.display = "none";
      document.getElementById('receiptGoBox').style.display = "none";
      document.getElementById('FeeReportHolder').innerHTML = ``;
      document.getElementById("feeInfoHolder").innerHTML = ``;
      if(document.getElementById("filterClass").value == "" ||document.getElementById("filterClass").value == null|| document.getElementById("filterSection").value == ""|| document.getElementById("filterSection").value == null){
        document.getElementById("errorMessage").innerText = "Set values of Class And Section from filter";
        document.getElementById("errorMessage").style.display = "block";
      }
      else{
        UpdateFilter();
      }
      document.getElementById("botHR").style.display = "block";
    }

    else if(FeeRepostType == "receiptById"){
        document.getElementById('feeSessionDiv').style.display = "none";
        document.getElementById('filterImg').style.display = "none";
        document.getElementById('receiptIdBox').style.display = "block";
        document.getElementById('receiptGoBox').style.display = "block";
        document.getElementById("errorMessage").style.display = "none";
    }
    

    else {
      
    }


  }
}


function getReceipt(div){
  console.log(div);
}

function classSummeryReport() {
  var classSummeryReportReq = $.post(baseUrl + "/apis/receiptStuff.php",{
    type: "classSummeryReport",
    class: document.getElementById("filterClass").value,
    section: document.getElementById("filterSection").value,
    sessionName: FeeSessionSelect
  });
  classSummeryReportReq.done(function(responseReport){
    var reportJSON = JSON.parse(responseReport);

    for(itr in reportJSON){
      reportJSON[itr]["balenceFees"] = parseInt(reportJSON[itr].totalFees,10) - parseInt(reportJSON[itr].paidFees,10);
    }

    console.log(reportJSON);
    document.getElementById('FeeReportHolder').innerHTML = `<div id="jsGrid" style = "display:none"></div>`;
    $("#jsGrid").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      paging: true,

      data: reportJSON,

      fields: [
          { name: "studentId", type: "number", width: 80 },
          { name: "fullname", type: "text", width: 150, validate: "required" },
          { name: "totalFees", type: "number", width: 80 },
          { name: "paidFees", type: "number", width:80 },
          { name: "balenceFees", type: "number", width:80 }
      ]
  });
  document.getElementById('jsGrid').style.display = "block"
  document.getElementById('feeInfoHolder').innerHTML = `<div class="col-md-12" id="typeReport" style="text-align:center"><div>`;
  document.getElementById('typeReport').innerText = "Class Summery Report For "+document.getElementById('filterClass').value+" "+document.getElementById("filterSection").value;
  });
}

function buildDateReport(report){
  let reportHeads = new Array();
  let fieldsArr = new Array(), i=0;
  if(report.length >= 1){
    reportHeads = report[0];
    for(key in reportHeads){
      fieldsArr[i] = {name: key, type: "number", width: 20};
      i++;
    }
   // console.log(JSON.stringify(fieldsArr));
  }
  document.getElementById('FeeReportHolder').innerHTML = `<div id="jsGrid" style = "display:none"></div>`;
    $("#jsGrid").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      paging: true,
      data: report,
      fields: fieldsArr
  });
  document.getElementById('jsGrid').style.display = "block"
  document.getElementById('feeInfoHolder').innerHTML = `<div class="col-md-12" id="typeReport" style="text-align:center"><div>`;

  
  document.getElementById('typeReport').innerText = "Head summery Report";
}

function ReportByDates() {
  
  if (document.getElementById("dateFrom").value != "" && document.getElementById("dateTo").value != "") {
    var reportByDateReq = $.post(baseUrl + "/apis/feesReport.php", {
      type: "byDay",
      dateFrom: document.getElementById("dateFrom").value,
      dateTo: document.getElementById("dateTo").value,
    });

    reportByDateReq.done(function (reportRes) {
       var report = JSON.parse(reportRes);
       buildDateReport(report);
    });
  }
}

function getMonthWiseReport(){
  var monthWiseReportReq = $.post(baseUrl +"/apis/feesReport.php",{
    type: "byMonth",
    sessionName: FeeSessionSelect
  });
  monthWiseReportReq.done(function(reportRes){
    buildDateReport(JSON.parse(reportRes));
  });
}

function UpdateFilter() {
  if (FeeRepostType == "byDate") {
    ReportByDates();
  }
  else if (FeeRepostType == "classSummeryReport") {
    if(document.getElementById("filterClass").value != "" && document.getElementById("filterClass").value != null && document.getElementById("filterSection").value != "" && document.getElementById("filterSection").value != null)
      {
        document.getElementById("errorMessage").style.display = "none";
        classSummeryReport()
      }
    
  }
  else {

  }
}

function showFilters() {
  $.when(getClassAndSection()).then(function () {
    $("#filterModal").modal({ backdrop: 'static', keyboard: false });
  });
}

function clearFilter() {
  document.getElementById("filterClass").value = "";
  document.getElementById("filterSection").value = "";
}

function getClassAndSection() {
  if (isClassAndSectionFirst) {
    $.post(baseUrl + "/apis/classList.php",
      {
        type: "getClassList"
      },
      function (classDATA) {
        let classJSON = JSON.parse(classDATA);

        $('#filterClass').empty();

        $('#filterClass').append($('<option>', {
          value: "",
          text: "Select Student Class",
          selected: true,
          disabled: true
        }, '</option>'));

        for (index in classJSON) {
          $('#filterClass')
            .append($('<option>', {
              value: classJSON[index].className,
              text: classJSON[index].className,
            }, '</option>'));
        }
      });

    $.post(baseUrl + "/apis/sectionList.php",
      {
        type: "getSectionList"
      },
      function (sectionDATA) {
        let sectionJSON = JSON.parse(sectionDATA);

        $('#filterSection').empty();

        $('#filterSection').append($('<option>', {
          value: "",
          text: "Select Student Section",
          selected: true,
          disabled: true
        }, '</option>'));

        for (index in sectionJSON) {
          $('#filterSection')
            .append($('<option>', {
              value: sectionJSON[index].sectionName,
              text: sectionJSON[index].sectionName,
            }, '</option>'));
        }
      });
    isClassAndSectionFirst = false;
  }
}