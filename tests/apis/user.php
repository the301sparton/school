<?php
require_once '../../vendor/autoload.php';
require_once '../../apis/db.php';

use \Firebase\JWT\JWT;

$type = $_POST["type"];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    else{
        if($type == "getAuth"){
            $uid = $_POST['uid'];
            $rows = array();
            $sql = "SELECT userType FROM usergrouplist WHERE uid='$uid'";
            $result=mysqli_query($conn,$sql);         
            while($r = mysqli_fetch_assoc($result)) {
            $userType = $r["userType"];
            $sql = "SELECT `t_createExam`, `t_createSubject`, `t_viewResult`, `t_addQuestion` FROM usergroup WHERE userType = '$userType'";
                $result2=mysqli_query($conn,$sql);                
                    while($r2 = mysqli_fetch_assoc($result2)) {
                    $rows[] = $r2;
                    }            
            }
        print json_encode($rows);
        }
        else{
            echo "TYPE NOT FOUND ERROR";
        }
    }
}
else {
    header('HTTP/1.0 405 Method Not Allowed');
}

