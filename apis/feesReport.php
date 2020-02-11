<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "feesReports:".$type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "byDay"){
        $dateFrom = $_POST['dateFrom'];
        $dateTo = $_POST['dateTo'];
        $sql = "CALL get_datewise_headwise_list('$dateFrom', '$dateTo')";
        getOutputFromQueary($sql,$uid,$reqType);
    }
    else if($type == "byMonth"){
        $sessionName = $_POST['sessionName'];
        $sql = "CALL get_monthwise_headwise_list('$sessionName')";
        getOutputFromQueary($sql,$uid,$reqType);
    }

    else if($type == "bySchool"){
        $sessionName = $_POST['sessionName'];
        $sql = "CALL get_headwise_schoolwise_sum('$sessionName')";
        getOutputFromQueary($sql,$uid,$reqType);
    }
}
?>