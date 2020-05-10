<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$type = $_POST['type'];
$reqType = "User:".$type;
$uid = $_POST['uid'];

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
        $photo = $_POST['photo'];
        $sql = "INSERT INTO `users`(`uid`, `displayName`, `eid`, `mobileNumber`, `photo`) VALUES ('$uid','$displayName','$eid','$mobileNumber', '$photo')";
        get200AsYes($sql,$uid,$reqType);
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
        else if($searchType == "ALL"){
            $sql = "SELECT * from users LIMIT $limit";
        }
        getOutputFromQueary($sql,$uid,$reqType);
    }

    else if($type == "getById"){
        $uid = $_POST['uid'];
        $_SESSION["uid"] = $uid;
        $sql = "SELECT * FROM users WHERE uid='$uid'";
        getOutputFromQueary($sql,$uid,$reqType); 
    }

    else if($type == "getAllUsers"){
        $sql = "SELECT * FROM users";
        getOutputFromQueary($sql,$uid,$reqType);
    }

    else if($type == "updateUser"){
        $uid = $_POST["uid"];
        $displayName = $_POST['displayName'];
        $eid = $_POST['eid'];
        $mobileNumber = $_POST['mobileNumber'];
        $photo = $_POST['photo'];
        $sql = "UPDATE users SET `displayName` = '$displayName', `eid` = '$eid', `mobileNumber` = '$mobileNumber', `photo` = '$photo' WHERE `uid` = '$uid'";
        get200AsYes($sql,$uid,$reqType);
    }

    else if($type == "deleteUserByUid"){
        $uid = $_POST["uid"];
        $sql = "DELETE FROM usergrouplist WHERE `uid` = '$uid'";
        if($conn->query($sql) == TRUE) {
           $sql1 = "DELETE FROM users WHERE `uid` = '$uid'";
           get200AsYes($sql1,$uid,$reqType);
        }
        else{
            echo 500;
        }
    }
}

?>