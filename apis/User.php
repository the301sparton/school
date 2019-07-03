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
    
   
    if($type == "newUser"){
        
        $uid = $_POST['uid'];
        $displayName = $_POST['displayName'];
        $eid = $_POST['eid'];
        $mobileNumber = $_POST['mobileNumber'];
    
        $sql = "INSERT INTO `users`(`uid`, `displayName`, `eid`, `mobileNumber`) VALUES ('$uid','$displayName','$eid','$mobileNumber')";
        if($conn->query($sql) == TRUE) {
            echo "200";
        }
        else{
            echo "400";
        }
    }
    else if($type == "getById"){
        $uid = $_POST['uid'];
    
        $sql = "SELECT * FROM users WHERE uid='$uid'";
        $result=mysqli_query($conn,$sql);
        $rows = array();    
        while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
        }
        print json_encode($rows);   
    }

    else if($type == "getAllUsers"){
        $sql = "SELECT * FROM users";
        $result=mysqli_query($conn,$sql);
        $rows = array();    
        while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
        }
        print json_encode($rows);
    }

    else if($type == "updateUser"){
        $uid = $_POST["uid"];
        $displayName = $_POST['displayName'];
        $eid = $_POST['eid'];
        $mobileNumber = $_POST['mobileNumber'];

        $sql = "UPDATE users SET `displayName` = '$displayName', `eid` = '$eid', `mobileNumber` = '$mobileNumber' WHERE `uid` = '$uid'";
        if($conn->query($sql) == TRUE) {
            echo 200;
        }
        else{
            echo 500;
        }
    }
}

?>