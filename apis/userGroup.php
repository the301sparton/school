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
    else if($type == "getAllRolesForUser"){
        $uid = $_POST["uid"];
        $sql = "SELECT `id`, `userType` FROM usergrouplist WHERE `uid` = '$uid'";
        $rows = array();
        $result=mysqli_query($conn,$sql);         
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        print json_encode($rows);
    }

    else if($type == "deleteUserGroupById"){
        $id = $_POST["id"];
        $sql = "DELETE FROM usergrouplist WHERE `id` = '$id'";
        if($conn->query($sql) == TRUE) {
            echo 200;
        }
        else{
            echo 500;
        }
    }

    else if($type == "getUserGroupsToAdd"){
        $uid = $_POST['uid'];
        $rows = array();
        $rowsFinal = array();
        $sql = "SELECT userType FROM usergrouplist WHERE uid='$uid'";
        $result=mysqli_query($conn,$sql);         
        while($r = mysqli_fetch_assoc($result)) {
                $rows[] = $r;
        }

        $sql2 = "SELECT userType from usergroup";
        $result2=mysqli_query($conn,$sql2);         
        while($r2 = mysqli_fetch_assoc($result2)) {
            if(!in_array($r2,$rows)){
                $rowsFinal[] = $r2;
            }   
        }
        print json_encode($rowsFinal);
    }
}