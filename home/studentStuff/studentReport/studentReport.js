function studentReport(){
    currentStudentOption = "studentReport";
    setActiveColorsStudent("studentReport");
    document.getElementById('studentActionHolder').innerHTML = `<div class="container" id="registerStudent">
    <div class="text-center">
      <h4 id="searchHeading">Student Reports</h4>
      <hr>
    </div>
    
    <div class="row" style = "text-align: center; padding: 1%">
        <div class="col-md-3 button button1" style = "margin: 1%; border-radius: 8px" onclick="showSchoolReport()" id="showSchoolReport">School Report</div>
        <div class="col-md-1"></div>
        <div class="col-md-3 button button2" style = "margin: 1%; border-radius: 8px" onclick="showAttendenceReport()" id="showAttendenceReport">Attendence Report</div>
        <div class="col-md-1"></div>
        <div class="col-md-3 button button3" style = "margin: 1%; border-radius: 8px" onclick="generateTC()" id="generateTC">Generate TC</div>
    </div>

    <hr>

    <div class="row" id="studentReportHolder">
    </div>

    </div>`;
}

function setActiveColorsStudentReport(toSet) {
  limit = ["showSchoolReport","showAttendenceReport","generateTC"];
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