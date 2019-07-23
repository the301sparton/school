function registerStudent(){
    currentStudentOption = "registerStudent";
    setActiveColorsStudent("registerStudent");

    registerHTML = `<div class="container" id="registerStudent">
                            <div class="text-center">
                                <h4>Register Student</h4>
                                <hr>
                            </div>
                            <div style="display: none;" id="studID"></div>
                            <div id="step_container">
                                    
                            </div>
                    </div>`;

    document.getElementById('studentActionHolder').innerHTML = registerHTML;
   stepOne();
}



//Extras

function makeAddressSame(){
    document.getElementById("permanentAddress").value = document.getElementById("localAddress").value;
    document.getElementById("permanentState").value = document.getElementById("localState").value;
    document.getElementById("permanentCity").value = document.getElementById("localCity").value;
    document.getElementById("permanentPincode").value = document.getElementById("localPincode").value;
}

function getCheckBoxValue(Boxid){
    var temp;
    var isChecked = document.getElementById(Boxid).checked;
    if(isChecked){
        temp = 1;
    }
    else{
        temp = 0;
    }
    return temp;
}

function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
          $('#studentImg').attr('src', e.target.result);
           imgBase = e.target.result.split(",")[1];
      };
      reader.readAsDataURL(input.files[0]);
      
  }
}
