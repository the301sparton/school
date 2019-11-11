<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "getList"){
        $sessionName = $_POST['sessionName'];
        $classFull = $_POST["class"];
        $classsessionName = '$sessionName';
        $classArray = explode(":", $classFull);
        $class = $classArray[0];
        $section = $classArray[1];
        $dateForAttendence = $_POST["dateForAttendence"];
        $dateForAttendenceFinal = date('Y-m-d', strtotime($dateForAttendence)); 
        $sqlforAlready = "SELECT * FROM attendencedetails WHERE `sessionName` = '$sessionName' AND `date`= '$dateForAttendenceFinal' AND `class` = '$class'AND `section` = '$section' ORDER BY `firstName`";
        $result = mysqli_query($GLOBALS['conn'],$sqlforAlready);  
        if (mysqli_num_rows($result) == 0) { 
            $sql = "SELECT sessionName, class, section, studentid, firstName, middleName, lastName FROM searchstudent WHERE `sessionName` = '$sessionName' AND `class` = '$class'AND `section` = '$section' ORDER BY `firstName`";
            getOutputFromQueary($sql);
        }
        else{
            getOutputFromQueary($sqlforAlready);
        }    
    }
}

?>