<?php
require_once 'db.php';
$type = $_POST['type'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "byDay"){
        $dateFrom = $_POST['dateFrom'];
        $dateTo = $_POST['dateTo'];
        $sql = "CALL get_datewise_headwise_list('$dateFrom', '$dateTo')";
        $result = mysqli_query($conn, $sql);
        $rows = array();    
        while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
        }
        print json_encode($rows);
    }
    else if($type == "byMonth"){
    
    }
}
?>