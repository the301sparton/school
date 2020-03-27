<?php

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
function getOutputFromQueary($sql, $uid, $type){
    $rows = array();
    $result=mysqli_query($GLOBALS['conn'],$sql);         
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
    if(count($rows) > 0){
        logRequest($uid,$type,$sql,"READ_SUCCESS");
    }
    else{
        logRequest($uid,$type,$sql,"READ_FAILED");
    }
}

function get200AsYes($sql, $uid, $type){
    if($GLOBALS['conn']->query($sql) == TRUE) {
        echo 200;
        logRequest($uid,$type,$sql,"WRITE_SUCCESS");
    }
    else{
        echo $sql;
        logRequest($uid,$type,$sql,"WRITE_FAILED");
    }
    
}

function printOnlyRowFromQueary($sql){
        $result=mysqli_query($GLOBALS['conn'],$sql);
          
        $r = mysqli_fetch_assoc($result);
        print json_encode($r);
}

function logRequest($uid,$requestType, $sql, $res){
    $log  = "TYPE: ".$requestType.' - '.date("F j, Y, g:i:s a").PHP_EOL.
        "ATTEMPT: ".$sql.PHP_EOL.
        "RESULT: ".$res.PHP_EOL.
        "USER: ".$uid.PHP_EOL.
        "-------------------------".PHP_EOL;
        //Save string to log, use FILE_APPEND to append.
    file_put_contents('./logs/log_'.date("j.n.Y").'.log', $log, FILE_APPEND);
}

?>