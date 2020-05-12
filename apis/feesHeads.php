<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$type = $_POST['type'];
$reqType = "feesHeads:" . $type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    if ($type == "getActiveFeesHeads") {
        $classId = $_POST['classId'];
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];

        $class = "amount_" . $classId;
        $sql = "SELECT  headId, headName, `$class` FROM feesheads WHERE `$class` > 0 AND sessionName = '$sessionName' ORDER BY headId";
        $result = mysqli_query($conn, $sql);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {

            $headId = $r["headId"];
            $headAmount = 0;

            $sqlReceipt = "SELECT receiptId FROM receiptslist WHERE studentId = '$studentId' AND sessionName = '$sessionName'";
            $resultReceipt = mysqli_query($conn, $sqlReceipt);
            while ($rReceipt = mysqli_fetch_assoc($resultReceipt)) {
                $receiptId = $rReceipt["receiptId"];
                $sqlHead = "SELECT amount FROM feesdetails WHERE receiptId = '$receiptId' AND headId = '$headId'";
                $resultHead = mysqli_query($conn, $sqlHead);
                while ($rHead = mysqli_fetch_assoc($resultHead)) {
                    $headAmount = $headAmount + $rHead["amount"];
                }
            }
            $r = array_merge($r, array($headAmount));
            $rows[] = $r;
        }
        print json_encode($rows);
        logRequest($uid, $type, $sql, json_encode($rows));
    } else if ($type == "getAllHeads") {
        $sql = "SELECT * FROM `feesheads`";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "updateById") {
        $id = $_POST['id'];
        $FeeHeadItem = $_POST['FeeHeadItem'];
        $headList = $_POST["headList"];
        $sessionName = $FeeHeadItem['sessionName'];
        $sql = "UPDATE `feesheads` SET ";
        $i = 0;
        foreach ($headList as $item) {
            if ($item != "sessionName" && $item !="headId" && "headName") {
                $val = $FeeHeadItem[$item];
                if ($i != count($headList) - 1) {
                    $sql = $sql . "`" . $item . "` = '" . $val . "', ";
                } else {
                    $sql = $sql . "`" . $item . "` = '" . $val . "' ";
                }
            }
            $i++;
        }
        $sql = $sql . "WHERE headId = '$id' AND sessionName = '$sessionName'";
        get200AsYes($sql,$uid,$reqType);
        //echo $sql;
    }
}
