
let imgBase;
//StepThree Start
function stepThree() {
  stepThreeHTML = ` <div class="row">
<div class="col-md-2">
  Session Detail
</div>
<div class="col-md-10">
  <form id="sessionDetails">
      <div class="row" style="margin-top:3%">
        <div class="col-md-2">
            <div style="display:none" id="detId"></div>
            <img id="studentImg" style="border-radius: 50%; height: 100px; width: 100px"> 
        </div>

        <div class="col-md-2">
            <img style="border-radius: 50%; height: 30px; width: 30px; cursor:pointer" src="`+baseUrl+`/img/ic_cross.svg" onclick="removeImg()"> 
        </div>
        
      </div>
      <div class="row" style="margin-top:3%">
          <div class="col-md-3">
              <input type="file" accept="image/*" id="img_picker">
          </div>
      </div>
    <div class="row" style="margin-top:3%">
      <div class="col-md-6">
        <select id="sessionClass" class="form-control" type="text" placeholder="Next Class" required>
            <option selected disabled value="">Select Class</option>
        </select>
      </div>
      <div class="col-md-6">
        <select id="sessionSection" class="form-control" type="text" placeholder="Section" required>
        <option selected disabled value="">Select Section</option>
        </select>
      </div>
    </div>

    <div class="row" style="margin-top:3%">
      <div class="col-md-6">
        <input id="sessionMedium" class="form-control" type="text" placeholder="Study Medium" required>
      </div>
    </div>
   

    <div class="row" style="margin-top: 2%">
      <div class="col-md-8">
        <h7 style="text-emphasis-color: #86A3F0">All details in the form are checked & verified.</h7>
      </div>
    </div>
    <div class="row" style="margin-top: 2%">
        <div class="col-md-2">
        <button class="btn btn-secondary" style="`+CSSbtnSecondary+`" type="button" onclick="sessionDetailBack()" disabled id="step_three_back">Back</button>
        </div>
      <div class="col-md-4">
        <button type="submit" class="btn btn-primary" style="`+CSSbtnPrimary+`" disabled id="step_three_save">Save</button>
      </div>

      <div class="col-md-4">
        <button type="button" id="isEnabledBtn" class="btn btn-success" style="`+CSSbtnSuccess+`" onclick="disableEnable()">Student Enabled</button>
      </div>

    </div>
  </form>
</div>
</div>`;
  document.getElementById('step_container').innerHTML = stepThreeHTML;

  $.when(loadClassForSelectId("sessionClass", "sessionSection")).then(function () {
    setSessionEntry();
  });

  $("#sessionDetails").submit(function (event) {
    event.preventDefault();
    updateSessionEntry(false);
  });
}

function disableEnable(){
  var param;
  if(document.getElementById("isEnabledBtn").innerText == "Student Enabled"){
    param = 1;
  }
  else{
    param = 0;
  }
  document.getElementById("new_loader").style.display = "block";
  var enableDisableReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "enableDisable",
    uid: me_data.uid,
    sessionName: currentSession,
    studentId: document.getElementById("studID").innerText,
    param: param
  });

  enableDisableReq.done(function(data){
    if(data == 200){
      showNotification("<strong>Success</strong>", "Data Saved Successfully", "success");
      setSessionEntry();
    }
    else {
      //showNotification("<strong>Error</strong>", "Failed to save data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  enableDisableReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus);
  });
}

function removeImg(){
  imgBase = '';
  $('#studentImg').attr('src', baseUrl+"/img/me.png");
}

function setSessionEntry() {

  $("#img_picker").change(function () {
    readURL(this);
  });
  document.getElementById("new_loader").style.display = "block";
  var setSessionEntryReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "getByStudentId",
    uid: me_data.uid,
    sessionName: currentSession,
    studentId: document.getElementById("studID").innerText
  });
  setSessionEntryReq.done(function (setSessionEntryRes) {
    if (setSessionEntryRes != "null") {
      try {
        var responce = JSON.parse(setSessionEntryRes);
        document.getElementById("detId").innerText = responce.id;
        document.getElementById("studID").innerText = responce.studentId; document.getElementById("sessionClass").value = responce.class;
        $("#sessionClass").trigger("change"); sectionNameRequest.done(function () {
          if (document.getElementById("sessionSection") != null) {
            if(responce.isDisabled == 1){
              document.getElementById("isEnabledBtn").innerText = "Student Disabled";
              document.getElementById("isEnabledBtn").className = "btn btn-danger";
              document.getElementById("isEnabledBtn").style = CSSbtnDanger+"cursor:pointer"; 
            }
            else{
              document.getElementById("isEnabledBtn").innerText = "Student Enabled";
              document.getElementById("isEnabledBtn").className = "btn btn-success";
              document.getElementById("isEnabledBtn").style = CSSbtnSuccess+"cursor:pointer"; 
            }            
            document.getElementById("sessionSection").value = responce.section;
            document.getElementById('loader').style.display = "none";
          }
        });
        document.getElementById("sessionMedium").value = responce.medium;
        if (responce.photo != "") {
          document.getElementById("studentImg").src = "data:image/png;base64, " + responce.photo;
        }
        else {
          document.getElementById("studentImg").src = baseUrl + "/img/me.png";
        }
        imgBase = responce.photo;
      }
      catch (e) {
        showNotification("Error", "Failed to get data", "danger");
      }
      document.getElementById("new_loader").style.display = "none";
    }
    $("#step_three_back").removeAttr('disabled');
    $("#step_three_save").removeAttr('disabled');

  });

  setSessionEntryReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function updateSessionEntry(toReturn) {
  let imgBaseEncode;
  if (imgBase == null) {
    imgBaseEncode = "";
  }
  else {
    imgBaseEncode = imgBase;
  }
  document.getElementById("new_loader").style.display = "block";
  var newSessionEntryReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "updateSessionDetailsById",
    uid: me_data.uid,
    id: document.getElementById("detId").innerText,
    class: document.getElementById("sessionClass").value,
    section: document.getElementById("sessionSection").value,
    medium: document.getElementById("sessionMedium").value,
    totalFees: "0",
    photo: imgBaseEncode
  });
  newSessionEntryReq.done(function (newSessionEntryRes) {
    if (newSessionEntryRes == 200) {
      if (!toReturn) {
        showNotification("<strong>Success</strong>", "Data Saved Successfully", "success");
        if (document.location.href.includes("home")) {
          studentOptionsView();
        }

      }
    }
    else {
      showNotification("<strong>Error</strong>", "Failed to save data", "danger");
    }
    document.getElementById("new_loader").style.display = "none";
  });

  newSessionEntryReq.fail(function (jqXHR, textStatus) {
    document.getElementById("new_loader").style.display = "none";
    handleNetworkIssues(textStatus)
  });
}

function sessionDetailBack() {
  updateSessionEntry(true);
  stepTwo();

}