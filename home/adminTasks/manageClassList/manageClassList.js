
function manageClassList() {
    setActiveColorsAdminTasks("manageClassList");
    let manageClassListHTML = `<div class="container">
    <div class="text-center">
          <h5>Manage Class List</h5>
          <hr>
    </div>

    <div class="container" style="padding: 1%">
    
    <div id="jsGrid" style = "display:none;" ></div>
    <div class="row" style="margin-top:2%">
    <div class="col-md-11"></div>
    <div class="col-md-1"> <i class="iStyle fa fa-plus button button6" style="border-radius:50%;" onclick="showClassListDetailsDialog()"></i>
   
    </div>
    </div>
    
    </div>`;
    document.getElementById('adminActionHolder').innerHTML = manageClassListHTML;

    getClassListToShow();
    setValuesInSchoolListSelect("newSchoolId");

}

function getClassListToShow() {
    document.getElementById("new_loader").style.display = "block";
    document.getElementById('jsGrid').style.display = "none";
    let classListReq = $.post(baseUrl + "/apis/classList.php", {
        type: "getClassList",
        uid: me_data.uid
    });
    classListReq.done(function (responce) {
        document.getElementById('jsGrid').style.display = "block";
        $("#jsGrid").jsGrid({
            width: "100%",
            filtering: true,
            editing: true,
            sorting: true,
            paging: true,
            autoload: true,
            pageSize: 8,
            fields: [{ name: "schoolName", title: "School Name", type: "text", width: 120 },
            { name: "className", title: "Class Name", type: "text", width: 140 },
            { name: "section", title: "Section", type: "text", width: 120 },
            { name: "displayName", title: "Class Teacher", type: "text", width: 120 },
            ],
            rowClick: function (args) {
                showClassListDetailsDialog(args.item, true);
            },
            controller: {
                loadData: function (filter) {
                    var toReturn = $.Deferred();
                    let data = JSON.parse(responce)
                    var result = [];
                    if (filter.schoolName !== "") {
                        data.forEach(function (element) {
                            if (element.schoolName.indexOf(filter.schoolName) > -1) {
                                result.push(element);
                            }
                        }, this);
                        data = result;
                    }
                    else result = data;

                    if (filter.className !== "") {
                        result = [];
                        data.forEach(function (element) {
                            if (element.className.indexOf(filter.className) > -1)
                                result.push(element);
                        }, this);
                        data = result;
                    }
                    else result = data;

                    if (filter.section !== "") {
                        result = [];
                        data.forEach(function (element) {
                            if (element.section.indexOf(filter.section) > -1)
                                result.push(element);
                        }, this);
                        data = result;
                    }
                    else result = data;

                    if (filter.displayName !== "") {
                        result = [];
                        data.forEach(function (element) {
                            if (element.displayName.indexOf(filter.displayName) > -1)
                                result.push(element);
                        }, this);
                        data = result;
                    }
                    else result = data;


                    toReturn.resolve(result);
                    return toReturn.promise();
                },
            }
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
        type: "getUserList",
        uid: me_data.uid
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

function setValuesInSchoolListSelect(viewId) {
    document.getElementById("new_loader").style.display = "block";
    let schoolreq = $.post(baseUrl + "/apis/classList.php", {
        type: "getAllSchools",
        uid: me_data.uid
    });

    schoolreq.done(function (responce) {
        let schoolArray = JSON.parse(responce);
        $('#'.concat(viewId)).empty();
        $('#'.concat(viewId)).append($('<option>', {
            value: "",
            text: "Select School",
            selected: true,
            disabled: true
        }, '</option>'));
        for (var index in schoolArray) {
            $('#'.concat(viewId))
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
        uid: me_data.uid,
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
                uid: me_data.uid,
                section: sectionVal,
                schoolId: schoolIdVal,
                teacherId: teacherIdVal
            });

            insertClassReq.done(function (responce) {
                console.log(responce);
                if (responce == 200) {
                    showNotification("Success!", "Class Created Successfully", "success");
                    getClassListToShow();
                }
                else {
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
            uid: me_data.uid,
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
