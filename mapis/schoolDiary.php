<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$reqType = "schoolDiary: getByApp";
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    $schoolId = $_POST["schoolId"];
    $className = $_POST["className"];
    $section = $_POST["section"];
    $timeSinceEpoc = $_POST["unixTime"];

    $schoolId = $conn->real_escape_string($schoolId);
    $className = $conn->real_escape_string($className);
    $uid = $conn->real_escape_string($uid);
    $section = $conn->real_escape_string($section);
    $timeSinceEpoc = $conn->real_escape_string($timeSinceEpoc);

    $headerStringValue = $_SERVER['HTTP_HMAC'];
    $payload = $timeSinceEpoc.$uid.$schoolId.$className.$section;

    if(checkAuth($payload, $uid, $headerStringValue)){
        $sql = "SELECT * FROM studentDairyView WHERE (`schoolId` = '$schoolId' AND `isActive` = 1) OR (`className` = '$className' AND `sectionName` = '$section' AND `isActive` = 1)";
        getOutputFromQueary($sql,$uid,$reqType);
    }
}

?>