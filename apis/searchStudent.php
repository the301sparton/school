<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    if ($type == "name") {
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";
        $sql1 = "SELECT `studentId`,`firstName`, `middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `firstName` LIKE '$name' OR `lastName` LIKE '$name' LIMIT $limit";
        getOutputFromQueary($sql1);
    }
    else if($type == "admissionNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`, `middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `admissionNumber` LIKE '$name' LIMIT $limit";
        getOutputFromQueary($sql1);
    }
    else if($type == "aadharNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`, `middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `aadharNumber` LIKE '$name' LIMIT $limit";
        getOutputFromQueary($sql1);
    }
    else if($type == "formNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`, `middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `formNumber` LIKE '$name' LIMIT $limit";
        getOutputFromQueary($sql1);
    }
    else if($type == "parentPhoneNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $name = $nameIP . "%";

        $sql1 = "SELECT  `studentId`,`firstName`, `middleName`, `lastName`, `admissionNumber`, `class`, `section`, `photo` from searchstudent WHERE `formNumber` LIKE '$parentPhoneNumber' LIMIT $limit";
        getOutputFromQueary($sql1);
    }
}
