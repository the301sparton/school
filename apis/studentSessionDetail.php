<?php
require_once 'db.php';


$type = $_POST['type'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    
    if($type == "newRecordBySessionName"){

        $sessionName = $_POST['sessionName'];
        $tbl_name = "studentDetails";

        $studentId = $_POST['studentId'];
        $class = $_POST['class'];
        $section = $_POST['section'];
        $medium = $_POST['medium'];
        $totalFees = $_POST['totalFees'];
        $photo = $_POST['photo'];

        $sql = "INSERT INTO `$tbl_name`(`sessionName`, `studentId`, `class`, `section`, `medium`, `totalFees`, `photo`) VALUES ('$sessionName','$studentId','$class','$section','$medium','$totalFees','$photo')"; 

        if($conn->query($sql) == TRUE) {
            echo 200;
        }
        else{
            echo 500;
        }
    }

    else if($type == "updateSessionDetailsById"){
        $tbl_name = "studentDetails";
        $class = $_POST['class'];
        $section = $_POST['section'];
        $medium = $_POST['medium'];
        $totalFees = $_POST['totalFees'];
        $photo = $_POST['photo'];
        $id = $_POST['id'];

        $sql = "UPDATE `$tbl_name` SET class = '$class', section = '$section', medium = '$medium', totalFees = '$totalFees', photo = '$photo' WHERE id = '$id'";
        if($conn->query($sql) == TRUE) {
            echo 200;
        }
        else{
            echo 500;
        }
    }

    else if($type == "getByStudentId"){

        $tbl = $_POST['sessionName'];
        $tbl_name = "studentDetails";
        $studentId = $_POST['studentId'];

        $sql = "SELECT * FROM `$tbl_name` WHERE studentId = $studentId AND sessionName = '$tbl'";
        $result=mysqli_query($conn,$sql);
        $rows = array();    
        $r = mysqli_fetch_assoc($result);
        print json_encode($r);
    }
   
}
?>