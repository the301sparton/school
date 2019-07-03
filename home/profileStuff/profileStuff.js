function profileSettings() {

  $('#toggleNav').dropdown('toggle');
  profileSettingsHTML = `<div class="container" id="profileSettingsHTML" style="margin-top:3%; margin-bottom: 3%; background: #f2f3f4; width: 50%; border-radius: 15px; padding: 2%">
    <div class="row" style="margin-top:3%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-8" style="text-align: center">
        <h4>Profile Settings</h4>
      </div>
    </div>

    <div class="row" style="margin-top:2%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-8">
        <label for="up_displayName">Display Name</label>
      </div>
    </div>
    <div class="row" >
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <input type="text" class="form-control" id="up_displayName">
      </div>
    </div>

    <div class="row"style="margin-top:2%">
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <label for="up_mobileNumber">Mobile Number</label>
      </div>
    </div>
    <div class="row" >
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <input type="text" class="form-control" id="up_mobileNumber">
      </div>
    </div>

    <div class="row" style="margin-top:2%">
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <label for="up_emailId">Email - Id</label>
      </div>
    </div>
    <div class="row" >
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <input type="text" class="form-control" id="up_emailId">
      </div>
    </div>
    <div class="row" style="margin-top:2%">
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <button style="float: left" class="btn btn-primary" onclick="updateMe()">Update</button>
      </div>
    </div>
  </div>`;

  document.getElementById("section_main").innerHTML = profileSettingsHTML;
  setProfileDetails();
}

function setProfileDetails() {
  document.getElementById("up_displayName").value = me_data.displayName;
  document.getElementById("up_mobileNumber").value = me_data.mobileNumber;
  document.getElementById("up_emailId").value = me_data.eid;
}

function updateMe() {
  $.post(baseUrl + "/apis/User.php", {
    type: "updateUser",
    uid: me_data.uid,
    displayName: document.getElementById("up_displayName").value,
    eid: document.getElementById("up_emailId").value,
    mobileNumber: document.getElementById("up_mobileNumber").value
  }).done(function(updateMeRes){
    if(updateMeRes == 200){
      alert("Updated Successfully, Press Ok to refresh.");
      location.reload();
    }
    else{
      alert("Failed to update :(");
    }
  });
}