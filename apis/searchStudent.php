<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "searchStudent:".$type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    $sessionName = $_POST["sessionName"];
    if ($type == "name") {
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";
        $sql1 = "SELECT `studentId`,`firstName`,`isDisabled`, `middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `firstName` LIKE '$name' OR `lastName` LIKE '$name' AND `sessionName` = '$sessionName' ORDER BY `firstName` LIMIT $limit ";
        getOutputFromQueary($sql1,$uid,$reqType);
    }
    else if($type == "admissionNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`, `isDisabled`,`middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `admissionNumber` LIKE '$name' AND `sessionName` = '$sessionName' ORDER BY `admissionNumber` LIMIT $limit";
        getOutputFromQueary($sql1,$uid,$reqType);
    }
    else if($type == "aadharNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`,`isDisabled`, `middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `aadharNumber` LIKE '$name' AND `sessionName` = '$sessionName' ORDER BY `aadharNumber` LIMIT $limit";
        getOutputFromQueary($sql1,$uid,$reqType);
    }
    else if($type == "formNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`, `isDisabled`,`middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `formNumber` LIKE '$name' AND `sessionName` = '$sessionName' ORDER BY `formNumber` LIMIT $limit";
        getOutputFromQueary($sql1,$uid,$reqType);
    }
    else if($type == "parentPhoneNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`, `isDisabled`,`middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `guardianPhone` LIKE '$name' AND `sessionName` = '$sessionName' ORDER BY `guardianPhone`  LIMIT $limit";
        getOutputFromQueary($sql1,$uid,$reqType);
    }
}
