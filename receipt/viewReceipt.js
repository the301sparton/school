
let user;
let me_data;
let receiptId;
let thisReceipt;
let feeHeadVal;
let stuentData;


$(document).ready(function () {
    $.when(pg_main()).then(function () {
        $('#pg_print').removeAttr('disabled');
    });
});

function pg_print() {
    window.print();
}

function pg_back() {
    window.history.back();
}

function pg_main() {
    var url = new URL(document.location.href);
    receiptId = url.searchParams.get("receiptId");
    if (receiptId == null) {
        throwBack();
    }
    firebase.auth().onAuthStateChanged(function (usr) {
        if (usr) {
            user = usr;
            $.when(

                $.post("../apis/User.php", { type: "getById", uid: user.uid }, function (user_dat) {
                    me_data = JSON.parse(user_dat)[0];
                    if (me_data == null) {
                        throwBack();
                    }
                }),


                $.post(baseUrl + "/apis/receiptStuff.php", { type: "getReceipt", receiptId: receiptId }, function (receiptStr) {
                    thisReceipt = JSON.parse(receiptStr);

                }),

                $.post(baseUrl + "/apis/receiptStuff.php", { type: "getReceiptDetails", receiptId: receiptId }, function (feesHeadValStr) {
                    feeHeadVal = JSON.parse(feesHeadValStr);
                })

            ).then(function () {

                if (thisReceipt == null || feeHeadVal == null) {
                    throwBack();
                }

                $.post(baseUrl + "/apis/studentInfo.php", {
                    type: "onlyNameNsessionDetals",
                    studentId: thisReceipt.studentId,
                    sessionName: thisReceipt.sessionName
                },
                    function (studentDataStr) {
                        let totalAmount = 0;
                        console.log(studentDataStr)
                        stuentData = JSON.parse(studentDataStr);

                        let finalDateArr = thisReceipt.receiptDate.split("-");
                        let finalDate = finalDateArr[2] + "-" + finalDateArr[1] + "-" + finalDateArr[0];

                        document.getElementById('t2_1').innerText = thisReceipt.receiptId;
                        document.getElementById('t4_1').innerText = finalDate;
                        document.getElementById('t6_1').innerText = stuentData.firstName + " " + stuentData.middleName + " " + stuentData.lastName;
                        document.getElementById('t8_1').innerText = stuentData.class + " " + stuentData.section + " [" + thisReceipt.sessionName+"]";

                        var shouldIDisplayHeadAmount = performClassAnalysis(stuentData.class);
                        let indexHead = 0;
                        for (itr in feeHeadVal) {
                            totalAmount = parseInt(totalAmount, 10) + parseInt(feeHeadVal[itr].amount, 10);
                        }

                        if(shouldIDisplayHeadAmount){
                            for(indexHead = 0; indexHead<=8;indexHead++){
                                document.getElementById("id_" + indexHead).style.display = "block";
                                   tempAmt = feeHeadVal[document.getElementById("id_" + indexHead).innerHTML];
                                   if(tempAmt != null){
                                       console.log(tempAmt.amount)
                                       document.getElementById("id_" + indexHead).innerText = tempAmt.amount
                                   }
                                   else {
                                       document.getElementById("id_" + indexHead).style.display = "none";
                                   }
                               }
                        }
                        else{

                            for(indexHead = 0; indexHead<=8;indexHead++){
                                document.getElementById("id_" + indexHead).style.display = "block";
                                   tempAmt = feeHeadVal[document.getElementById("id_" + indexHead).innerHTML];
                                   if(tempAmt != null){
                                       console.log(tempAmt.amount)
                                       document.getElementById("id_" + indexHead).innerText = "";
                                   }
                                   else {
                                       document.getElementById("id_" + indexHead).style.display = "none";
                                   }
                               }

                            document.getElementById('id_4').innerText = totalAmount;
                            document.getElementById("id_4" ).style.display = "block";
                        }

                        document.getElementById('total_Amount').innerText = totalAmount;
                        document.getElementById('t15_1').innerText = "Rupees In Words: " + inWords(totalAmount);
                        document.getElementById('t17_1').innerText = thisReceipt.remark;
                        document.getElementById('loader').style.display = "none";
                        // document.getElementById('generatedBy').innerText = "Generated By: "+me_data.displayName;

                    });
            });
        }
        else {
            throwBack();
        }

    });
}

