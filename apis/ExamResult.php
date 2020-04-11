<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "attendence:".$type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "getList"){
        $sessionName = $_POST['sessionName'];
        $classFull = $_POST["class"];
        $classsessionName = '$sessionName';
        $classArray = explode(",", $classFull);
        $class = $classArray[0];
        $section = $classArray[1];
        $dateForAttendence = $_POST["date"];
        $subject = $_POST["subject"];
        $dateForAttendenceFinal = date('Y-m-d', strtotime($dateForAttendence)); 
        $sqlforAlready = "SELECT * FROM resultdetails WHERE `sessionName` = '$sessionName' AND `date`= '$dateForAttendenceFinal' AND `class` = '$class' AND `section` = '$section' AND `subject` = '$subject' ORDER BY `firstName`";
        $result = mysqli_query($GLOBALS['conn'],$sqlforAlready);  
        if (mysqli_num_rows($result) == 0) { 
            $sql = "SELECT sessionName, class, section, studentid, firstName, middleName, lastName FROM searchstudent WHERE `sessionName` = '$sessionName' AND `class` = '$class'AND `section` = '$section' AND `isDisabled` = 0 ORDER BY `firstName`";
            getOutputFromQueary($sql,$uid,$reqType);
        }
        else{
            getOutputFromQueary($sqlforAlready,$uid,$reqType);
        }    
    }
}
