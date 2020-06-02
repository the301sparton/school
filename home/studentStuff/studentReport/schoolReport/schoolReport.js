
function showSchoolReport() {
    setActiveColorsStudentReport("showSchoolReport");
    document.getElementById("new_loader").style.display = "block";
    document.getElementById("studentReportHolder").innerHTML = `
            <canvas id="myChart" width="100%"></canvas>
            <div class="row" style = "padding:3%">
                <div id="jsGrid" style = "display:none; margin-top:2%" ></div>
            </div>
   `;

    var ctx = document.getElementById('myChart').getContext('2d');

    let schoolStudentCountReq = $.post(baseUrl + "/apis/studentReports.php", {
        type: "getSchoolStudentCOunt",
        uid: me_data.uid
    });

    schoolStudentCountReq.done(function (responseReport) {
        var reportJSON = JSON.parse(responseReport);
        var schoolNames = new Array();
        var studentCounts = new Array();
        var jsgridVal = new Array();
        var i = 0;
        for (itr in reportJSON) {
            schoolNames.push(reportJSON[itr].schoolName);
            studentCounts.push(reportJSON[itr].studentCount);
            var obj = new Object();
            obj.schoolName = reportJSON[itr].schoolName;
            obj.studentCount = reportJSON[itr].studentCount;
            jsgridVal.push(obj);
            i++;
        }

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: schoolNames,
                datasets: [{
                    label: "Student Count By School",
                    barPercentage: 0.5,
                    barThickness: 20,
                    maxBarThickness: 20,
                    minBarLength: 20,
                    data: studentCounts,
                }]
            }
        });

        $("#jsGrid").jsGrid({
            width: "100%",
            inserting: false,
            editing: false,
            sorting: false,
            paging: true,
            fields: [{ title: "School Name", type: "text", width: 120, name: "schoolName" },
            { title: "Student Count", type: "number", width: 120 , name: "studentCount"}],
            data: jsgridVal
        });
        document.getElementById("jsGrid").style.display = "block";
        document.getElementById("new_loader").style.display = "none";
    });

    schoolStudentCountReq.fail(function (jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });

}