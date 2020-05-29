
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


                $.post(baseUrl + "/apis/receiptStuff.php", { type: "getReceipt", uid: user.uid, receiptId: receiptId }, function (receiptStr) {
                    thisReceipt = JSON.parse(receiptStr);
                    console.log(thisReceipt);
                }),

                $.post(baseUrl + "/apis/receiptStuff.php", { type: "getReceiptDetails", uid: user.uid, receiptId: receiptId }, function (feesHeadValStr) {
                    feeHeadVal = JSON.parse(feesHeadValStr);
                    console.log(feeHeadVal);
                })

            ).then(function () {

                if (thisReceipt == null || feeHeadVal == null) {
                    throwBack();
                }

                $.post(baseUrl + "/apis/studentInfo.php", {
                    type: "onlyNameNsessionDetals",
                    uid: user.uid,
                    studentId: thisReceipt.studentId,
                    sessionName: thisReceipt.sessionName
                },
                    function (studentDataStr) {
                        stuentData = JSON.parse(studentDataStr);
                        performClassAnalysis(stuentData)
                    });
            });
        }
        else {
            throwBack();
        }

    });
}

function performClassAnalysis(stuentData) {
    let classHeads = $.post("../apis/feesHeads.php", {
        type: "feeHeadsForClass",
        uid: user.uid,
        className: stuentData.className,
        sessionName: thisReceipt.sessionName
    });

    classHeads.done(function (classHeadList) {
        let totalAmount = 0;
        let ArrClassList = JSON.parse(classHeadList);
        console.log(ArrClassList);
        if (ArrClassList[0] != null) {
            document.getElementById('td_1').innerText = ArrClassList[0].headName;
            document.getElementById('id_0').innerHTML = ArrClassList[0].headId;
        }
        else{
            document.getElementById('td_1').innerText = "";
            document.getElementById('id_0').innerHTML = "";
            document.getElementById('tc_1').style.display = "none";
        }

        if (ArrClassList[1] != null) {
            document.getElementById('tg_1').innerText = ArrClassList[1].headName;
            document.getElementById('id_1').innerHTML = ArrClassList[1].headId;
        }
        else{
            document.getElementById('tg_1').innerText = "";
            document.getElementById('id_1').innerHTML = "";
            document.getElementById('tf_1').style.display = "none";
        }

        if (ArrClassList[2] != null) {
            document.getElementById('tj_1').innerText = ArrClassList[2].headName;
            document.getElementById('id_2').innerHTML = ArrClassList[2].headId;
        }
        else{
            document.getElementById('tj_1').innerText = "";
            document.getElementById('id_2').innerHTML = "";
            document.getElementById('ti_1').style.display = "none";
        }

        if (ArrClassList[3] != null) {
            document.getElementById('tm_1').innerText = ArrClassList[3].headName;
            document.getElementById('id_3').innerHTML = ArrClassList[3].headId;
        }
        else{
            document.getElementById('tm_1').innerText = "";
            document.getElementById('id_3').innerHTML = "";
            document.getElementById('tl_1').style.display = "none";
        }

        if (ArrClassList[4] != null) {
            document.getElementById('tp_1').innerText = ArrClassList[4].headName;
            document.getElementById('id_4').innerHTML = ArrClassList[4].headId;
        }
        else{
            document.getElementById('tp_1').innerText = "";
            document.getElementById('id_4').innerHTML = "";
            document.getElementById('to_1').style.display = "none";
        }

        if (ArrClassList[5] != null) {
            document.getElementById("ts_1").innerText = ArrClassList[5].headName;
            document.getElementById('id_5').innerHTML = ArrClassList[5].headId;
        }
        else{
            document.getElementById('ts_1').innerText = "";
            document.getElementById('id_5').innerHTML = "";
            document.getElementById('tr_1').style.display = "none";
        }

        if (ArrClassList[6] != null) {
            document.getElementById("tv_1").innerText = ArrClassList[6].headName;
            document.getElementById('id_6').innerHTML = ArrClassList[6].headId;
        }
        else{
            document.getElementById('tv_1').innerText = "";
            document.getElementById('id_6').innerHTML = "";
            document.getElementById('tu_1').style.display = "none";
        }

        if (ArrClassList[7] != null) {
            document.getElementById("ty_1").innerText = ArrClassList[7].headName;
            document.getElementById('id_7').innerHTML = ArrClassList[7].headId;
        }
        else{
            document.getElementById('ty_1').innerText = "";
            document.getElementById('id_7').innerHTML = "";
            document.getElementById('tx_1').style.display = "none";
        }

        if (ArrClassList[8] != null) {
            document.getElementById("t11_1").innerText = ArrClassList[8].headName;
            document.getElementById('id_8').innerHTML = ArrClassList[8].headId;
        }
        else{
            document.getElementById('t11_1').innerText = "";
            document.getElementById('id_8').innerHTML = "";
            document.getElementById('t10_1').style.display = "none";
            
        }




        let finalDateArr = thisReceipt.receiptDate.split("-");
        let finalDate = finalDateArr[2] + "-" + finalDateArr[1] + "-" + finalDateArr[0];

        document.getElementById('t2_1').innerText = thisReceipt.receiptNo;
        document.getElementById('t4_1').innerText = finalDate;
        document.getElementById('t6_1').innerText = stuentData.firstName + " " + stuentData.middleName + " " + stuentData.lastName;
        document.getElementById('t8_1').innerText = stuentData.className + " " + stuentData.section + " [" + thisReceipt.sessionName + "]";
       
        var shouldIDisplayHeadAmount = false;
        if(stuentData.schoolId == "1"){
            document.getElementById('pg1').innerHTML = `<object width="641" height="909" data="1/1.svg"
type="image/svg+xml" id="pdf1"
style="width:641px; height:909px; -moz-transform:scale(1); z-index: 0;"></object>`;
            shouldIDisplayHeadAmount = true;
        }
        else if(stuentData.schoolId == "2"){
            document.getElementById('pg1').innerHTML = `<object width="641" height="909" data="1/1.svg"
type="image/svg+xml" id="pdf1"
style="width:641px; height:909px; -moz-transform:scale(1); z-index: 0;"></object>`;
        }
        else if(stuentData.schoolId == "3"){
            shouldIDisplayHeadAmount = true;
            document.getElementById('pg1').innerHTML = `<object width="641" height="909" data="1/2.svg"
            type="image/svg+xml" id="pdf1"
            style="width:641px; height:909px; -moz-transform:scale(1); z-index: 0;"></object>`;
        }
        let indexHead = 0;
        for (itr in feeHeadVal) {
            totalAmount = parseInt(totalAmount, 10) + parseInt(feeHeadVal[itr].amount, 10);
        }

        if (shouldIDisplayHeadAmount) {
            for (indexHead = 0; indexHead <= 8; indexHead++) {
                document.getElementById("id_" + indexHead).style.display = "block";
                tempAmt = feeHeadVal[document.getElementById("id_" + indexHead).innerHTML];
                console.log(tempAmt);
                if (tempAmt != null) {
                    document.getElementById("id_" + indexHead).innerText = tempAmt.amount
                }
                else {
                    document.getElementById("id_" + indexHead).style.display = "none";
                }
            }
        }
        else {

            for (indexHead = 0; indexHead <= 8; indexHead++) {
                document.getElementById("id_" + indexHead).style.display = "block";
                tempAmt = feeHeadVal[document.getElementById("id_" + indexHead).innerHTML];
                if (tempAmt != null) {
                    document.getElementById("id_" + indexHead).innerText = "";
                }
                else {
                    document.getElementById("id_" + indexHead).style.display = "none";
                }
            }

            document.getElementById('id_4').innerText = totalAmount;
            document.getElementById("id_4").style.display = "block";
        }

        document.getElementById('total_Amount').innerText = totalAmount;
        document.getElementById('t15_1').innerText = "Rupees In Words: " + inWords(totalAmount).concat("Only.");
        document.getElementById('t17_1').innerText = chunk(thisReceipt.remark, 30).join('\n');
        document.getElementById('loader').style.display = "none";
        // document.getElementById('generatedBy').innerText = "Generated By: "+me_data.displayName;

    });
}

function chunk(str, n) {
    var ret = [];
    var i;
    var len;

    for (i = 0, len = str.length; i < len; i += n) {
        ret.push(str.substr(i, n))
    }

    return ret
};


function throwBack() {
    document.location = baseUrl + "/home";
}

var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
}