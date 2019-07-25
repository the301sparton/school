stepOneHTML = `<div class="row">
    <div class="col-md-2">
     <h5> Student Detail</h5>
    </div>
    <div class="col-md-10">
      <form id="studentDetails">
        <div class="row">
          <div class="col-md-4">
            <input id="formNumber" class="form-control" type="text" placeholder="Form Number">
          </div>
          <div class="col-md-4">
            <input id="admissionNumber" class="form-control" type="text" placeholder="Admission Number" required>
          </div>
          <div class="col-md-4">
            <input id="govermentId" class="form-control" type="text" placeholder="Goverment Id">
          </div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-4">
            <input id="firstName" class="form-control" type="text" placeholder="First Name" required>
          </div>
          <div class="col-md-4">
            <input id="middleName" class="form-control" type="text" placeholder="Middle Name" required>
          </div>
          <div class="col-md-4">
            <input id="lastName" class="form-control" type="text" placeholder="Last Name" required>
          </div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-4">
            <input id="motherName" class="form-control" type="text" placeholder="Mother Name" required>
          </div>
          <div class="col-md-4">
            <input id="fatherName" class="form-control" type="text" placeholder="Father Name" required>
          </div>
          <div class="col-md-4">
            <input id="aadharNumber" maxlength="12" class="form-control" type="text" placeholder="Aadhar Number">
          </div>
        </div>

        <div class="row" style="margin-top:2%">

          <div class="col-md-4">
              <select class="form-control" id="gender">
              <option disabled value="" selected>Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
              </select>
          </div>

          <div class="col-md-1">
            <label for="stud_DOB">
              DOB
            </label>
          </div>
          <div class="col-md-3">
            <input id="stud_DOB" type="date" class="form-control">
          </div>
          
          <div class="col-md-3">
          <label for="rte" class="checklabel">Under RTE?
            <input type="checkbox" id="rte">
            <span class="checkmark"></span>
          </label>
          </div>        
        </div>

        <div class="row"style="margin-top:2%">
            <div class="col-md-2">
              <label for="placeOfBirth">Place of birth</label>
            </div>  
            <div class="col-md-10"><hr></div>
        </div>

          <div class="row" style="margin-top:2%">      
          <div class="col-md-4">
            <input id="pob_city" type="text" class="form-control"  placeholder="(City)">
          </div>

          <div class="col-md-4">
            <input id="pob_dist" type="text" class="form-control"  placeholder="(District)">
          </div>

          <div class="col-md-4">
          <select id="pob_state" class="form-control">
            <option disabled value="" selected>(State)</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
            <option value="Daman and Diu">Daman and Diu</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Orissa">Orissa</option>
            <option value="Pondicherry">Pondicherry</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttaranchal">Uttaranchal</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>

        </div>

        <div class="row" style="margin-top:2%">
            <div class="col-md-10"><hr></div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-4">
            <select id="religion" class="form-control" type="text" placeholder="Religion" required>
                <option value="" selected="selected" disabled="disabled">Select Religion</option>
                <option value="Atheist">Atheist</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Christian">Christian</option>
                <option value="Hindu">Hindu</option>
                <option value="Islam">Islam</option>
                <option value="Muslim">Muslim</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Other">Other</option>
            </select>
          </div>

        <div class="col-md-4">
          <input class = "form-control" id="caste" type="text" placeholder="Caste">
         </div>

          <div class="col-md-4">
            <select id="category" class="form-control" type="text" placeholder="Select Category" required>
              <option value="" selected disabled>Select Category / Race</option>
              <option value="OPEN">OPEN</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="SBC">SBC</option>
              <option value="VJ">VJ</option>
              <option value="NT-A">NT-A</option>
              <option value="NT-B">NT-B</option>
              <option value="NT-C">NT-C</option>
              <option value="NT-D">NT-D</option>
            </select>
          </div>
          
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-6">
            <input id="nationality" class="form-control" type="text" placeholder="Nationality" value="Indian" required>
          </div>
          <div class="col-md-6">
            <input id="motherTounge" class="form-control" type="text" placeholder="Mother Tounge" required>
          </div>
        </div>

        <div class="row" style="margin-top:2%">
          <div class="col-md-6">
            <input id="lastSchool" class="form-control" type="text" placeholder="Last School">
          </div>
          <div class="col-md-6">
            <input id="lastClass" class="form-control" type="text" placeholder="Last Class">
          </div>
        </div>

        <div class="row" style="margin-top:3%">
          <div class="col-md-3">
            <label for="stud_DOA">
              Date of admission
            </label>
          </div>
          <div class="col-md-4">
            <input id="stud_DOA" class="form-control" type="date" required>
          </div>
          <div class="col-md-5">
            <label for="submittedTC" class="checklabel">Submited TC / Birth Certificate
              <input type="checkbox" id="submittedTC">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>

        <div class="row" style="margin-top: 2%">
          <div class="col-md-10"></div>
          <div class="col-md-2">
            <button class="btn btn-primary" type="submit" id="step_one_next" disabled>Next</button>
          </div>
        </div>
      </form>
    </div>
  </div>`;


//stepOne START
function stepOne() {
  document.getElementById('loader').style.display = "block";
  document.getElementById('step_container').innerHTML = stepOneHTML;
  //Read from db
  if (document.getElementById('studID').innerText != "") {
    setStudentDetails();
  }
  else{
    $('#step_one_next').removeAttr('disabled');
    document.getElementById('loader').style.display = "none";
  }


  $("#studentDetails").submit(function (event) {
    event.preventDefault();
    if (document.getElementById('studID').innerText == "") {
      CreateNewStudent();
    }
    else {
      updateStudentDetails();
    }
  });
}

