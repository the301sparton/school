<?php
require_once 'db.php';
require 'commonFunctions.php';


$type = $_POST['type'];
$reqType = "userGroup:".$type;
$uid = $_POST['uid'];

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
       logRequest($uid,$type,$sql,"READ_UNKNOWN");

    }
    else if($type == "getAllRolesForUser"){
        $uid = $_POST["uid"];
        $sql = "SELECT `id`, `userType` FROM usergrouplist WHERE `uid` = '$uid'";
        getOutputFromQueary($sql,$uid,$reqType);
    }

    else if($type == "deleteUserGroupById"){
        $id = $_POST["id"];
        $sql = "DELETE FROM usergrouplist WHERE `id` = '$id'";
        get200AsYes($sql,$uid,$reqType);
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
        logRequest($uid,$type,$sql2,"READ_UNKNOWN");

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
        logRequest($uid,$type,$sql,$toReturn);

    }

    

    else if($type == "getAllRolesWithId"){
        $sql = "SELECT * from usergroup";
        getOutputFromQueary($sql,$uid,$reqType);
    }
    else if($type == "updateUserGroup"){
        $userType = $_POST["userType"];
        $manageUsers = $_POST["manageUsers"];
        $manageRoles = $_POST["manageRoles"];
        $manageFeesHeads = $_POST["manageFeesHeads"];
        $newAccadamicYear = $_POST["newAccadamicYear"];
        $registerStudent = $_POST["registerStudent"];
        $searchNEdit = $_POST["searchNEdit"];
        $manageClass = $_POST["manageClass"];
        $generateReceipt = $_POST["generateReceipt"];
        $feesReport = $_POST["feesReport"];
        $studentAttendence = $_POST["studentAttendence"];
        $studentReport = $_POST["studentReport"];
        $schoolDiary = $_POST["schoolDiary"];

        $sql = "UPDATE usergroup SET `manageUsers` = '$manageUsers', `manageRoles` = '$manageRoles', `manageFeesHeads` = '$manageFeesHeads', `newAccadamicYear` = '$newAccadamicYear', `registerStudent` = '$registerStudent', `searchNEdit` = '$searchNEdit', `manageClass` = '$manageClass', `generateReceipt` = '$generateReceipt', `feesReport` = '$feesReport', `studentAttendence` = '$studentAttendence', `studentReport` = '$studentReport', `schoolDairy` = '$schoolDiary' WHERE `userType` = '$userType'";
        get200AsYes($sql,$uid,$reqType);
    }
    else if($type == "deleteUserGroup"){
        $userType = $_POST["userType"];
        $sql = "DELETE FROM usergroup WHERE userType = '$userType'";
        if($conn->query($sql) == TRUE) {
           $sql1 = "DELETE FROM usergrouplist WHERE userType = '$userType'";
           get200AsYes($sql1,$uid,$reqType);
        }
        else{
            echo 500;
            logRequest($uid,$type,$sqlforSession,"");

        }
    }

    else if($type == "createNewRole"){
        $userType = $_POST['newGroupName'];
        $manageUsers = $_POST['NewNanageUsers'];
        $manageRoles = $_POST['NewManageRoles'];
        $manageFeesHeads = $_POST['NewManageFeesHeads'];
        $newAccadamicYear = $_POST['NewNewAccadamicYear'];
        $registerStudent = $_POST['NewRegisterStudent'];
        $searchNEdit = $_POST['NwSearchNEdit'];
        $manageClass = $_POST['NewManageClass'];
        $generateReceipt = $_POST['NewGenerateReceipt'];
        $feesReport = $_POST['NewFeesReport'];
        $NwSchoolDiary = $_POST["NwSchoolDiary"];
        $studentAttendence = $_POST['NewStudentAttendence'];
        $studentReport = $_POST['NewStudentReport'];
        $sql = "INSERT INTO `usergroup`(`userType`, `manageUsers`, `manageRoles`, `manageFeesHeads`, `newAccadamicYear`, `registerStudent`, `searchNEdit`, `schoolDairy`, `manageClass`, `generateReceipt`, `feesReport`, `studentAttendence`, `studentReport`) VALUES ('$userType', '$manageUsers', '$manageRoles', '$manageFeesHeads', '$newAccadamicYear', '$registerStudent', '$searchNEdit', '$NwSchoolDiary','$manageClass', '$generateReceipt', '$feesReport', '$studentAttendence', '$studentReport')";
        get200AsYes($sql,$uid,$reqType);
    }
}
?>