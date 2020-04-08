function createSubject() {
    setActiveColor("createSubject");
    document.getElementById("HTMLHolder").innerHTML = `
    <div class="text-center">
    <h5>Create Subjects / Levels</h5>
    <hr>

    <div class="container" id="manageHeadsHolder">
    </div>

    

</div>`;

    loadSubjectList();
}


function loadSubjectList() {
    $.ajax({
        type: "POST",
        url: baseUrl + "/apis/createSubject.php",
        data: {
            type: "getSubList",
            uid: user.uid
        },
        success: function (msg) {
            let data = JSON.parse(msg);
            makeSubjectView(data);
        }
    });
}

function makeSubjectView(data) {
    document.getElementById("manageHeadsHolder").innerHTML = "";
    addBtnHtml = `<div class="row" style="margin-bottom:2%">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="fa fa-plus button button6" style="border-radius:50%; padding:20%" onclick="openSubjectModal()"></i>
   
    </div>
    </div>`;
    if (data.length > 0) {
        for (itr in data) {
            var html = `<div class="row collapsible" onclick="openSubjectModal(true, this.childNodes[1].innerText)" style="padding-left:3%">
            <div style="display: none;" id="subId`+ itr + `"></div>
               <div class="col-rmd-11" style="background:var(--btnColor1)">
                 <div class="row" style="font-size: 18px">
                   <div class="col-rmd-8" id="subName`+ itr + `" style="background:var(--btnColor1);">
                     
                   </div>

                   <div class="col-rmd-4" id="noQues`+ itr + `" style="background:var(--btnColor1);  text-align:right">
                     
                   </div>
                   
                 </div>
                 <div class="row" style="background:var(--btnColor1)">
                   <div class="col-rmd-10" style="background:var(--btnColor1)" id="subRemark`+ itr + `" ></div>
                 </div>
               </div> 
            </div>`;

            document.getElementById("manageHeadsHolder").innerHTML += html;
            document.getElementById("subId" + itr).innerText = data[itr].subjectId;
            document.getElementById("subName" + itr).innerText = "Subject Name : " + data[itr].subject + " [" + data[itr].level + "]";
            document.getElementById("subRemark" + itr).innerText = data[itr].remark;
            document.getElementById("noQues" + itr).innerText = "Available Questions : " + data[itr].noQues;
        }
    }
    else {
        document.getElementById("manageHeadsHolder").innerHTML = '';
    }
    document.getElementById("manageHeadsHolder").innerHTML += addBtnHtml;
}

function openSubjectModal(forEdit, id) {
    if (forEdit) {
        document.getElementById("editSubjectModalTitle").innerText = "Edit Subject";
        document.getElementById("btnSubModalClose").style.color = "#000";
        $.ajax({
            type: "POST",
            url: baseUrl + "/apis/createSubject.php",
            data: {
                type: "getSubById",
                id: id,
                uid: user.uid
            },
            success: function (msg) {
                let data = JSON.parse(msg);
                console.log(data);
                document.getElementById("newSubName").value = data.subject;
                document.getElementById("newLevelName").value = data.level;
                document.getElementById("SubRemark").value = data.remark;
                document.getElementById("SubId").value = data.subjectId;
                $("#editSubjectModal").modal();
            }
        });
    }
    else {
        document.getElementById("editSubjectModalTitle").innerText = "Create New Subject";
        document.getElementById("btnSubModalClose").style.color = "#000";
        document.getElementById("newSubName").value = "";
        document.getElementById("newLevelName").value = "";
        document.getElementById("SubRemark").value = "";
        document.getElementById("SubId").value = "";
        $("#editSubjectModal").modal();
    }
}

function createOrUpdateSubject() {
    var type = "";
    if (document.getElementById("editSubjectModalTitle").innerText == "Edit Subject") {
        type = "UpdateSubById";
    }
    else {
        type = "CreateSubNLevel";
    }
    document.getElementById("new_loader").style.display = "block";
    $.ajax({
        type: "POST",
        url: baseUrl + "/apis/createSubject.php",
        data: {
            type: type,
            subject: document.getElementById("newSubName").value,
            level: document.getElementById("newLevelName").value,
            remark: document.getElementById("SubRemark").value,
            subjectId: document.getElementById("SubId").value,
            uid: user.uid
        },
        success: function (msg) {
            document.getElementById("new_loader").style.display = "none";
            if (msg == 200) {
                loadSubjectList();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            document.getElementById("new_loader").style.display = "none";
        }
    });
}