function performClassAnalysis(className) {
    if (className == "Nursery" || className == "KG1" || className == "KG2") {
        document.getElementById('pg1').innerHTML = `<object width="641" height="909" data="1/1.svg"
        type="image/svg+xml" id="pdf1"
        style="width:641px; height:909px; -moz-transform:scale(1); z-index: 0;"></object>`;
        document.getElementById('td_1').innerText = "Registration Fees";
        document.getElementById('id_0').innerHTML = "6";
        document.getElementById('tg_1').innerText = "Caution Money";
        document.getElementById('id_1').innerHTML = "7";
        document.getElementById('tj_1').innerText = "Tution Fees";
        document.getElementById('id_2').innerHTML = "8";
        document.getElementById('tm_1').innerText = "Term Fees";
        document.getElementById('id_3').innerHTML = "9";
        document.getElementById('tp_1').innerText = "Admission Fees";
        document.getElementById('id_4').innerHTML = "10";

        document.getElementById("ts_1").innerText = "";
        document.getElementById("tv_1").innerText = "";
        document.getElementById("ty_1").innerText = "";
        document.getElementById("t11_1").innerText = "";

        document.getElementById("tr_1").innerText = "";
        document.getElementById("tu_1").innerText = "";
        document.getElementById("tx_1").innerText = "";
        document.getElementById("t10_1").innerText = "";
        return true;

    }
    else if (className == "1st" || className == "2nd" || className == "3rd" || className == "4th" || className == "5th" || className == "6th" || className == "7th") {
        document.getElementById('pg1').innerHTML = `<object width="641" height="909" data="1/1.svg"
        type="image/svg+xml" id="pdf1"
        style="width:641px; height:909px; -moz-transform:scale(1); z-index: 0;"></object>`;
        document.getElementById('td_1').innerText = "Caution Money";
        document.getElementById('id_0').innerHTML = "7";
        document.getElementById('tg_1').innerText = "Annual Gathering";
        document.getElementById('id_1').innerHTML = "11";
        document.getElementById('tj_1').innerText = "Projector Fees";
        document.getElementById('id_2').innerHTML = "12";
        document.getElementById('tm_1').innerText = "Examination Fees";
        document.getElementById('id_3').innerHTML = "13";
        document.getElementById('tp_1').innerText = "Computer Fees";
        document.getElementById('id_4').innerHTML = "14";

        document.getElementById("ts_1").innerText = "I. D. F. Fees";
        document.getElementById('id_5').innerHTML = "15";
        document.getElementById("tv_1").innerText = "Cycle Stand Fees";
        document.getElementById('id_6').innerHTML = "16";
        document.getElementById("ty_1").innerText = "Other Fees"
        document.getElementById('id_7').innerHTML = "17";

        document.getElementById("t11_1").innerText = "";
        document.getElementById("t10_1").innerText = "";
        return false;
    }
    else if (className == "8th" || className == "9th" || className == "10th" || className == "11th" || className == "12th") {
        document.getElementById('pg1').innerHTML = `<object width="641" height="909" data="1/2.svg"
        type="image/svg+xml" id="pdf1"
        style="width:641px; height:909px; -moz-transform:scale(1); z-index: 0;"></object>`;
        document.getElementById('td_1').innerText = "Admission Fees";
        document.getElementById('id_0').innerHTML = "10";
        document.getElementById('tg_1').innerText = "Tuition Fees";
        document.getElementById('id_1').innerHTML = "8";
        document.getElementById('tj_1').innerText = "Term Fees";
        document.getElementById('id_2').innerHTML = "9";
        document.getElementById('tm_1').innerText = "Games & Lib Fees";
        document.getElementById('id_3').innerHTML = "18";
        document.getElementById('tp_1').innerText = "Science Fees";
        document.getElementById('id_4').innerHTML = "19";

        document.getElementById("ts_1").innerText = "Computer Fees";
        document.getElementById('id_5').innerHTML = "14";
        document.getElementById("tv_1").innerText = "Cycle Stand Fees";
        document.getElementById('id_6').innerHTML = "16";
        document.getElementById("ty_1").innerText = "Caution Money";
        document.getElementById('id_7').innerHTML = "7";

        document.getElementById("t11_1").innerText = "Other Fees";
        document.getElementById('id_8').innerHTML = "17";
        return true
    }

}


function throwBack() {
    document.location = baseUrl + "/home";
}

var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
var b = ['', '', 'tTenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
    return str;
}