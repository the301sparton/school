<?php

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
function getOutputFromQueary($sql){
    $rows = array();
    $result=mysqli_query($GLOBALS['conn'],$sql);         
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
    
}

function get200AsYes($sql){
    if($GLOBALS['conn']->query($sql) == TRUE) {
        echo 200;
    }
}

function printOnlyRowFromQueary($sql){
        $result=mysqli_query($GLOBALS['conn'],$sql);
          
        $r = mysqli_fetch_assoc($result);
        print json_encode($r);
}


?>