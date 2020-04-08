<?php
require_once '../../apis/db.php';
require_once './commonFunctions.php';
$type = $_POST["type"];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    else{
        if($type == "getSubList"){
            $sql = "SELECT * FROM `t_subWiseQuesCount`";
            getOutputFromQueary($sql);
        }
        else if($type == "getSubById"){
            $subjectId = $_POST["id"];
            $sql = "SELECT * FROM `t_subWiseQuesCount` WHERE `subjectId` = '$subjectId'";
            printOnlyRowFromQueary($sql);
        }
        else if($type == "UpdateSubById"){
            $subjectId = $_POST["subjectId"];
            $subject = $_POST["subject"];
            $level = $_POST["level"];
            $remark = $_POST["remark"];
            $sql = "UPDATE `t_subjects` SET `subject` = '$subject', `level` = '$level', `remark` = '$remark' WHERE `subjectId` = '$subjectId'";
            get200AsYes($sql);
        }

        else if($type == "CreateSubNLevel"){
            $subjectId = $_POST["subjectId"];
            $subject = $_POST["subject"];
            $level = $_POST["level"];
            $remark = $_POST["remark"];
            $sql = "INSERT INTO `t_subjects`( `remark`, `subject`, `level`) VALUES ('$remark', '$subject', '$level')";
            get200AsYes($sql);
        }
    }
}

else {
    header('HTTP/1.0 405 Method Not Allowed');
}
