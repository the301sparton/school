<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "classList:" . $type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    if ($type == "getClassList") {
        $sql = "SELECT * FROM `classlistview` ORDER BY `className`";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "getOnlyClassName") {
        $sql = "SELECT DISTINCT className from classlist";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "getAllCLassWithAccess") {
        $uid = $_POST["uid"];
        $sql = "SELECT className, section from classlist WHERE teacherid = '$uid'";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "getSectionForClassName") {
        $className = $_POST["className"];
        $sql = "SELECT section from classlist WHERE `className` = '$className'";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "getUserList") {
        $sql = "SELECT DISTINCT users.uid, users.displayName from usergrouplist INNER JOIN users ON usergrouplist.uid = users.uid";
        getOutputFromQueary($sql, $uid, $reqType);
    } else if ($type == "deleteClassItem") {
        $class = $_POST['className'];
        $section = $_POST['section'];
        $cheackSQL = "SELECT id from studentdetails WHERE class = '$class' AND section = '$section'";
        $result = mysqli_query($GLOBALS['conn'], $cheackSQL);
        if (mysqli_num_rows($result) == 0) {
            $sql = "DELETE FROM classlist WHERE className = '$class' AND section = '$section'";
            $colName = "amount_" . $class;
            if ($conn->query($sql) == TRUE) {
                $sql = "ALTER TABLE `feesheads` DROP COLUMN `$colName`";
                get200AsYes($sql, $uid, $reqType);
                logRequest($uid, $type, $sql, "WRITE_SUCCESS");
            } else {
                logRequest($uid, $type, $sql, "WRITE_FAILED");
            }
        } else {
            echo 300;
            logRequest($uid, $type, "CLASS_IN_USE", "WRITE_FAILED");
        }
    } else if ($type == "insertClass") {
        $class = $_POST['className'];
        $section = $_POST['section'];
        $schoolId = $_POST['schoolId'];
        $teacherId = $_POST['teacherId'];
        if ($class != "" && $section != "" && $teacherId != "") {
            $sql = "INSERT INTO classlist (`className`, `section`, `teacherid`, `schoolId`) VALUES ('$class', '$section', '$teacherId', '$schoolId')";
            if($GLOBALS['conn']->query($sql) == TRUE) {
                $colName = "amount_".$class;
                $sql = "ALTER TABLE `feesheads` ADD `$colName` INT NOT NULL DEFAULT '0' ";
                get200AsYes($sql, $uid, $reqType);
            }
            else{
                echo $sql;
                logRequest($uid,$type,$sql,"WRITE_FAILED");
            }
        } else {
            echo $sql;
            logRequest($uid, $type, $sql, "WRITE_FAILED");
        }
    } else if ($type == "updateClass") {
        $class = $_POST['className'];
        $section = $_POST['section'];
        $schoolId = $_POST['schoolId'];
        $teacherId = $_POST['teacherId'];
        $sql = "UPDATE classlist SET teacherid = '$teacherId', schoolId = '$schoolId' WHERE className = '$class' AND section = '$section'";
        get200AsYes($sql, $uid, $reqType);
    } else if ($type == "getAllSchools") {
        $sql = "SELECT * FROM schoolId";
        getOutputFromQueary($sql, $uid, $reqType);
    }
}
