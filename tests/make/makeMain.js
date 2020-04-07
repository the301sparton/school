
let limit = [];
$(document).ready(function() {
    document.getElementById("about_websiteTitle").innerText = "Vaikunth's Eval"
    document.getElementById("loader").style.display = "none";

    firebase.auth().onAuthStateChanged(function(usr) {
        if (usr) {
           $.ajax({
               type: "POST",
               url: baseUrl+"/apis/user.php",
               data: {
                   type: "getAuth",
                   uid: usr.uid
               },
               success: function(msg) {
                let accessArray = JSON.parse(msg)[0];
                console.log(accessArray);
                if(accessArray.t_createExam == 1){
                    limit.push("createTest");
                }
                if(accessArray.t_createSubject == 1){
                    limit.push("createSubject");
                }
                if(accessArray.t_viewResult == 1){
                    limit.push("viewResult");
                }
                if(accessArray.t_addQuestion == 1){
                    limit.push("addQuestion");
                }
                StudentOptionHTML = "";
                if (accessArray.t_createExam == 1 && accessArray.t_createSubject == 1) {
                    StudentOptionHTML += `<div class="row">
                    <div class="col-rmd-5 button button1" id="createTest" onclick="createTest()">Create Test</div>
                    <div class="col-rmd-2">
          
                    </div>
                    <div class="col-rmd-5 button button2" id="createSubject" onclick="createSubject()">Create Subjects / Levels</div>
                  </div>`;
                } else if (accessArray.t_createExam == 1 && accessArray.t_createSubject == 0) {
                    StudentOptionHTML += `<div class="row">
                          
                          <div class="col-rmd-4">
                              
                          </div>
                          <div class="col-rmd-4 button button1" id="createTest" onclick="createTest()">Create Test</div>
                          </div> 
                      `;
                } else if (accessArray.t_createExam == 0 && accessArray.t_createSubject == 1) {
                    console.log("yo");
                    StudentOptionHTML += `<div class="row">
                          
                    <div class="col-rmd-4">
                        
                    </div>
                    <div class="col-rmd-4 button button2" id="createSubject" onclick="createSubject()">Create Subjects / Levels</div>
                    </div>  
                      `;
                } else {
                    //NOTHING
                }


                if (accessArray.t_viewResult == 1 && accessArray.t_addQuestion == 1) {
                    StudentOptionHTML += `<div class="row" style="margin-top: 5%;">
                    <div class="col-rmd-5 button button3" id="viewResult" onclick="viewResult()">View Results</div>
                    <div class="col-rmd-2">

                    </div>
                    <div class="col-rmd-5 button button4" id="addQuestion" onclick="addQuestion()">Add Questions</div>
                  </div>`;
                } else if (accessArray.t_viewResult == 1 && accessArray.t_addQuestion == 0) {
                    StudentOptionHTML += `<div class="row" style="margin-top: 5%;">
                          
                          <div class="col-rmd-4">
                              
                          </div>
                          <div class="col-rmd-4 button button3" id="viewResult" onclick="viewResult()">View Results</div>
                          </div> 
                      `;
                } else if (accessArray.t_viewResult == 0 && accessArray.t_addQuestion == 1) {
                    StudentOptionHTML += `<div class="row" style="margin-top: 5%;">
                          
                    <div class="col-rmd-4">
                        
                    </div>
                    <div class="col-rmd-4 button button4" id="addQuestion" onclick="addQuestion()">Add Questions</div>
                 </div>  
                      `;
                } else {
                    //NOTHING
                }

                document.getElementById("menuHolder").innerHTML = StudentOptionHTML;
              }
           })
           
        }
        else{
            document.location = baseUrl;
        }
    });
});

function setActiveColor(toSet) {
    for (i = 0; i < limit.length; i++) {
        temp = limit[i];
        itr = document.getElementById(temp);
        if (temp == toSet) {
            itr.style.background = "var(--primaryColor)";
        } else {
            itr.style.background = "var(--btnColor"+i+")";
        }
    }
}