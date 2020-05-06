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
    if ($type == "iAmUltraSure") {
        $NextsessionName = $_POST["NextsessionName"];
        $sessionName = $_POST["sessionName"];
        $sql = "INSERT INTO `sessionlist`(`sessionName`) VALUES ('$sessionName')";
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
                }
            }

            echo $flag;
        } else {
            logRequest($uid, $type, $sql, "WRITE_FAILED");
            echo $sql;
        }
    }
}
