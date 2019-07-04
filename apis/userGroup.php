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
    if($type == "getRoleList"){
        $uid = $_POST['uid'];
        $rows = array();
        $sql = "SELECT userType FROM usergrouplist WHERE uid='$uid'";
        $result=mysqli_query($conn,$sql);         
        while($r = mysqli_fetch_assoc($result)) {
        $userType = $r["userType"];
        $sql = "SELECT * FROM usergroup WHERE userType = '$userType'";
            $result2=mysqli_query($conn,$sql);                
                while($r2 = mysqli_fetch_assoc($result2)) {
                $rows[] = $r2;
                }            
        }
       print json_encode($rows);
    }
}