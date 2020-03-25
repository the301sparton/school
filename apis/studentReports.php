<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "attendence:" . $type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    if($type == "getSchoolStudentCOunt"){
        $sql = "SELECT schoolName, COUNT(studentId) as studentCount FROM `schoolwisestudents` WHERE schoolId = 2 
        UNION
        SELECT schoolName,  COUNT(studentId) as studentCount FROM `schoolwisestudents` WHERE schoolId = 1
        UNION
        SELECT schoolName,  COUNT(studentId) as studentCount FROM `schoolwisestudents` WHERE schoolId = 3";

        getOutputFromQueary($sql,$uid,$reqType);
    }
}
?>