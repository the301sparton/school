

let searchBy;
let maxRows;
let sessionSelect;
let ErrorIsVisible;
let forReceipt;

let searchBarView;
searchNEditHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Search Student</h4>
      <hr>
    </div>
    <div class="row">
      <div class="col-md-4">
        <input class="form-control" type="text" placeholder="Search.." onkeyup="studentSearch(this)" id="searchBarView">
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
      <div class="alert" id="errorMessage" style="display: none">
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
  if(!forReceipt){
    currentStudentOption = "searchNEdit";
    setActiveColorsStudent("searchNEdit");
    document.getElementById('studentActionHolder').innerHTML = searchNEditHTML;
  }
  else{
    document.getElementById('feesActionHolder').innerHTML = searchNEditHTML;
    document.getElementById('searchHeading').innerText = "Step 1 : Select Student";
  }
  maxRows = 5;
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
  var allSessionReq = $.post(baseUrl + "/apis/academicSession.php", {
    type: "getAllSessions"
  });

  allSessionReq.done(function (allSessions) {
    allSessions = JSON.parse(allSessions);
    for (var index in allSessions) {

      $('#sessionSelect')
        .append($('<option>', { value: allSessions[index].sessionName })
          .text(allSessions[index].sessionName
          ));
    }

  document.getElementById("sessionSelect").value = currentSession;
  sessionSelect = currentSession;
  
  
  });
}

function studentSearch(searchBar) {
  if (allFieldsAreSet()) {
    if (searchBar.value != "") {
      var searchByNameReq = $.post(baseUrl + "/apis/searchStudent.php", {
        type: searchBy,
        inputKeyWord: searchBar.value,
        limit: maxRows,
        sessionName: sessionSelect
      });

      searchByNameReq.done(function (searchByNameRes) {
        var searchResult = JSON.parse(searchByNameRes);
        createResultView(searchResult, searchBar.value);
      });
    }
    else {
      removeResults();
    }
  }
}

function allFieldsAreSet() {
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
  if(searchResult.length == 0 && searchStr!=""){
    resultView = `<div class="row collapsible">
                      <div class="text-center"><h4>No Result Found</h4>
                      </div>
                  </div>`;
                  document.getElementById("searchResultHolder").innerHTML = resultView;
  }
  for (var itr in searchResult) {
    if (itr == maxRows) {
      break;
    }
    if (!forReceipt){
      resultView = `<div class="row collapsible" onclick="viewStudent(this)">
      <div style="display: none;" id="studID`+ itr + `"></div>
      <div style="display: none;" id="studClassId`+ itr + `"></div>
         <div class="col-rmd-1">
           <img style="width: 50px; height: 50px; border-radius: 50%" id="studentImg`+ itr + `">
         </div>
         <div class="col-rmd-11">
           <div class="row" style="font-size: 18px">
             <div class="col-rmd-8" id="studentName`+ itr + `">
               
             </div>
             <div class="col-rmd-4" style="text-align: right; padding-right:1%" id="studentClassNSection`+ itr + `">
              
             </div>
           </div>
           <div class="row">
             <div class="col-rmd-8" id="admissionNumber`+ itr + `">
             </div>
            
           </div>
         </div> 
      </div>
      <div class="row content" id="searchContent`+ itr + `">
         
      </div>`;
    }
    else{
      resultView = `<div class="row collapsible" onclick="selectedStudent(this)">
    <div style="display: none;" id="studID`+ itr + `"></div>
    <div style="display: none;" id="studClassId`+ itr + `"></div>
       <div class="col-rmd-1">
         <img style="width: 50px; height: 50px; border-radius: 50%" id="studentImg`+ itr + `">
       </div>
       <div class="col-rmd-11">
         <div class="row" style="font-size: 18px">
           <div class="col-rmd-8" id="studentName`+ itr + `">
             
           </div>
           <div class="col-rmd-4" style="text-align: right; padding-right:1%" id="studentClassNSection`+ itr + `">
            
           </div>
         </div>
         <div class="row">
           <div class="col-rmd-8" id="admissionNumber`+ itr + `">
           </div>
          
         </div>
       </div> 
    </div>
    <div class="row content" id="searchContent`+ itr + `">
       
    </div>`;
    }
    
    document.getElementById("searchResultHolder").innerHTML += resultView;
    if(searchResult[itr].photo != null && searchResult[itr].photo !=""){
      document.getElementById('studentImg' + itr).src = "data:image/png;base64, " + searchResult[itr].photo;
    }
    else{
      document.getElementById('studentImg' + itr).src = baseUrl+"/img/me.png";
    }
   
    document.getElementById('studID' + itr).innerText = searchResult[itr].studentId;
    document.getElementById('studClassId'+itr).innerText = searchResult[itr].class;
    document.getElementById('studentName' + itr).innerHTML = searchResult[itr].firstName + " " + searchResult[itr].middleName + " " + searchResult[itr].lastName;
    document.getElementById('studentClassNSection' + itr).innerHTML = "Class " + searchResult[itr].class + " Section " + searchResult[itr].section;
    document.getElementById('admissionNumber' + itr).innerHTML = searchResult[itr].admissionNumber;
  }
}


function removeResults() {
  document.getElementById("searchResultHolder").innerHTML = "";
  document.getElementById('feeInfoHolder').innerHTML = "";
}


function viewStudent(parent) {
  let id = parent.childNodes[1].innerText;
  document.location = baseUrl + "/studentView?studentId=" + id + "&sessionName=" + sessionSelect;
}

function selectedStudent(parent){
 removeResults();
 //console.log(parent);
 document.getElementById("searchResultHolder").appendChild(parent);
 let classId = parent.childNodes[3].innerText;
 let id = parent.childNodes[1].innerText;
 document.getElementById('searchHeading').innerText = "Step 2 : Click + to genrerate new receipt";
 getFeesDetails(id, classId); // in generateReceipt Module
}







// EXtras