function setStudentDetails() {
  var setStudentDetailsReq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "getStudentDetailsById",
    studentId: document.getElementById('studID').innerText
  });

  setStudentDetailsReq.done(function (setStudentDetailsRes) {
    studentDetail = JSON.parse(setStudentDetailsRes);
    document.getElementById('formNumber').value = studentDetail.formNumber;
    document.getElementById('admissionNumber').value = studentDetail.admissionNumber;
    document.getElementById('govermentId').value = studentDetail.govermentId;
    document.getElementById('firstName').value = studentDetail.firstName;
    document.getElementById('middleName').value = studentDetail.middleName;
    document.getElementById('lastName').value = studentDetail.lastName;
    document.getElementById('motherName').value = studentDetail.motherName;
    document.getElementById('fatherName').value = studentDetail.fatherName;
    document.getElementById('gender').value = studentDetail.gender;
    document.getElementById('aadharNumber').value = studentDetail.aadharNumber;
    document.getElementById('stud_DOB').value = studentDetail.dob;
    document.getElementById('pob_city').value = studentDetail.pob_city;
    document.getElementById('pob_dist').value = studentDetail.pob_dist;
    document.getElementById('pob_state').value = studentDetail.pob_state;
    document.getElementById('religion').value = studentDetail.religion;
    document.getElementById('category').value = studentDetail.category;
    document.getElementById('caste').value = studentDetail.caste;
    document.getElementById('nationality').value = studentDetail.nationality;
    document.getElementById('motherTounge').value = studentDetail.motherTounge;
    document.getElementById('lastSchool').value = studentDetail.lastSchool;
    document.getElementById('lastClass').value = studentDetail.lastClass;
    document.getElementById('stud_DOA').value = studentDetail.doa;

    if (studentDetail.submittedTC == 1) {
      document.getElementById("submittedTC").checked = true;
    }
    else {
      document.getElementById("submittedTC").checked = false;
    }

    if (studentDetail.rte == 1) {
      document.getElementById("rte").checked = true;
    }
    else {
      document.getElementById("rte").checked = false;
    }
    $('#step_one_next').removeAttr('disabled');
    document.getElementById('loader').style.display = "none";
  });
}

function CreateNewStudent() {
  var submittedTC = getCheckBoxValue("submittedTC");
  var rte = getCheckBoxValue("rte");
  var newStudentDetailReq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "newStudentDetails",
    formNumber: document.getElementById('formNumber').value,
    admissionNumber: document.getElementById('admissionNumber').value,
    govermentId: document.getElementById('govermentId').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    lastName: document.getElementById('lastName').value,
    motherName: document.getElementById('motherName').value,
    fatherName: document.getElementById('fatherName').value,
    gender: document.getElementById('gender').value,
    aadharNumber: document.getElementById('aadharNumber').value,
    dob: document.getElementById('stud_DOB').value,
    pob_city: document.getElementById('pob_city').value,
    pob_dist: document.getElementById('pob_dist').value,
    pob_state: document.getElementById('pob_state').value,
    religion: document.getElementById('religion').value,
    category: document.getElementById('category').value,
    caste: document.getElementById('caste').value,
    nationality: document.getElementById('nationality').value,
    motherTounge: document.getElementById('motherTounge').value,
    lastSchool: document.getElementById('lastSchool').value,
    lastClass: document.getElementById('lastClass').value,
    doa: document.getElementById('stud_DOA').value,
    submittedTC: submittedTC,
    sessionName: currentSession,
    rte: rte,
  });

  newStudentDetailReq.done(function (newStudentDetailRes) {
    console.log(newStudentDetailRes)
    var responce = JSON.parse(newStudentDetailRes);
    
    if (responce.resCode == 200) {
      document.getElementById('studID').innerText = responce.id;
      stepTwo();
    }
    else {
      alert("Failed. Make sure this Admission Number is never used before");
    }
  });
}

function updateStudentDetails() {
  var submittedTC = getCheckBoxValue("submittedTC");
  var rte = getCheckBoxValue("rte");
  var newStudentDetailReq = $.post(baseUrl + "/apis/studentInfo.php", {
    type: "updateStudentId",
    studentId: document.getElementById('studID').innerText,
    formNumber: document.getElementById('formNumber').value,
    admissionNumber: document.getElementById('admissionNumber').value,
    govermentId: document.getElementById('govermentId').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    lastName: document.getElementById('lastName').value,
    motherName: document.getElementById('motherName').value,
    fatherName: document.getElementById('fatherName').value,
    gender: document.getElementById('gender').value,
    aadharNumber: document.getElementById('aadharNumber').value,
    dob: document.getElementById('stud_DOB').value,
    pob_city: document.getElementById('pob_city').value,
    pob_dist: document.getElementById('pob_dist').value,
    pob_state: document.getElementById('pob_state').value,
    religion: document.getElementById('religion').value,
    category: document.getElementById('category').value,
    caste: document.getElementById('caste').value,
    nationality: document.getElementById('nationality').value,
    motherTounge: document.getElementById('motherTounge').value,
    lastSchool: document.getElementById('lastSchool').value,
    lastClass: document.getElementById('lastClass').value,
    doa: document.getElementById('stud_DOA').value,
    submittedTC: submittedTC,
    rte: rte,
  });

  newStudentDetailReq.done(function (newStudentDetailRes) {
    if (newStudentDetailRes == 200) {
      stepTwo(false);
    }
    else {
      console.log(newStudentDetailRes)
      alert("Failed. Make sure this Admission Number is never used before");
    }
  });
}
//StepOne End
