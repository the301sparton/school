
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
    <div class="row" style="margin-top:3%">
        <div class="col-md-6">
          <input id="sessionTotalFees" class="form-control" type="text" placeholder="Total Session Fees" required>
        </div>
    </div>

    <div class="row" style="margin-top: 2%">
      <div class="col-md-8">
        <h7 style="text-emphasis-color: #86A3F0">All details in the form are checked & verified.</h7>
      </div>
    </div>
    <div class="row" style="margin-top: 2%">
        <div class="col-md-2">
        <button class="btn btn-secondary" type="button" onclick="sessionDetailBack()">Back</button>
        </div>
      <div class="col-md-4">
        <button type="submit" class="btn btn-primary">Save</button>
      </div>

    </div>
  </form>
</div>
</div>`;

let imgBase;


//StepThree Start
function stepThree() {
  document.getElementById('step_container').innerHTML = stepThreeHTML;
  var getClassListReq = $.post(baseUrl + "/apis/classList.php", {
    type: "getClassList"
  });

  getClassListReq.done(function (classListRes) {
    classList = JSON.parse(classListRes);
    for (index in classList) {
      $('#sessionClass')
        .append($('<option>', { value: classList[index].className })
          .text(classList[index].className
          ));
    }
    var getSectionListReq = $.post(baseUrl + "/apis/sectionList.php", {
      type: "getSectionList"
    });
    getSectionListReq.done(function (sectionListRes) {
      sectionList = JSON.parse(sectionListRes);
      for (index in sectionList) {
        $('#sessionSection')
          .append($('<option>', { value: sectionList[index].sectionName })
            .text(sectionList[index].sectionName
            ));
      }
      setSessionEntry();
    });
  });

  $("#sessionDetails").submit(function (event) {
    event.preventDefault();
    if (document.getElementById('detId').innerText == "") {
      newSessionEntry(true)
    }
    else {
      updateSessionEntry(true)
    }
  });
}

function setSessionEntry() {

  $("#img_picker").change(function () {
    readURL(this);
  });
  var setSessionEntryReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "getByStudentId",
    sessionName: currentSession,
    studentId: document.getElementById("studID").innerText
  });
  setSessionEntryReq.done(function (setSessionEntryRes) {
    if (setSessionEntryRes != "null") {
      var responce = JSON.parse(setSessionEntryRes);
      document.getElementById("detId").innerText = responce.id;
      document.getElementById("studID").innerText = responce.studentId;
      document.getElementById("sessionClass").value = responce.class;
      document.getElementById("sessionSection").value = responce.section;
      document.getElementById("sessionMedium").value = responce.medium;
      document.getElementById("sessionTotalFees").value = responce.totalFees;
      document.getElementById("studentImg").src = "data:image/png;base64, " + responce.photo;
      imgBase = responce.photo;
    }
  });
}

function newSessionEntry(toReturn) {
  let imgBaseEncode
  if (imgBase == null) {
    imgBaseEncode = ""
  }
  else {
    imgBaseEncode = imgBase;
  }
  document.getElementById('loader').style.display = "block";
  var newSessionEntryReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "newRecordBySessionName",
    studentId: document.getElementById("studID").innerText,
    sessionName: currentSession,
    class: document.getElementById("sessionClass").value,
    section: document.getElementById("sessionSection").value,
    medium: document.getElementById("sessionMedium").value,
    totalFees: document.getElementById("sessionTotalFees").value,
    photo: imgBaseEncode
  });
  newSessionEntryReq.done(function (newSessionEntryRes) {
    console.log(newSessionEntryRes);
    document.getElementById('loader').style.display = "none";
    if (newSessionEntryRes == 200) {
      if (toReturn) {
        alert("Student Record Saved Successfully..!");
        studentOptionsView();
      }
    }
    else {
      alert("Failed to save student record :(");
    }

  });

}

function updateSessionEntry(toReturn){
  let imgBaseEncode
  if (imgBase == null) {
    imgBaseEncode = ""
  }
  else {
    imgBaseEncode = imgBase;
  }
  document.getElementById('loader').style.display = "block";
  var newSessionEntryReq = $.post(baseUrl + "/apis/studentSessionDetail.php", {
    type: "updateSessionDetailsById",
    id: document.getElementById("detId").innerText,
    class: document.getElementById("sessionClass").value,
    section: document.getElementById("sessionSection").value,
    medium: document.getElementById("sessionMedium").value,
    totalFees: document.getElementById("sessionTotalFees").value,
    photo: imgBaseEncode
  });
  newSessionEntryReq.done(function (newSessionEntryRes) {
    console.log(newSessionEntryRes);
    document.getElementById('loader').style.display = "none";
    if (newSessionEntryRes == 200) {
      if (toReturn) {
        alert("Student Record Saved Successfully..!");
        studentOptionsView();
      }
    }
    else {
      alert("Failed to save student record :(");
    }

  });
}


function sessionDetailBack() {
  if (document.getElementById('detId').innerText == "") {
    newSessionEntry(true)
  }
  else {
    updateSessionEntry(true)
  }
  stepTwo();

}
//StepThree End

