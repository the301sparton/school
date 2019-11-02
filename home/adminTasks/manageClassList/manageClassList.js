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
}

function getClassListToShow() {
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
            fields: [{ name: "className", title: "Class Name", type: "text", width: 140 },
            { name: "section", title: "Section", type: "text", width: 120 },
            { name: "displayName", title: "Class Teacher", type: "text", width: 120 },
            ],
            rowClick: function (args) {
                showClassListDetailsDialog(args.item, true);
            },
            data: JSON.parse(responce),
            onItemUpdating: function (args) {
                // cancel update of the item with empty 'name' field
                if (args.item.headName === "") {
                    args.cancel = true;
                    showNotification("<strong>Error!</strong>", "Enter fees head name.", "warning");
                }
                else {
                    updateClassListItem(args.item);
                }
            }
        });
    });
    classListReq.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });
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
            document.getElementById("newClassSection").value = args.section;
            document.getElementById('newClassTeacher').value = args.uid;
        }
        else {
            document.getElementById("classListModalTitel").innerHTML = '<h4>Create New Class</h4>'
        }

        $("#addEditClassList").modal();
    });

    getTeacherList.fail(function (jqXHR, textStatus) { handleNetworkIssues(textStatus) });

}

function setValuesInClassTeacherSelect(teacherList){
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
                    value:teacherList[index].uid,
                    text: teacherList[index].displayName,
                }, '</option>'));
        }
}

//Handle UPDATE DELETE CREATE
