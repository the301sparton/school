<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "academicSession:".$type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "getCurrentSession"){
        $sql = "SELECT sessionName FROM sessionlist  
        ORDER BY sessionId DESC  
        LIMIT 1";

        $result=mysqli_query($conn,$sql);
        $r = mysqli_fetch_assoc($result);
        print json_encode($r);
    }
    else if($type == "getAllSessions"){
        $sql = "SELECT sessionName FROM sessionlist";
        getOutputFromQueary($sql,$uid,$reqType);
    }
}

?>