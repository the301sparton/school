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
        if($type == "getQforSNL"){
            $subject = $_POST["subject"];
            $level = $_POST["level"];
            $sql = "SELECT * FROM `t_objquestions` WHERE `subject` = '$subject' AND `level` = '$level'";
            getOutputFromQueary($sql);
        }

        else {
            echo "TYPE NOT ALLOWED";
            header('HTTP/1.0 405 Method Not Allowed');
        }
    }
}
else {
    header('HTTP/1.0 405 Method Not Allowed');
}
