var searchBy;
var maxRows = 5;
var sessionSelect;
var ErrorIsVisible;
var forReceipt;

let searchBarView;
searchNEditHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Search Student</h4>
      <hr>
    </div>
    <div class="row">
      <div class="col-md-4">
        <input class="form-control" type="text" placeholder="Search.." onkeyup="studentSearch(event)" id="searchBarView">
      </div>
      <div class="col-md-3">
        <select class="form-control" id="searchBy">
          <option selected disabled value="">Search By</option>
          <option value="name">Name</option>
          <option value="admissionNumber">Admission Number</option>
          <option value="aadharNumber">Aadhar Number</option>
          <option value="formNumber">Form Number</option>
          <option value="parentPhoneNumber">Parent Phone Number</option>
        </select>
      </div>
      <div class="col-md-2" style="text-align: end">
        <label for="maxRows">Max Rows</label>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="number" id="maxRows" value = "5">
      </div>
    </div>

    

    <div class="row" style="margin-top:1.5%; margin-bottom:1.5%">
      <div class="col-md-6">
        <hr>
      </div>
      <div class="col-md-3">
      </div>
      <div class="col-md-3">
        <select class="form-control" id="sessionSelect">
          <option selected disabled value="">Select Accedamic Year</option>

        </select>
      </div>
    </div>
    <div class="row" style="margin-top:1.5%;" >
      <div class="col-md-7">
      <div class="alertMine" id="errorMessage" style="display: none">
      </div>
      </div>
    </div>
    <div class="row" id="searchResultHolder">
    </div>
    <div class="row" id="feeInfoHolder">
    </div>
  </div>`;
function searchNEdit(forReceiptTemp) {
  forReceipt = forReceiptTemp;
  if (!forReceipt) {
    currentStudentOption = "searchNEdit";
    setActiveColorsStudent("searchNEdit");
    document.getElementById('studentActionHolder').innerHTML = searchNEditHTML;
  }
  else {
    document.getElementById('feesActionHolder').innerHTML = searchNEditHTML;
    document.getElementById('searchHeading').innerText = "Step 1 : Select Student";
  }
  searchBy = null;
  sessionSelect = null;
  searchBarView = document.getElementById('searchBarView');

  loadAllSessions();

  $(document).on('change', '#searchBy', function () {
    searchBy = document.getElementById('searchBy').value;
    studentSearch(searchBarView);
  });
  $(document).on('change', '#maxRows', function () {
    maxRows = document.getElementById('maxRows').value;
    studentSearch(searchBarView);
  });
  $(document).on('change', '#sessionSelect', function () {
    sessionSelect = document.getElementById('sessionSelect').value;
    studentSearch(searchBarView);
  });
}

function loadAllSessions() {
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
      sessionSelect = currentSession;
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


function studentSearch(event) {
  clearTimeout($.data(this, 'timer'));
  if (event.keyCode == 13) {
    makeSearchRequest();
  }
  else {
    $(this).data('timer', setTimeout(makeSearchRequest, 500));
  }
}

function makeSearchRequest() {
  let searchQuery = $("#searchBarView").val();
  if (allFieldsAreSet(searchQuery)) {
    var searchByNameReq = $.post(baseUrl + "/apis/searchStudent.php", {
      type: searchBy,
      uid: me_data.uid,
      inputKeyWord: searchQuery,
      limit: maxRows,
      sessionName: sessionSelect
    });


    searchByNameReq.done(function (searchByNameRes) {
      try {
        var searchResult = JSON.parse(searchByNameRes);
        createResultView(searchResult, searchQuery);
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }
    });

    searchByNameReq.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
  }
  else {
    removeResults();
  }
}



function allFieldsAreSet(searchQuery) {
  if ((searchBy != null && maxRows != null && sessionSelect != null)) {
    document.getElementById('errorMessage').style.display = "none";
    ErrorIsVisible = false;
    return true;
  }
  else {
    if (ErrorIsVisible == null || ErrorIsVisible == false) {
      document.getElementById('errorMessage').style.display = "block";
      document.getElementById('errorMessage').innerText = "Please select accedamic year and search methord";
      ErrorIsVisible = true;
    }
    return false;
  }
}


function createResultView(searchResult, searchStr) {
  removeResults();
  if (searchResult.length == 0 || searchStr == "") {
    resultView = `<div class="row collapsible">
                      <div class="text-center" style="background:var(--btnColor1)"><h4 style="background:var(--btnColor1)">No Result Found</h4>
                      </div>
                  </div>`;
    document.getElementById("searchResultHolder").innerHTML = resultView;
  }
  else {
    for (var itr in searchResult) {
      if (itr == maxRows) {
        break;
      }
      if (!forReceipt) {
        resultView = `<div class="row collapsible" onclick="viewStudent(this)">
        <div style="display: none;" id="studID`+ itr + `"></div>
        <div style="display: none;" id="studClassId`+ itr + `"></div>
           <div class="col-rmd-1" style="background:var(--btnColor1)">
             <img style="width: 50px; height: 50px; border-radius: 50%" id="studentImg`+ itr + `">
           </div>
           <div class="col-rmd-11" style="background:var(--btnColor1)">
             <div class="row" style="font-size: 18px">
               <div class="col-rmd-8" id="studentName`+ itr + `" style="background:var(--btnColor1)">
                 
               </div>
               <div class="col-rmd-4" style="background:var(--btnColor1); text-align: right; padding-right:1%" id="studentClassNSection`+ itr + `">
                
               </div>
             </div>
             <div class="row" style="background:var(--btnColor1)">
               <div class="col-rmd-1" style="background:var(--btnColor1)" id="admissionNumber`+ itr + `" ></div>
               <div class="col-rmd-2" style="background:var(--btnColor1)" id="isDisabled`+ itr + `" ></div>
              
             </div>
           </div> 
        </div>
        <div class="row content" id="searchContent`+ itr + `">
           
        </div>`;
      }
      else if(forReceipt && searchResult[itr].isDisabled == 0){
        resultView = `<div class="row collapsible" onclick="selectedStudent(this)">
      <div style="display: none;" id="studID`+ itr + `"></div>
      <div style="display: none;" id="studClassId`+ itr + `"></div>
         <div class="col-rmd-1" style="background:var(--btnColor1)">
           <img style="width: 50px; height: 50px; border-radius: 50%" id="studentImg`+ itr + `">
         </div>
         <div class="col-rmd-11" style="background:var(--btnColor1)">
           <div class="row" style="font-size: 18px">
             <div class="col-rmd-8" id="studentName`+ itr + `" style="background:var(--btnColor1)">
               
             </div>
             <div class="col-rmd-4" style="background:var(--btnColor1);text-align: right; padding-right:1%" id="studentClassNSection`+ itr + `">
              
             </div>
           </div>
           <div class="row" style="background:var(--btnColor1)">
             <div class="col-rmd-1" style="background:var(--btnColor1)" id="admissionNumber`+ itr + `">
             <div class="col-rmd-2" style="background:var(--btnColor1)" id="isDisabled`+ itr + `" >
             </div>
            
           </div>
         </div> 
      </div>
      <div class="row content" id="searchContent`+ itr + `">
         
      </div>`;
      }
      else{
        continue;
      }

      document.getElementById("searchResultHolder").innerHTML += resultView;
      if (searchResult[itr].photo != null && searchResult[itr].photo != "") {
        document.getElementById('studentImg' + itr).src = "data:image/png;base64, " + searchResult[itr].photo;
      }
      else {
        document.getElementById('studentImg' + itr).src = baseUrl + "/img/me.png";
      }

      document.getElementById('studID' + itr).innerText = searchResult[itr].studentId;
      if(searchResult[itr].isDisabled == 1){
        document.getElementById('isDisabled' + itr).innerText = "Disabled"
        document.getElementById('isDisabled' + itr).style.color = "var(--colorDanger)";
      }      
      document.getElementById('studClassId' + itr).innerText = searchResult[itr].class;
      document.getElementById('studentName' + itr).innerHTML = searchResult[itr].firstName + " " + searchResult[itr].middleName + " " + searchResult[itr].lastName;
      document.getElementById('studentClassNSection' + itr).innerHTML = "Class " + searchResult[itr].class + " Section " + searchResult[itr].section;
      document.getElementById('admissionNumber' + itr).innerHTML = searchResult[itr].admissionNumber;
    }
  }
}


function removeResults() {
  document.getElementById("searchResultHolder").innerHTML = "";
  document.getElementById('feeInfoHolder').innerHTML = "";
}


function viewStudent(parent) {
  let id = parent.childNodes[1].innerText;
  sessionStorage.setItem('body', document.documentElement.innerHTML);
  var mode;
  if (document.getElementById("darkModeSwitch").innerText == "ON") {
    mode = "dark";
  }
  else{
    mode = "light";
  }
  document.location = baseUrl + "/studentView?studentId=" + id + "&sessionName=" + sessionSelect + "&mode=" + mode;
}

function selectedStudent(parent) {
  removeResults();
  document.getElementById("searchResultHolder").appendChild(parent);
  let classId = parent.childNodes[3].innerText;
  let id = parent.childNodes[1].innerText;
  document.getElementById('searchHeading').innerText = "Step 2 : Click + to genrerate new receipt";
  getFeesDetails(id, classId); // in generateReceipt Module
}







// EXtras
