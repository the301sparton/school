<?php
require_once 'db.php';
require_once 'commonFunctions.php';

$reqType = "MobileAuth";
$type = $_POST["type"];

$reqType = $reqType.":".$type;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "loginForMobile"){
        $username = $_POST["username"];
        $password = $_POST["password"];
    
        $username = $conn->real_escape_string($username);
        $password = $conn->real_escape_string($password);
    
        $sql = "Select `studentId`, `firstName`, `middleName`, `gender`, `lastName` from studentinfo WHERE `admissionNumber` = '$username' AND `password` = '$password'";
        $result=mysqli_query($conn,$sql); 
    
        $res = mysqli_fetch_assoc($result);
        if($res != null){
            $sql = "SELECT sessionName FROM sessionlist  
            ORDER BY sessionId DESC  
            LIMIT 1";
    
            $result=mysqli_query($conn,$sql);
            $r = mysqli_fetch_assoc($result);

            $studentId = $res["studentId"];
            $sessionName = $r["sessionName"];
            
            $sql = "SELECT className, section, schoolId, schoolName FROM schoolwisestudents WHERE studentId = '$studentId' AND sessionName = '$sessionName'";            
            $result1=mysqli_query($conn,$sql);
            $r1 = mysqli_fetch_assoc($result1);
            print json_encode(array_merge(array_merge($res,$r), $r1));
        }
        else{
            echo "Invalid Username or Password";
        }
    }
    else if($type == "changePassword"){
        $username = $_POST["username"];
        $passwordOld = $_POST["passwordOld"];
        $passwordNew = $_POST["passwordNew"];
    
        $username = $conn->real_escape_string($username);
        $passwordOld = $conn->real_escape_string($passwordOld);
        $passwordNew = $conn->real_escape_string($passwordNew);

        $sql = "Select `studentId` from studentinfo WHERE `admissionNumber` = '$username' AND `password` = '$passwordOld'";
        $result=mysqli_query($conn,$sql); 
    
        $res = mysqli_fetch_assoc($result);
        $studentId = $res["studentId"];
    
        logRequest(getUserIpAddr(),$requestType, $sql, $res);
        if($res != null){
            $sql = "UPDATE studentinfo SET `password` = '$passwordNew' WHERE `studentId` = $studentId";
            get200AsYes($sql, $username, $reqType);
        }
        else{
            echo "Wrong Password";
        }
    }    
}




?>