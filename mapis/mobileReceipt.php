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
    $uid = $_POST['uid'];
    $timeSinceEpoc = $_POST["unixTime"];

    $studentId = $conn->real_escape_string($studentId);
    $sessionName = $conn->real_escape_string($sessionName);
    $uid = $conn->real_escape_string($uid);
    $timeSinceEpoc = $conn->real_escape_string($timeSinceEpoc);

    $payload = $timeSinceEpoc.$uid.$sessionName.$studentId;
    $headerStringValue = $_SERVER['HTTP_HMAC'];        

    if(checkAuth($payload, $uid, $headerStringValue)){
        $sql = "SELECT `receiptId`, `recamt` from vreceiptamount WHERE `studentId` = '$studentId' AND `sessionName` = '$sessionName'";
        $result=mysqli_query($GLOBALS['conn'],$sql);  
        $toPrint = array();       
        $itr = 0;
        while($r = mysqli_fetch_assoc($result)) {
            $receiptId = $r['receiptId'];
            $sql = "SELECT `receiptNo`, `receiptDate`, `remark` FROM receiptslist WHERE receiptId = $receiptId";
            $result1 = mysqli_query($conn,$sql);            
            $r1 = mysqli_fetch_assoc($result1);
            $toPrint["receipts"][$itr] = array_merge($r,$r1);
            $itr = $itr + 1;
        }
    
        $sql = "SELECT totalFees, paidFees FROM studentfees where studentId = '$studentId' AND sessionName = '$sessionName'";
        $result2 = mysqli_query($conn,$sql);            
        $r2 = mysqli_fetch_assoc($result2);
        $toPrint["details"] = $r2;
        print json_encode($toPrint);
    }   
}

?>