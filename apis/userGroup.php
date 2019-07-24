<?php
require_once 'db.php';
require 'commonFunctions.php';


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
        getOutputFromQueary($sql);
    }

    else if($type == "deleteUserGroupById"){
        $id = $_POST["id"];
        $sql = "DELETE FROM usergrouplist WHERE `id` = '$id'";
        get200AsYes($sql);
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

    else if($type == "addNewRoles"){
        $uid = $_POST['uid'];
        $thingsToAdd = $_POST['thingsToAdd'];
        $toReturn = 200;
        foreach($thingsToAdd as $userType){
            $sql = "INSERT into `usergrouplist` (`uid`, `userType`) VALUES ('$uid', '$userType')";
            if($conn->query($sql) == TRUE) {
                $toReturn = 200;
            }
            else{
                $toReturn = 500;
                break;
            }
        }
        echo $toReturn;
    }

    else if($type == "searchUser"){
        $searchType = $_POST["searchType"];
        $inputSearch = $_POST['inputSearch'];
        $inputSearch = $inputSearch."%";
        $limit = $_POST['limit'];

        if($searchType == "byName"){
            $sql = "SELECT * from users WHERE `displayName` LIKE '$inputSearch' LIMIT $limit";
        }
        else if($searchType == "byEmailId"){
            $sql = "SELECT * from users WHERE `eid` LIKE '$inputSearch' LIMIT $limit";
        }
        else if($searchType == "byPhoneNumber"){
            $sql = "SELECT * from users WHERE `mobileNumber` LIKE '$inputSearch' LIMIT $limit";
        }
        getOutputFromQueary($sql);
    }

    else if($type == "getAllRolesWithId"){
        $sql = "SELECT * from usergroup";
        getOutputFromQueary($sql);
    }
}
?>