<?php
require_once 'db.php';
$type = $_POST['type'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    if ($type == "name") {
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $tbl = $_POST['sessionName'];
        $tbl_name = "studentDetails";

        $name = $nameIP . "%";

        $sql1 = "SELECT `studentId`,`admissionNumber`, `firstName`, `middleName`, `lastName` FROM studentInfo WHERE firstName LIKE '$name' OR lastName LIKE '$name' LIMIT $limit";
        $result = mysqli_query($conn, $sql1);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $sid = $r['studentId'];
            $sql2 = "SELECT * FROM `$tbl_name` WHERE studentId = '$sid' AND sessionName = '$tbl'";
            $result2 = mysqli_query($conn, $sql2);
            $r2 = mysqli_fetch_assoc($result2);
            if ($r2 != null) {
                $finalElement = array_merge($r, $r2);
                $rows[] = $finalElement;
            }
        }
        echo json_encode($rows);
    }
    else if($type == "admissionNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $tbl = $_POST['sessionName'];
        $tbl_name = "studentDetails";

        $name = $nameIP . "%";

        $sql1 = "SELECT `studentId`,`admissionNumber`, `firstName`, `middleName`, `lastName` FROM studentInfo WHERE `admissionNumber` LIKE '$name' LIMIT $limit";
        $result = mysqli_query($conn, $sql1);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $sid = $r['studentId'];
            $sql2 = "SELECT * FROM `$tbl_name` WHERE studentId = '$sid' AND sessionName = '$tbl'";
            $result2 = mysqli_query($conn, $sql2);
            $r2 = mysqli_fetch_assoc($result2);
            if ($r2 != null) {
                $finalElement = array_merge($r, $r2);
                $rows[] = $finalElement;
            }
        }
        echo json_encode($rows);
    }
    else if($type == "aadharNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $tbl = $_POST['sessionName'];
        $tbl_name = "studentDetails";

        $name = $nameIP . "%";

        $sql1 = "SELECT `studentId`,`admissionNumber`, `firstName`, `middleName`, `lastName` FROM studentInfo WHERE `aadharNumber` LIKE '$name' LIMIT $limit";
        $result = mysqli_query($conn, $sql1);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $sid = $r['studentId'];
            $sql2 = "SELECT * FROM `$tbl_name` WHERE studentId = '$sid' AND sessionName = '$tbl'";
            $result2 = mysqli_query($conn, $sql2);
            $r2 = mysqli_fetch_assoc($result2);
            if ($r2 != null) {
                $finalElement = array_merge($r, $r2);
                $rows[] = $finalElement;
            }
        }
        echo json_encode($rows);
    }
    else if($type == "formNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $tbl = $_POST['sessionName'];
        $tbl_name = "studentDetails";

        $name = $nameIP . "%";

        $sql1 = "SELECT `studentId`,`admissionNumber`, `firstName`, `middleName`, `lastName` FROM studentInfo WHERE `formNumber` LIKE '$name' LIMIT $limit";
        $result = mysqli_query($conn, $sql1);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $sid = $r['studentId'];
            $sql2 = "SELECT * FROM `$tbl_name` WHERE studentId = '$sid' AND sessionName = '$tbl'";
            $result2 = mysqli_query($conn, $sql2);
            $r2 = mysqli_fetch_assoc($result2);
            if ($r2 != null) {
                $finalElement = array_merge($r, $r2);
                $rows[] = $finalElement;
            }
        }
        echo json_encode($rows);
    }
    else if($type == "parentPhoneNumber"){
        $nameIP = $_POST['inputKeyWord'];
        $limit = $_POST['limit'];
        $tbl = $_POST['sessionName'];
        $tbl_name = "studentDetails";

        $name = $nameIP . "%";

        $sql1 = "SELECT `studentId`,`admissionNumber`, `firstName`, `middleName`, `lastName` FROM studentInfo WHERE `guardianPhone` LIKE '$name' LIMIT $limit";
        $result = mysqli_query($conn, $sql1);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $sid = $r['studentId'];
            $sql2 = "SELECT * FROM `$tbl_name` WHERE studentId = '$sid' AND sessionName = '$tbl'";
            $result2 = mysqli_query($conn, $sql2);
            $r2 = mysqli_fetch_assoc($result2);
            if ($r2 != null) {
                $finalElement = array_merge($r, $r2);
                $rows[] = $finalElement;
            }
        }
        echo json_encode($rows);
    }
}
