<?php
require_once 'db.php';
$type = $_POST['type'];

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
                $sqlHead = "SELECT amount FROM feesDetails WHERE receiptId = '$receiptId' AND headId = '$headId'";
                $resultHead=mysqli_query($conn,$sqlHead);
                while($rHead = mysqli_fetch_assoc($resultHead)){
                    $headAmount = $headAmount + $rHead["amount"];
                }
            }
            $r = array_merge($r,array($headAmount));
            $rows[] = $r;
        }
        print json_encode($rows); 
    }

}

?>