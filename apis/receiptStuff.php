<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$type = $_POST['type'];
$reqType = "receiptStuff:" . $type;
$uid = $_POST['uid'];

$amount = 0;
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    if ($type == "getMyPaidAmount") {

        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];

        $sql1 = "SELECT receiptId FROM receiptslist WHERE studentId = '$studentId' AND sessionName = '$sessionName'";

        $result1 = mysqli_query($conn, $sql1);
        if ($result1 != null) {
            while ($r1 = mysqli_fetch_assoc($result1)) {
                $receiptId = $r1['receiptId'];
                $sql2 = "SELECT amount FROM feesdetails WHERE receiptId = $receiptId";
                $result2 = mysqli_query($conn, $sql2);
                while ($r2 = mysqli_fetch_assoc($result2)) {
                    $tempAmount = $r2['amount'];
                    $amount += $tempAmount;
                }
            }
            echo $amount;
        } else {
            echo "E500";
        }
    } else if ($type == "deleteReceiptById") {
        $id = $_POST["id"];
        $remarkDelete = $_POST["remark"];

        $sql = "SELECT * FROM `receiptslist` WHERE receiptId = $id";
        $result = mysqli_query($conn, $sql);
        $r = mysqli_fetch_assoc($result);
        if ($r != null) {

            $sql = "DELETE from `receiptslist` WHERE receiptId = $id";
            if ($conn->query($sql) == TRUE) {
                $sql = "DELETE FROM `feesdetails` WHERE receiptId = $id";
                if ($conn->query($sql) == TRUE) {
                    logRequest($uid, "DELETE_RECEIPT", $sql, "WRITE_SUCCESS");
                    $sessionName = $r["sessionName"];
                    $receiptNo = $r["receiptNo"];
                    $studentId = $r["studentId"];
                    $receiptDate = $r["receiptDate"];
                    $remarkCreation = $r["remark"];
                    $userCreatedBy = $r["userId"];
                    $sql = "INSERT INTO `deleted_receipts`(`receiptId`, `sessionName`, `receiptNo`, `studentId`, `receiptDate`, `remarkCreation`, `createdBy`, `deletedBy`, `deletionRemark`) VALUES
                        ('$id', '$sessionName', '$receiptNo', '$studentId', '$receiptDate', '$remarkCreation', '$userCreatedBy', '$uid', '$remarkDelete')";
                    get200AsYes($sql, $uid, $reqType);
                } else {
                    echo $sql;
                }
            } else {
                echo 500;
            }
        }
    } 
    else if($type == "getDeletedReceiptList"){
        $sql = "SELECT * FROM `deleted_receipts_details`";
        getOutputFromQueary($sql, $uid, $reqType);
    }
    else if ($type == "getTotalFees") {
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];
        $tblName = "studentdetails";
        $sql = "SELECT totalFees FROM `$tblName` WHERE studentId = $studentId AND sessionName = '$sessionName'";
        $result = mysqli_query($conn, $sql);
        $r = mysqli_fetch_assoc($result);
        echo $r['totalFees'];
    } else if ($type == "getReceipt") {
        $receiptId = $_POST['receiptId'];
        $sql = "SELECT * FROM receiptslist WHERE receiptId = $receiptId";
        $result = mysqli_query($conn, $sql);

        $r = mysqli_fetch_assoc($result);
        print json_encode($r);
    } else if ($type == "getReceiptDetails") {
        $receiptId = $_POST['receiptId'];
        $sql = "SELECT `headId`, `amount` FROM `feesdetails` WHERE receiptid = '$receiptId'";
        $rows = array();
        $result = mysqli_query($conn, $sql);

        while ($r = mysqli_fetch_assoc($result)) {
            $rows[$r["headId"]] = $r;
        }
        print json_encode($rows);
    } else if ($type == "newReceipt") {
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];
        $receiptDate = $_POST['receiptDate'];
        $remark = $_POST['receiptRemark'];
        $userId = $_POST['userId'];
        $headValues = $_POST['headValues'];
        $classId = $_POST['classId'];
        $rDate = date('Y-m-d', strtotime($receiptDate));
        $class = "amount_" . $classId;

        $sqlNewReceipt = "addNewReceipt('$sessionName', '$studentId', '$rDate', '$remark', '$userId')";
        $result = mysqli_query($GLOBALS['conn'], "SELECT " . $sqlNewReceipt);
        $r = mysqli_fetch_assoc($result);
        $receiptId = $r[$sqlNewReceipt];

        $sqlForHeads = "SELECT  headId, headName, `$class` FROM feesheads WHERE `$class` > 0 ORDER BY headId";
        $result = mysqli_query($conn, $sqlForHeads);

        $itr = 0;
        $sqlHead = "INSERT INTO `feesdetails` (`receiptId`, `headId`, `amount`) VALUES ";
        $lengthHeads = count($headValues);
        while ($r = mysqli_fetch_assoc($result)) {
            $tempHeadId = $r['headId'];
            $tempHeadVal = $headValues[$itr];
            if ($tempHeadVal != 0) {
                $sqlHead = $sqlHead . "('$receiptId', '$tempHeadId', '$tempHeadVal'), ";
            }
            $itr++;
        }

        $finalSQLArr = explode(",", $sqlHead);
        $FinalSql = "";
        for ($i = 0; $i < count($finalSQLArr); $i++) {
            if ($i == count($finalSQLArr) - 1) {
                $FinalSql = $FinalSql . ";" . $finalSQLArr[$i];
            } else {
                if ($i == 0) {
                    $FinalSql = $finalSQLArr[$i];
                } else {
                    $FinalSql = $FinalSql . "," . $finalSQLArr[$i];
                }
            }
        }
        if ($conn->query($FinalSql) == TRUE) {
            $res = '{"resCode":200,"id":' . $receiptId . '}';
            echo $res;
        } else {
            echo $FinalSql;
        }
    } else if ($type == "reportByDate") {
        $dateFrom = $_POST['dateFrom'];
        $dateTo = $_POST["dateTo"];
        $sessionName = $_POST['sessionName'];
        $dateFrom = date('Y-m-d', strtotime($dateFrom));
        $dateTo = date('Y-m-d', strtotime($dateTo));

        $sqlHeadNames = "SELECT headId, headName FROM feesheads";
        $headArray = array();
        $headResult = mysqli_query($conn, $sqlHeadNames);

        while ($rHead = mysqli_fetch_assoc($headResult)) {
            $amountArr["amount"] = 0;
            $headName["headName"] = $rHead["headName"];
            $headArray[$rHead["headId"]] = array_merge($headName, $amountArr);
        }

        $sqlReceiptId = "SELECT receiptId FROM receiptslist WHERE sessionName = '$sessionName' AND receiptDate BETWEEN '$dateFrom' AND '$dateTo'";
        $receiptResult = mysqli_query($conn, $sqlReceiptId);
        while ($rReceipt = mysqli_fetch_assoc($receiptResult)) {
            $thisReceiptId = $rReceipt["receiptId"];
            $sqlfeeDetails = "SELECT headId, amount FROM feesDetails WHERE receiptId = '$thisReceiptId'";
            $feeDetailsResult = mysqli_query($conn, $sqlfeeDetails);
            while ($rFeesDetails = mysqli_fetch_assoc($feeDetailsResult)) {
                $headArray[$rFeesDetails["headId"]]["amount"] += $rFeesDetails["amount"];
            }
        }
        echo json_encode($headArray);
        logRequest($uid, $type, $sql, json_encode($headArray));
    } else if ($type  == "classSummeryReport") {
        $class = $_POST['class'];
        $section = $_POST['section'];
        $sessionName = $_POST['sessionName'];
        $sql = "SELECT studentId, fullname, totalFees, paidFees FROM studentfees WHERE class = '$class' AND section = '$section'";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "headWiseSumm") {
        $sql = "SELECT * from headwisesumm";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "receiptListBySessionAndStudentId") {
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];
        $sql = "SELECT `receiptId`, `recamt` from vreceiptamount WHERE `studentId` = '$studentId' AND `sessionName` = '$sessionName'";
        getOutputFromQueary($sql, $uid, $reqType);
    }
}
