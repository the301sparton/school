let isFirstUpdateProfileListener = true;
let updatedProfileImage = '';
let imageDataChanged = false;

function profileSettings() {
    $('#toggleNav').dropdown('toggle');
    profileSettingsHTML = `<div class="container" id="profileSettingsHTML" style="background: var(--btnColor3); margin-top:3%; margin-bottom: 3%; border-radius: 15px; padding: 5%">
  <form id="profileUpdateForm">  
  <div class="row" style="margin-top:3%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-8" style="text-align: center">
        <h4>Profile Settings</h4>
        <hr>
      </div>
    </div>

    <div class="row" style="margin-top:3%">
        <div class="col-rmd-2"></div>
        <div class="col-rmd-2">
            <img id="myProfileImgForUpdate" style="border-radius: 50%; height: 60px; width: 60px"> 
        </div>
    </div>

    <div class="row" style="margin-top:2%">
      <div class="col-rmd-2"></div>
      <div class="col-rmd-3">
        <input type="file" accept="image/*" id="img_pickerUpdateProfileImage">
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
        <input style="background-color: var(--colorPrimary);" type="text" class="form-control" id="up_displayName">
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
        <input style="background-color: var(--colorPrimary);" type="text" class="form-control" id="up_mobileNumber" maxlength="10" pattern="[789][0-9]{9}" required>
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
        <input style="background-color: var(--colorPrimary);" type="email" class="form-control" id="up_emailId">
      </div>
    </div>
    <div class="row" style="margin-top:2%">
    <div class="col-rmd-2"></div>
    <div class="col-rmd-8">
        <button type="submit" style="float: left; `+CSSbtnPrimary+`" class="btn btn-primary">Update</button>
      </div>
    </div>
    </form>
  </div>`;

    document.getElementById("section_main").innerHTML = profileSettingsHTML;
    setProfileDetails();
    updatedProfileImage = me_data.photo;
    if (isFirstUpdateProfileListener) {
        updateProfileListener();
        isFirstUpdateProfileListener = false;
    }
}

function setProfileDetails() {
    document.getElementById("up_displayName").value = me_data.displayName;
    document.getElementById("up_mobileNumber").value = me_data.mobileNumber;
    document.getElementById("up_emailId").value = me_data.eid;
    document.getElementById("myProfileImgForUpdate").src = me_data.photo;
}

function updateProfileListener() {

    $("#img_pickerUpdateProfileImage").change(function() {
        let input = document.getElementById("img_pickerUpdateProfileImage");
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#img_pickerUpdateProfileImage').attr('src', e.target.result);
                updatedProfileImage = e.target.result;
                document.getElementById('myProfileImgForUpdate').src = updatedProfileImage;
                imageDataChanged = true;
            };
            reader.readAsDataURL(input.files[0]);
        }
    });


    $('#profileUpdateForm').submit(function(event) {
        event.preventDefault();
        if (document.getElementById("up_displayName").value != me_data.displayName || document.getElementById("up_emailId").value != me_data.eid || document.getElementById("up_mobileNumber").value != me_data.mobileNumber || imageDataChanged == true) {
            document.getElementById("new_loader").style.display = "block";
            let updateProfileReq = $.post(baseUrl + "/apis/User.php", {
                type: "updateUser",
                uid: me_data.uid,
                displayName: document.getElementById("up_displayName").value,
                eid: document.getElementById("up_emailId").value,
                mobileNumber: document.getElementById("up_mobileNumber").value,
                photo: updatedProfileImage
            });
            updateProfileReq.done(function(updateMeRes) {
                if (updateMeRes == 200) {
                    showNotification("<strong>Suceess</strong>", "Page will refresh", "success");
                    location.reload();
                } else {
                    showNotification("<strong>Error</strong>", "Failed to update profile", "danger");
                }
                document.getElementById("new_loader").style.display = "none";
            });
            updateProfileReq.fail(function(jqXHR, textStatus) {
                document.getElementById("new_loader").style.display = "none";
                handleNetworkIssues(textStatus)
            });

        } else {
            showNotification("<strong>!!</strong>", "No data was changed", "info");
        }
    });
}