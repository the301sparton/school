<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$reqType = "getStudentInfo:";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];

        $studentId = $conn->real_escape_string($studentId);
        $sessionName = $conn->real_escape_string($sessionName);

        $sql = "SELECT  `middleName`, `motherName`, `fatherName`, `gender`, `aadharNumber`, `dob`, `pob_city`, `pob_dist`,`pob_state`, `religion`, `category`, `caste`, `nationality`, `motherTounge`, `lastSchool`, `lastClass`, `doa`, `submittedTC`, `rte`, `lolocalAddress`, `localState`, `localCity`, `localPincode`, `permanentAddress`, `permanentState`, `permanentCity` `permanentPincode` `guardianName`, `guardianPhone`, `guardianEmail` FROM `studentinfo` WHERE studentId = $studentId";
        //printOnlyRowFromQueary($sql);
        $result=mysqli_query($conn,$sql);          
        $r = mysqli_fetch_assoc($result);

        $sql1 = "SELECT `photo`, `class`, `section`, `medium` FROM studentdetails WHERE studentId = '$studentId' AND sessionName = '$sessionName'";
        $result1=mysqli_query($conn,$sql1);          
        $r1 = mysqli_fetch_assoc($result1);

        $r = array_merge($r,$r1);

        logRequest(getUserIpAddr(),$requestType, $sql, $res);
        print json_encode($r);
}

?>