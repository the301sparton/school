<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type=="getClassList"){
        $sql = "SELECT * FROM `classListView` ORDER BY `className`";
        getOutputFromQueary($sql);
    }
    else if($type == "getUserList"){
        $sql = "SELECT DISTINCT users.uid, users.displayName from usergrouplist INNER JOIN users ON usergrouplist.uid = users.uid";
        getOutputFromQueary($sql);
    }
}