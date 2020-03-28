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
        $title = $_POST["title"];
        $message = $_POST["message"];
        $createdOn = $_POST["createdOn"];
        $createdOn = date('Y-m-d', strtotime($createdOn));
        if($scope == 1){
            //SCHOOL WIDE NOTICE
            $schoolId = $_POST["schoolId"];
            $sql = "INSERT into `schoolDairy` (`createdOn`, `uid`, `title`, `message`, `scope`, `schoolId`, `isActive`) VALUES ('$createdOn', '$uid', '$title', '$message', $scope, $schoolId, 1)";
        }
        else if($scope == 2){
            //CLASS NOTICE
            $className = $_POST["className"];
            $sectionName = $_POST["sectionName"];
            $sql = "INSERT into `schoolDairy` (`createdOn`, `uid`, `title`, `message`, `scope`, `className`, `sectionName`, `isActive`) VALUES ('$createdOn', '$uid', '$title', '$message', $scope, '$className', '$sectionName', 1)";
        }       

        get200AsYes($sql,$uid,$reqType);
    }


    // else if($type == "getItems"){
    //     $scope = $_POST["scope"];
    //     if($scope == 1){
    //         //SCHOOL WIDE NOTICE
    //         $schoolId = $_POST["schoolId"];
    //         $sql = "SELECT `createdOn`, `title`, `message`, `scope`, `schoolId`, `isActive` FROM `schoolDairy` WHERE `scope` = 1 AND `schoolId` = $schoolId ORDER BY `createdOn` DESC";
    //     }
    //     else if($scope == 2){
    //         //CLASS NOTICE
    //         $className = $_POST["className"];
    //         $sectionName = $_POST["sectionName"];
    //         $sql = "SELECT `createdOn`, `title`, `message`, `scope`, `className`, `sectionName`, `isActive` FROM `schoolDairy` WHERE `scope` = 2 AND `className` = '$className' AND `sectionName` = '$sectionName' ORDER BY `createdOn` DESC";
    //     }
    //     else if($scope == 3){
    //         //Personal NOTICE
    //         $studentId = $_POST["studentId"];
    //         $sessionName = $_POST["sessionName"];
    //         $sql = "SELECT `createdOn`, `title`, `message`, `scope`, `studentId`, `sessionName`, `isActive` FROM `schoolDairy` WHERE `scope` = 3 AND `studentId` = $studentId AND `sessionName` = '$sessionName' ORDER BY `createdOn` DESC";
    //     }

    //     getOutputFromQueary($sql,$uid,$reqType);
    // }

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

}