<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$type = $_POST['type'];
$reqType = "studentSessionDetail:".$type;
$uid = $_POST['uid'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    
    if($type == "newRecordBySessionName"){

        $sessionName = $_POST['sessionName'];
        $sessionName = mysqli_real_escape_string($conn,$sessionName);
        
        $tbl_name = "studentdetails";

        $studentId = $_POST['studentId'];
        $studentId = mysqli_real_escape_string($conn,$studentId);
        
        $class = $_POST['class'];
        $class = mysqli_real_escape_string($conn,$class);
        
        $section = $_POST['section'];
        $section = mysqli_real_escape_string($conn,$section);
        
        $medium = $_POST['medium'];
        $medium = mysqli_real_escape_string($conn,$medium);
        
        $totalFees = $_POST['totalFees'];
        $totalFees = mysqli_real_escape_string($conn,$totalFees);
        
        $photo = $_POST['photo'];
        

        $sql = "INSERT INTO `$tbl_name`(`sessionName`, `studentId`, `class`, `section`, `medium`, `totalFees`, `photo`) VALUES ('$sessionName','$studentId','$class','$section','$medium','$totalFees','$photo')"; 

        get200AsYes($sql,$uid,$reqType);
    }

    else if($type == "updateSessionDetailsById"){
        $tbl_name = "studentdetails";
        $class = $_POST['class'];
        $class = mysqli_real_escape_string($conn,$class);
        
        $section = $_POST['section'];
        $section = mysqli_real_escape_string($conn,$section);
        
        $medium = $_POST['medium'];
        $medium = mysqli_real_escape_string($conn,$medium);
        
        $totalFees = $_POST['totalFees'];
        $totalFees = mysqli_real_escape_string($conn,$totalFees);
        
        $photo = $_POST['photo'];
        $id = $_POST['id'];
        $id = mysqli_real_escape_string($conn,$id);
        
        $sql = "UPDATE `$tbl_name` SET class = '$class', section = '$section', medium = '$medium', totalFees = '$totalFees', photo = '$photo' WHERE id = '$id'";
        get200AsYes($sql,$uid,$reqType);
    }

    else if($type == "getByStudentId"){
        $tbl = $_POST['sessionName'];
        $tbl_name = "studentdetails";
        $studentId = $_POST['studentId'];

        $sql = "SELECT * FROM `$tbl_name` WHERE studentId = $studentId AND sessionName = '$tbl'";
        printOnlyRowFromQueary($sql);
    }
   
}
?>