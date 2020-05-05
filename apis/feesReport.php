<?php
require_once 'db.php';
require_once 'commonFunctions.php';
$type = $_POST['type'];
$reqType = "feesReports:".$type;
$uid = $_POST['uid'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "byDay"){
        $dateFrom = $_POST['dateFrom'];
        $dateTo = $_POST['dateTo'];
        $searchType = $_POST["searchType"];
        $schoolId = $_POST["schoolId"];
        $classId = $_POST["classId"];
        $sectionId = $_POST["sectionId"];
         if($schoolId == ""){
            $schoolId = 0;
        }
        $sql = "CALL get_datewise_headwise_list('$dateFrom', '$dateTo', '$searchType', '$schoolId', '$classId', '$sectionId')";
        getOutputFromQueary($sql,$uid,$reqType);
        //echo $sql;
    }
    else if($type == "byMonth"){
        $sessionName = $_POST['sessionName'];
        $searchType = $_POST["searchType"];
        $schoolId = $_POST["schoolId"];
        $classId = $_POST["classId"];
        $cond = "";
        $sectionId = $_POST["sectionId"];
        if($schoolId == ""){
            $schoolId = 0;
        }

        $sql = "SELECT DISTINCT headName FROM `headwisefees1` ORDER BY headId";
        $result=mysqli_query($GLOBALS['conn'],$sql);  
        $headList = "";       
        while($r = mysqli_fetch_assoc($result)) {
            $headList = $headList."SUM(IF(`headName`='".$r["headName"]."',`amount`,0)) as '".$r["headName"]."',";
        }
        if($searchType == 0){
            $cond = "";
        }
        else if($searchType == 1)
        {
            $cond = " AND schoolId = '$schoolId'";
        }
        else {
            $cond = " AND className = '$classId' AND section = '$sectionId'";
        }

        $headList = $headList." SUM(`amount`) as 'Total'";
        $headList1 = "SELECT `month`,".$headList." FROM `headwisefees1` WHERE `sessionName` = '$sessionName' $cond GROUP BY `month`";
        $headList2 = $headList1." UNION SELECT 'Total' as `month`, $headList FROM `headwisefees1` WHERE `sessionName` = '$sessionName' $cond";

        // $sql = "CALL get_monthwise_headwise_list('$sessionName', '$searchType', '$schoolId', '$classId', '$sectionId')";
        getOutputFromQueary($headList2,$uid,$reqType);
        //echo $headList2;
    }

    else if($type == "bySchool"){
        $sessionName = $_POST['sessionName'];
        $sql = "CALL get_headwise_schoolwise_sum('$sessionName')";
        getOutputFromQueary($sql,$uid,$reqType);
    }
}
?>