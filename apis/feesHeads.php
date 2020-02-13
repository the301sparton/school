<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$type = $_POST['type'];
$reqType = "feesHeads:".$type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "getActiveFeesHeads"){
        $classId = $_POST['classId'];
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];

        $class = "amount_".$classId;
        $sql = "SELECT  headId, headName, `$class` FROM feesheads WHERE `$class` > 0 ORDER BY headId";
        $result=mysqli_query($conn,$sql);
        $rows = array();    
        while($r = mysqli_fetch_assoc($result)) {
        
        $headId = $r["headId"];
        $headAmount = 0;

        $sqlReceipt = "SELECT receiptId FROM receiptslist WHERE studentId = '$studentId' AND sessionName = '$sessionName'";
        $resultReceipt=mysqli_query($conn,$sqlReceipt);
            while($rReceipt = mysqli_fetch_assoc($resultReceipt)){
                $receiptId = $rReceipt["receiptId"]; 
                $sqlHead = "SELECT amount FROM feesdetails WHERE receiptId = '$receiptId' AND headId = '$headId'";
                $resultHead = mysqli_query($conn,$sqlHead);
                while($rHead = mysqli_fetch_assoc($resultHead)){
                    $headAmount = $headAmount + $rHead["amount"];
                }
            }
            $r = array_merge($r,array($headAmount));
            $rows[] = $r;
        }
        print json_encode($rows); 
        logRequest($uid,$type,$sql,json_encode($rows));
    }

    else if($type == "getAllHeads"){
        $sql = "SELECT * FROM `feesheads`";
        getOutputFromQueary($sql,$uid,$reqType);
    }

    else if($type == "updateById"){
        $id = $_POST['id'];
        $headName = $_POST['headName'];
        $amount_KG1 = $_POST['amount_KG1'];
        $amount_KG2 = $_POST['amount_KG2'];
        $amount_Nursery = $_POST['amount_Nursery'];
        $amount_1st = $_POST['amount_1st'];
        $amount_2nd = $_POST['amount_2nd'];
        $amount_3rd = $_POST['amount_3rd'];
        $amount_4th = $_POST['amount_4th'];
        $amount_5th = $_POST['amount_5th'];
        $amount_6th = $_POST['amount_6th'];
        $amount_7th = $_POST['amount_7th'];
        $amount_8th = $_POST['amount_8th'];
        $amount_9th = $_POST['amount_9th'];
        $amount_10th = $_POST['amount_10th'];

        $sql = "UPDATE `feesheads` SET headName = '$headName', amount_KG1 = '$amount_KG1', amount_KG2 = '$amount_KG2', amount_Nursery = '$amount_Nursery', amount_1st = '$amount_1st', amount_2nd = '$amount_2nd', amount_3rd = '$amount_3rd', amount_4th = '$amount_4th', amount_5th = '$amount_5th', amount_6th = '$amount_6th', amount_7th = '$amount_7th', amount_8th = '$amount_8th', amount_9th = '$amount_9th', amount_10th = '$amount_10th' WHERE headId = '$id'";
        get200AsYes($sql,$uid,$reqType);
    }

}

?>