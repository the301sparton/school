function addQuestion() {
    setActiveColor("addQuestion");
    document.getElementById("HTMLHolder").innerHTML = `
    <div class="text-center">
    <h5>Add Qestions</h5>
    <hr>

    <div class="container" id="addQuestionsSubjectSelector" style="padding-bottom:3%">
        <div class="row">
            <div class="col-rmd-3"><label for="subject_aq">Select Subject</label></div>

            <div class="col-rmd-3">
                <Select id ="subject_aq" class="form-control" onchange="loadLevelForSub(this.value)">
                    <option selected disabled value="">Select Subject</option>
                </Select>
            </div>

            <div class="col-rmd-3"><label for="level_aq">Select Level</label></div>

            <div class="col-rmd-3">
                <Select id ="level_aq" class="form-control" onchange="loadQList()">
                    <option selected disabled value="">Select Level</option>
                </Select>
            </div>
        </div>
        <div class="row" id="QListHolder" style="margin-top:3%">
        </div>

    </div>

</div>`;
    loadSubjectSelect();
}

function loadSubjectSelect() {
    $.ajax({
        type: "POST",
        url: baseUrl + "/apis/createSubject.php",
        data: {
            type: "getSubNameList",
            uid: user.uid
        },
        success: function (msg) {
            let data = JSON.parse(msg);
            for (index in data) {
                $('#subject_aq')
                    .append($('<option>', { value: data[index].subject })
                        .text(data[index].subject));
            }
        }
    });
}

function loadLevelForSub(subject){
    $.ajax({
        type: "POST",
        url: baseUrl + "/apis/createSubject.php",
        data: {
            type: "getLevelNameList",
            subject: subject,
            uid: user.uid
        },
        success: function (msg) {
            let data = JSON.parse(msg);
            $('#level_aq')
            .find('option')
            .remove()
            .end().append('<option value="" selected disabled>Select Level</option>').val('');

            for (index in data) {
                $('#level_aq')
                    .append($('<option>', { value: data[index].level })
                        .text(data[index].level));
            }
        }
    });
}

function loadQList(){
    $.ajax({
        type: "POST",
        url: baseUrl + "/apis/addQuestion.php",
        data: {
            type: "getQforSNL",
            subject: document.getElementById("subject_aq").value,
            level: document.getElementById("level_aq").value,
            uid: user.uid
        },
        success: function (msg) {
            let data = JSON.parse(msg);
            console.log(data);
            document.getElementById("QListHolder").innerHTML = "";
            if(data.length > 0){
                for(itr in data){
                    var QuesHTML= `<div class="container">
                    <div class="container collapsible" style="padding:2%" id="item` + itr + `" data-toggle="collapse" data-target="#data` + itr + `">
                    <div class = "row">`;
                       if(data[itr].questionIsImage == 1){
                        QuesHTML += `<div class="col-md-12" style="background:var(--btnColor1); text-align:left;"> <img height="300" width="600" id="question` + itr + `"></div>`
                       }
                       else{
                           QuesHTML += `<div class="col-md-12" style="background:var(--btnColor1); text-align:left; font-size:large" id="question` + itr + `"></div>`
                       }

                    if(data[itr].optType == 1 || data[itr].optType == 2){
                        QuesHTML += `
                        </div>
                        </div>

                        <div id="data` + itr + `" class="collapse" style="padding:2%; border-radius: 15px; margin-left:2%; margin-right:2%">
                        <h6>Select from below options </h6>
                        <hr>

                        <div class="row">
                            <div class="col-md-6" style="padding:2%" id="opt1` + itr + `">
                            </div>
                            <div class="col-md-6" style="padding:2%" id="opt2` + itr + `">
                            </div>
                        </div>
        
                        <div class="row" style="margin-top:2%">   
                            <div class="col-md-6" style="padding:2%" id="opt3` + itr + `">
                            </div>
                            <div class="col-md-6" style="padding:2%" id="opt4` + itr + `">
                            </div>                     
                        </div>
                        </div>
                        </div>`;
                    }
                    else if(data[itr].optType == 3 || data[itr].optType == 4){
                        QuesHTML += `
                        </div>
                        </div>

                        <div id="data` + itr + `" class="collapse" style="padding:2%; border-radius: 15px; margin-left:2%; margin-right:2%">
                        <h6>Select from below options </h6>
                        <hr>

                        <div class="row">
                                <div class="col-md-6" style="padding:2%" >
                                    <img id="opt1` + itr + `"height="200" width="200">
                                </div>
                                <div class="col-md-6" style="padding:2%" >
                                    <img id="opt2` + itr + `"height="200" width="200">
                                </div>
                        </div>
        
                        <div class="row" style="margin-top:2%">  
                                <div class="col-md-6" style="padding:2%" >
                                    <img id="opt3` + itr + `"height="200" width="200">
                                </div>
                                <div class="col-md-6" style="padding:2%" >
                                    <img id="opt4` + itr + `"height="200" width="200">
                                </div>                      
                        </div>
                        </div>
                        </div>`;
                    }
                    document.getElementById("QListHolder").innerHTML += QuesHTML;
                   
                    if(data[itr].questionIsImage == 1){
                        document.getElementById("question"+itr).src = baseUrl + data[itr].question;
                    }
                    else{
                        document.getElementById("question"+itr).innerText = data[itr].question;
                    }

                    if(data[itr].optType == 1 || data[itr].optType == 2){
                        document.getElementById("opt1"+itr).innerText = data[itr].opt1;
                        document.getElementById("opt2"+itr).innerText = data[itr].opt2;
                        document.getElementById("opt3"+itr).innerText = data[itr].opt3;
                        document.getElementById("opt4"+itr).innerText = data[itr].opt4;
                    }
                    else if(data[itr].optType == 3 || data[itr].optType == 4){
                        document.getElementById("opt1"+itr).src = baseUrl + data[itr].opt1;
                        document.getElementById("opt2"+itr).src = baseUrl + data[itr].opt2;
                        document.getElementById("opt3"+itr).src = baseUrl + data[itr].opt3;
                        document.getElementById("opt4"+itr).src = baseUrl + data[itr].opt4;
                    }
                    document.getElementById("opt"+data[itr].answer + itr).style = "background: #48c9b0; padding:2%; color:#000";

                }
            }
        }
    });
}