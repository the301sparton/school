<?php
require_once 'db.php';
require_once 'commonFunctions.php';

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
        $photo = $_POST['photo'];
        $sql = "INSERT INTO `users`(`uid`, `displayName`, `eid`, `mobileNumber`, `photo`) VALUES ('$uid','$displayName','$eid','$mobileNumber', '$photo')";
        get200AsYes($sql);
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
        getOutputFromQueary($sql);
    }

    else if($type == "getById"){
        $uid = $_POST['uid'];
    
        $sql = "SELECT * FROM users WHERE uid='$uid'";
        getOutputFromQueary($sql); 
    }

    else if($type == "getAllUsers"){
        $sql = "SELECT * FROM users";
        getOutputFromQueary($sql);
    }

    else if($type == "updateUser"){
        $uid = $_POST["uid"];
        $displayName = $_POST['displayName'];
        $eid = $_POST['eid'];
        $mobileNumber = $_POST['mobileNumber'];
        $photo = $_POST['photo'];
        $sql = "UPDATE users SET `displayName` = '$displayName', `eid` = '$eid', `mobileNumber` = '$mobileNumber', `photo` = '$photo' WHERE `uid` = '$uid'";
        get200AsYes($sql);
    }

    else if($type == "deleteUserByUid"){
        $uid = $_POST["uid"];
        $sql = "DELETE FROM usergrouplist WHERE `uid` = '$uid'";
        if($conn->query($sql) == TRUE) {
           $sql1 = "DELETE FROM users WHERE `uid` = '$uid'";
           get200AsYes($sql1);
        }
        else{
            echo 500;
        }
    }
}

?>