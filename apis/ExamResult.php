<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "exam:".$type;
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

    else if($type == "saveResultRecords"){
        $dataArray = $_POST["data"];
        $sql = "INSERT into resultsrecords (`studentId`, `sessionName`, `date`, `marks`, `remark`, `subject`, `totalMarks`) values ";
        $counter = 0;
        foreach($dataArray as $student){
            
            $date = $student["date"];
            $dateForAttendenceFinal = date('Y-m-d', strtotime($date)); 
            $sessionName = $student["sessionName"];
            $studentId = $student["studentId"];
            $marks = $student["marks"];
            $remarks = $student["remarks"];
            $subject = $student["subject"];
            $totalMarks = $student["totalMarks"];

            if( $counter == count( $dataArray ) - 1) { 
            $sql = $sql."('$studentId', '$sessionName', '$dateForAttendenceFinal', '$marks', '$remarks', '$subject', '$totalMarks');";
            }
            else{
                $sql = $sql."('$studentId', '$sessionName', '$dateForAttendenceFinal', '$marks', '$remarks', '$subject', '$totalMarks'), ";
            }
            $counter = $counter + 1;
        }
        if($conn->query($sql) == TRUE) {
            echo 200;
        }
        else{
            echo $sql;
        }
    }

    else if($type == "updateResultRecords"){
        $dataArray = $_POST["data"];
        $sql = "UPDATE resultsrecords
        SET marks = CASE resultId ";
        $attendenceIdArray = array();
        foreach($dataArray as $student){
            $marks = $student["marks"];
            $attendenceId = $student["resultId"];
            array_push($attendenceIdArray, $attendenceId);
            $sql = $sql."WHEN '$attendenceId' THEN '$marks' ";
        }

        $sql = $sql."END, remark = CASE resultId";

        foreach($dataArray as $student){
            $remarks = $student["remarks"];
            $attendenceId = $student["resultId"];
            $sql = $sql." WHEN '$attendenceId' THEN '$remarks' ";
        }
        $sql = $sql."END WHERE resultId IN (";
        $counter = 0;
        foreach($attendenceIdArray as $id){
            if($counter == count( $dataArray ) - 1){
                $sql = $sql."$id)";
            }
            else{
                $sql = $sql."$id,";
            }  
            $counter = $counter + 1;          
        }
        get200AsYes($sql,$uid,$reqType);
    }
}
