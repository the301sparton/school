<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "academicSession:" . $type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    $password = $_POST['password'];
    if ($type == "iAmUltraSure"&& $password == "lol3m4nd9sn4m0-dm4nvnsa-sdans") {
        $NextsessionName = $_POST["NextsessionName"];
        $sessionName = $_POST["sessionName"];
        $sql = "INSERT INTO `sessionlist`(`sessionName`) VALUES ('$NextsessionName')";
        if ($conn->query($sql) == TRUE) {
            logRequest($uid, $type, $sql, "WRITE_SUCCESS");
            $flag = true;
            $sql = "SELECT * FROM promotion_table";
            $result = mysqli_query($GLOBALS['conn'], $sql);
            while ($r = mysqli_fetch_assoc($result)) {
                $currentClass = $r["currentClass"];
                $currentSection = $r["currentSection"];
                $nextClass = $r["newClass"];
                $nextSection = $r["newSection"];
                $sql = "INSERT into studentdetails (sessionName,studentId,isDisabled,class,section,medium,totalFees) SELECT '$NextsessionName' as sessionName,studentId,isDisabled,'$nextClass' as class,'$nextSection' as section,medium,0 as totalFees FROM `studentdetails` where sessionName='$sessionName' and isDisabled=0 and class='$currentClass' and section='$currentSection'";
                if ($conn->query($sql) != TRUE) {
                    $flag = false;
                break;
                }
            }

            if($flag){
                echo 200;
            }
            else{
                echo 500;
            }
        } else {
            logRequest($uid, $type, $sql, "WRITE_FAILED");
            echo 500;
        }
    }
    else{
        echo 501;
    }
}
