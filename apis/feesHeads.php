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
        $sql = "SELECT  headId, headName, `$class` FROM feesheads WHERE `$class` > 0 AND sessionName = '$sessionName' ORDER BY headId";
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
        $FeeHeadItem = $_POST['FeeHeadItem'];
        $sql = "UPDATE `feesheads` SET ";
        $i = 0;
        foreach($FeeHeadItem as $item){
            $index = array_search($item, $FeeHeadItem, true);
            if($i != 0){
                if($i != count($FeeHeadItem) -1){
                    $sql = $sql."`".$index."` = '".$item."', ";
                    }
                    else{
                        $sql = $sql."`".$index."` = '".$item."' ";
                    }
            }            
            $i++;
        }
        $sql = $sql."WHERE headId = '$id'";
        get200AsYes($sql,$uid,$reqType);
    }

}

?>