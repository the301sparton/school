
  stepTwoHTML = `<div class="row">
  <div class="col-md-2">
    Contact Detail
  </div>
  <div class="col-md-10">
    <form id="contactDetails">
      <div class="row">
        <div class="col-md-5">
          <label for="localAddress">Local Address</label>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <textarea id="localAddress" class="form-control" rows="2" placeholder="Address" required></textarea>
        </div>
        <div class="col-md-4">
          <select id="localState" class="form-control" required>
            <option disabled value="" selected>Select State:</option>
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

      <div class="row" style="margin-top: 2%">
        <div class="col-md-6">
          <input id="localCity" class="form-control" placeholder="City" type="text" required>
        </div>
        <div class="col-md-6">
          <input id="localPincode" class="form-control" placeholder="Pincode" type="number" required>
        </div>
      </div>

      <div class="row" style="margin-top: 3%">
        <div class="col-md-4">
          <label for="same_address" class="checklabel">Both address are same
            <input id="same_address" type="checkbox" onchange="makeAddressSame()">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="col-md-8">
          <hr>
        </div>
      </div>



      <div class="row" style="margin-top: 3%">
        <div class="col-md-5">
          <label for="permanentAddress">Permenat Address</label>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <textarea id="permanentAddress" class="form-control" rows="2" placeholder="Address" required></textarea>
        </div>
        <div class="col-md-4">
          <select id="permanentState" class="form-control" required>
            <option disabled value="" selected>Select State:</option>
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

      <div class="row" style="margin-top: 2%">
        <div class="col-md-6">
          <input id="permanentCity" class="form-control" placeholder="City" type="text" required>
        </div>
        <div class="col-md-6">
          <input id="permanentPincode" class="form-control" placeholder="Pincode" type="number" required>
        </div>
      </div>

      <div class="row" style="margin-top: 3%">
        <div class="col-md-4">
          Local Guardian Details
        </div>
        <div class="col-md-8">
          <hr>
        </div>
      </div>

      <div class="row" style="margin-top: 2%">
          <div class="col-md-4">
            <input id="guardianName" type="text" placeholder="Guardian's Name" class="form-control">
          </div>
          <div class="col-md-4">
            <input id="guardianPhone" type="text" placeholder="Guardian's Phone" class="form-control" maxlength="10" pattern="[789][0-9]{9}">
          </div>
          <div class="col-md-4">
            <input id="guardianEmail" type="email" placeholder="Guardian's Email-id" class="form-control">
          </div>
        </div>

      <div class="row" style="margin-top: 2%">
        <div class="col-md-8"></div>
        <div class="col-md-2">
            <button class="btn btn-secondary" type="button" onclick="contactDetailBack()" id="step_two_back" disabled>Back</button>
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn btn-primary" disabled id="step_two_next">Next</button>
        </div>
      </div>

    </form>

  </div>
</div>`;



//StepTwo START
function stepTwo(){
  document.getElementById('loader').style.display = "block";
loadContactDetails();
document.getElementById('step_container').innerHTML = stepTwoHTML;
$("#contactDetails").submit(function(event) {         
    event.preventDefault();
    setContactDetails(true);
});
}

function loadContactDetails(){
var loadContactDetailReq = $.post(baseUrl + "/apis/studentInfo.php",{
    type: "getContactDetailsById",
    studentId: document.getElementById("studID").innerText
});

loadContactDetailReq.done(function(loadContactDetailRes){
  if(loadContactDetailRes != "null"){
    
    let cotactDetails = JSON.parse(loadContactDetailRes);
    if(cotactDetails.localAddress != ""){
      document.getElementById('localAddress').value = cotactDetails.localAddress;
    }
    if(cotactDetails.localState != ""){
      document.getElementById('localState').value = cotactDetails.localState;
    }
    if(cotactDetails.localCity!=""){
      document.getElementById('localCity').value = cotactDetails.localCity;
    }
    if(cotactDetails.localPincode!=""){
      document.getElementById('localPincode').value = cotactDetails.localPincode;
    }
    if(cotactDetails.permanentAddress!=""){
      document.getElementById('permanentAddress').value = cotactDetails.permanentAddress;
    }
    if(cotactDetails.permanentState!=""){
      document.getElementById('permanentState').value = cotactDetails.permanentState;
    }
    if(cotactDetails.permanentCity!=""){
      document.getElementById('permanentCity').value = cotactDetails.permanentCity;
    }
    if(cotactDetails.permanentPincode!=""){
      document.getElementById('permanentPincode').value = cotactDetails.permanentPincode;
    }
    if(cotactDetails.guardianName){
      document.getElementById('guardianName').value = cotactDetails.guardianName;
    }
    if(cotactDetails.guardianPhone){
      document.getElementById('guardianPhone').value = cotactDetails.guardianPhone;
    }
    if(cotactDetails.guardianEmail){
      document.getElementById('guardianEmail').value = cotactDetails.guardianEmail;
    }
    
    }
    $("#step_two_back").removeAttr('disabled');
    
    $("#step_two_next").removeAttr('disabled');
  document.getElementById('loader').style.display = "none";
});
//Comment
}

function setContactDetails(toReturn){
var setContactDetailsreq = $.post(baseUrl + "/apis/studentInfo.php",{
    type: "updateContactDetails",
    localAddress: document.getElementById('localAddress').value,
    localState: document.getElementById('localState').value,
    localCity: document.getElementById('localCity').value,
    localPincode: document.getElementById('localPincode').value,
    permanentAddress: document.getElementById('permanentAddress').value,
    permanentState: document.getElementById('permanentState').value,
    permanentCity: document.getElementById('permanentCity').value,
    permanentPincode: document.getElementById('permanentPincode').value,
    guardianName: document.getElementById('guardianName').value,
    guardianPhone: document.getElementById('guardianPhone').value,
    guardianEmail: document.getElementById('guardianEmail').value,
    studentId: document.getElementById('studID').innerText 
});
  setContactDetailsreq.done(function (setContactDetailsres) {
    if (setContactDetailsres == 200) {
      if (toReturn) {
        stepThree();
      }

    }
    else {
      alert("Failed to update data :(");
    }
  });
}

function contactDetailBack(){
setContactDetails();
stepOne();
}
//STEPTWO END