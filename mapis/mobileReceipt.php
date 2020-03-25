<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$reqType = "receiptStuff: mobile";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    $studentId = $_POST['studentId'];
    $sessionName = $_POST['sessionName'];

    $sql = "SELECT `receiptId`, `recamt` from vreceiptamount WHERE `studentId` = '$studentId' AND `sessionName` = '$sessionName'";
    $result=mysqli_query($GLOBALS['conn'],$sql);  
    $toPrint = array();       
    while($r = mysqli_fetch_assoc($result)) {
        $receiptId = $r['receiptId'];
        $sql = "SELECT `receiptNo`, `receiptDate`, `remark` FROM receiptslist WHERE receiptId = $receiptId";
        $result1 = mysqli_query($conn,$sql);            
        $r1 = mysqli_fetch_assoc($result1);
        array_push($toPrint,array_merge($r,$r1));
    }
    print json_encode($toPrint);
}

?>