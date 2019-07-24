<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$type = $_POST['type'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type=="getSectionList"){
        $sql = "SELECT `sectionName` FROM sectionlist ORDER BY `id`";
        getOutputFromQueary($sql);
    }
}