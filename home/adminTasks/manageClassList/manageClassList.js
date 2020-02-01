
function manageClassList() {
    setActiveColorsAdminTasks("manageClassList");
    let manageClassListHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Class List</h5>
          <hr>
    </div>
    <div class="container" style="padding: 1%">
    
    <div id="jsGrid" style = "display:none" ></div>
    <div class="row" style="margin-top:2%">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="fa fa-plus button button6" style="border-radius:50%; padding:20%" onclick="showClassListDetailsDialog()"></i>
   
    </div>
    </div>
    
    </div>`;
    document.getElementById('adminActionHolder').innerHTML = manageClassListHTML;

    getClassListToShow();
    setValuesInSchoolListSelect();

}

function getClassListToShow() {
    document.getElementById("new_loader").style.display = "block";
    document.getElementById('jsGrid').style.display = "none";
    let classListReq = $.post(baseUrl + "/apis/classList.php", {
        type: "getClassList"
    });
    classListReq.done(function (responce) {
        document.getElementById('jsGrid').style.display = "block";
        $("#jsGrid").jsGrid({
            width: "100%",
            inserting: false,
            editing: false,
            sorting: false,
            paging: true,
            fields: [{ name: "schoolName", title: "School Name", type: "text", width: 120 },
            { name: "className", title: "Class Name", type: "text", width: 140 },
            { name: "section", title: "Section", type: "text", width: 120 },
            { name: "displayName", title: "Class Teacher", type: "text", width: 120 },
            ],
            rowClick: function (args) {
                showClassListDetailsDialog(args.item, true);
            },
            data: JSON.parse(responce)
        });
        document.getElementById("new_loader").style.display = "none";
    });
    classListReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    }
    );
}

function showClassListDetailsDialog(args, forEdit) {
    let getTeacherList = $.post(baseUrl + "/apis/classList.php", {
        type: "getUserList"
    });

    getTeacherList.done(function (responce) {

        let teacherList = JSON.parse(responce)
        setValuesInClassTeacherSelect(teacherList);

        if (forEdit) {
            document.getElementById("classListModalTitel").innerHTML = '<h4>Edit Class Details</h4>'
            document.getElementById("newClassName").value = args.className;
            document.getElementById("newClassName").disabled = true;
            document.getElementById("newClassSection").value = args.section;
            document.getElementById("newClassSection").disabled = true;
            document.getElementById('newClassTeacher').value = args.uid;
            document.getElementById("newSchoolId").value = args.schoolId;
            document.getElementById("classDeleteBtn").style.display = "block";
        }
        else {
            document.getElementById("newClassName").disabled = false;
            document.getElementById("newClassSection").disabled = false;
            document.getElementById("classDeleteBtn").style.display = "none";
            document.getElementById("newClassName").value = '';
            document.getElementById("newClassSection").value = '';
            document.getElementById("classListModalTitel").innerHTML = '<h4>Create New Class</h4>'
        }

        $("#addEditClassList").modal();
    });

    getTeacherList.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });

}

function setValuesInClassTeacherSelect(teacherList) {
    $('#newClassTeacher').empty();
    $('#newClassTeacher').append($('<option>', {
        value: "",
        text: "Select Class Teacher",
        selected: true,
        disabled: true
    }, '</option>'));
    for (var index in teacherList) {
        $('#newClassTeacher')
            .append($('<option>', {
                value: teacherList[index].uid,
                text: teacherList[index].displayName,
            }, '</option>'));
    }
}

function setValuesInSchoolListSelect() {
    document.getElementById("new_loader").style.display = "block";
    let schoolreq = $.post(baseUrl + "/apis/classList.php", {
        type: "getAllSchools"
    });

    schoolreq.done(function (responce) {
        let schoolArray = JSON.parse(responce);
        $('#newSchoolId').empty();
        $('#newSchoolId').append($('<option>', {
            value: "",
            text: "Select School",
            selected: true,
            disabled: true
        }, '</option>'));
        for (var index in schoolArray) {
            $('#newSchoolId')
                .append($('<option>', {
                    value: schoolArray[index].schoolId,
                    text: schoolArray[index].schoolName,
                }, '</option>'));
        }
        document.getElementById("new_loader").style.display = "none";           
    });

    schoolreq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}


function deleteClassListItem() {
    document.getElementById("new_loader").style.display = "block";
    let deleteClassListItemReq = $.post(baseUrl + "/apis/classList.php", {
        type: "deleteClassItem",
        className: document.getElementById("newClassName").value,
        section: document.getElementById("newClassSection").value
    });

    deleteClassListItemReq.done(function (responce) {
        if (responce == 200) {
            showNotification("Success!", "Class Deleted Successfully", "success");
            getClassListToShow();
        }
        else if (responce == 300) {
            showNotification("Error!", "Class is in use", "danger");
        }
        else {
            showNotification("Error!", "Failed to delete Class", "danger");
        }
        document.getElementById("new_loader").style.display = "none";
    });

    deleteClassListItemReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
}

function createOrUpdateClass() {
    if (document.getElementById("classListModalTitel").innerHTML.includes("Create")) {

        let classListVal = document.getElementById("newClassName").value;
        let sectionVal = document.getElementById("newClassSection").value;
        let teacherIdVal = document.getElementById('newClassTeacher').value;
        let schoolIdVal = document.getElementById("newSchoolId").value;
        if (classListVal != "" && sectionVal != "" && teacherIdVal != "") {
            document.getElementById("new_loader").style.display = "block";
            let insertClassReq = $.post(baseUrl + "/apis/classList.php", {
                type: "insertClass",
                className: classListVal,
                section: sectionVal,
                schoolId: schoolIdVal,
                teacherId: teacherIdVal
            });

            insertClassReq.done(function (responce) {
                if (responce == 200) {
                    showNotification("Success!", "Class Created Successfully", "success");
                    getClassListToShow();
                }
                else {
                    console.log(responce);
                    showNotification("Error!", "Class & Section together must be unique", "danger");
                }
                document.getElementById("new_loader").style.display = "none";
            });

            insertClassReq.fail(function (jqXHR, textStatus) {
                document.getElementById("new_loader").style.display = "none";
                handleNetworkIssues(textStatus)
            });
        }

        else {
            showNotification("Error!", "Class, Section and teacher must be selected", "warning");
        }

    }
    else {

        let classListVal = document.getElementById("newClassName").value;
        let sectionVal = document.getElementById("newClassSection").value;
        let teacherIdVal = document.getElementById('newClassTeacher').value
        let schoolIdVal = document.getElementById("newSchoolId").value;

        document.getElementById("new_loader").style.display = "block";
        let updateClassTeacherReq = $.post(baseUrl + "/apis/classList.php", {
            type: "updateClass",
            className: classListVal,
            teacherId: teacherIdVal,
            schoolId: schoolIdVal,
            section: sectionVal
        });

        updateClassTeacherReq.done(function (responce) {
            if (responce == 200) {
                showNotification("Success!", "Class Teacher Updated Successfully", "success");
                manageClassList();
            }
            else {
                console.log(responce);
                showNotification("Error!", "Failed to delete Class", "danger");
            }
            document.getElementById("new_loader").style.display = "none";
        });

        updateClassTeacherReq.fail(function (jqXHR, textStatus) {
            document.getElementById("new_loader").style.display = "none";
            handleNetworkIssues(textStatus)
        });
    }
}

//Handle UPDATE CREATE