<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "attendence:".$type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "newItem"){
        $scope = $_POST["scope"];
        $scope = $conn->real_escape_string($scope);
        $title = $_POST["title"];
        $title = $conn->real_escape_string($title);
        $message = $_POST["message"];
        $message = $conn->real_escape_string($message);
        $data = $_POST["data"];
        $data = $conn->real_escape_string($data);
        if($scope == 1){
            //SCHOOL WIDE NOTICE
            $schoolId = $data;
            $sql = "INSERT into `schoolDairy` (`uid`, `title`, `message`, `scope`, `schoolId`, `isActive`) VALUES ('$uid', '$title', '$message', $scope, $schoolId, 1)";
        }
        else if($scope == 2){
            //CLASS NOTICE
            $className = explode(",",$data)[0];
            $sectionName = explode(",",$data)[1];
            $sql = "INSERT into `schoolDairy` (`uid`, `title`, `message`, `scope`, `className`, `sectionName`, `isActive`) VALUES ('$uid', '$title', '$message', $scope, '$className', '$sectionName', 1)";
        }       
        if($title != "" && $message != ""){
            get200AsYes($sql,$uid,$reqType);
        }
        else{
            echo 500;
        }
    }


    else if($type == "disableEnableReq"){
        $msgId = $_POST["msgId"];
        $isActive = $_POST["isActive"];
        $sql = "UPDATE `schoolDairy` SET `isActive` = $isActive WHERE `msgId` = $msgId";
        get200AsYes($sql,$uid,$reqType);
    }

    else if($type == "getItems"){
        $noticeSearchBar = $_POST['noticeSearchBar'];
        $noticeSearchBar = $noticeSearchBar . "%";
        $onlyActive = $_POST['onlyActive'];
        if($onlyActive == "ON"){
            $sql = "SELECT * FROM `studentDairyView` WHERE `isActive` = 1 AND `title` LIKE '$noticeSearchBar' ORDER BY `createdOn` DESC";
        }
        else{
            $sql = "SELECT * FROM `studentDairyView` WHERE `title` LIKE '$noticeSearchBar' ORDER BY `createdOn` DESC";
        }
        
        //echo $sql;
        getOutputFromQueary($sql,$uid,$reqType);
    }

    else if($type == "loadClassOrSchoolList"){
        $scope = $_POST["scope"];
        if($scope == 1){
            $sql = "SELECT * from schoolId";
        }
        else if($scope == 2){
            $sql = "SELECT className, section from classlist";
        }
        getOutputFromQueary($sql,$uid,$reqType);
    }

}