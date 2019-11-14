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
        $sql = "SELECT * FROM `classlistview` ORDER BY `className`";
        getOutputFromQueary($sql);
    }

    else if($type == "getOnlyClassName"){
        $sql = "SELECT DISTINCT className from classlist";
        getOutputFromQueary($sql);
    }

    else if($type == "getAllCLassWithAccess"){
        $uid = $_POST["uid"];
        $sql = "SELECT className, section from classlist WHERE teacherid = '$uid'";
        getOutputFromQueary($sql);
    }

    else if($type == "getSectionForClassName"){
        $className = $_POST["className"];
        $sql = "SELECT section from classlist WHERE `className` = '$className'";
        getOutputFromQueary($sql);
    }

    else if($type == "getUserList"){
        $sql = "SELECT DISTINCT users.uid, users.displayName from usergrouplist INNER JOIN users ON usergrouplist.uid = users.uid";
        getOutputFromQueary($sql);
    }
    else if($type == "deleteClassItem"){
        $class = $_POST['className'];
        $section = $_POST['section'];
        $cheackSQL = "SELECT id from studentdetails WHERE class = '$class' AND section = '$section'";
        $result=mysqli_query($GLOBALS['conn'],$cheackSQL);  
        if (mysqli_num_rows($result) == 0) { 
            $sql = "DELETE FROM classlist WHERE className = '$class' AND section = '$section'";
            get200AsYes($sql);
        }
        else{
            echo 300;
        }    
    }

    else if($type == "insertClass"){
        $class = $_POST['className'];
        $section = $_POST['section'];
        $teacherId = $_POST['teacherId'];
        if($class != "" && $section != "" && $teacherId != ""){
            $sql = "INSERT INTO classlist (`className`, `section`, `teacherid`) VALUES ('$class', '$section', '$teacherId')";
            get200AsYes($sql);
        }
        else{
            echo 500;
        }
        
    }

    else if($type == "updateClassTeacher"){
        $class = $_POST['className'];
        $section = $_POST['section'];
        $teacherId = $_POST['teacherId'];
        $sql = "UPDATE classlist SET teacherid = '$teacherId' WHERE className = '$class' AND section = '$section'";
        get200AsYes($sql);
    }
}

?>