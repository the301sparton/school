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
                <Select id ="level_aq" class="form-control">
                    <option selected disabled value="">Select Level</option>
                </Select>
            </div>
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