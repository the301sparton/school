
function showSchoolReport(){
    setActiveColorsStudentReport("showSchoolReport");

    document.getElementById("studentReportHolder").innerHTML = `
    <div class="row">
        <div class="col-md-12">
            <canvas id="myChart" height="350px" width="550px"></canvas>
        </div>
    </div>`;

    var ctx = document.getElementById('myChart').getContext('2d');

    let schoolStudentCountReq = $.post(baseUrl + "/apis/studentReports.php",{
        type: "getSchoolStudentCOunt",
        uid: me_data.uid
    });

    schoolStudentCountReq.done(function(responseReport) {
        //console.log(responseReport);
       
           var reportJSON = JSON.parse(responseReport);
           var schoolNames = new Array();
           var studentCounts = new Array();
           for(itr in reportJSON){
               console.log(reportJSON[itr].studentCount)
                schoolNames.push(reportJSON[itr].schoolName);
                studentCounts.push(reportJSON[itr].studentCount);
           }
           
           //console.log(studentCount);
           
           var myChart = new Chart(ctx, {
            type: 'bar',            
            data: {
                labels: schoolNames,
                datasets: [{   
                    label: "Student Count By School",                 
                    barPercentage: 0.5,
                    barThickness: 8,
                    maxBarThickness: 10,
                    minBarLength: 2,
                    data: studentCounts,
                }]
            }
        });
       
    });

    schoolStudentCountReq.fail(function(jqXHR, textStatus) {
        document.getElementById("new_loader").style.display = "none";
        handleNetworkIssues(textStatus)
    });
           
}