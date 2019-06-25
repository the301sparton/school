<?php
require_once 'db.php';
$type = $_POST['type'];
$amount = 0;
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type == "getMyPaidAmount"){
        
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];

        $sql1 = "SELECT receiptId FROM receiptsList WHERE studentId = '$studentId' AND sessionName = '$sessionName'";

        $result1 = mysqli_query($conn, $sql1);
        if($result1 != null){
            while ($r1 = mysqli_fetch_assoc($result1)) {
                $receiptId = $r1['receiptId'];
                $sql2 = "SELECT amount FROM feesDetails WHERE receiptId = $receiptId";
                $result2 = mysqli_query($conn, $sql2);
                while ($r2 = mysqli_fetch_assoc($result2)) {
                    $tempAmount = $r2['amount'];
                    $amount += $tempAmount;
                }
            }
            echo $amount;
        }
        else{
            echo "E500";
        }
       
    }
   else if($type == "getTotalFees"){
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];
        $tblName = "studentDetails";
        $sql = "SELECT totalFees FROM `$tblName` WHERE studentId = $studentId AND sessionName = '$sessionName'";
        $result = mysqli_query($conn, $sql);
        $r = mysqli_fetch_assoc($result);
        echo $r['totalFees'];
    }

    else if($type == "getReceipt"){
        $receiptId = $_POST['receiptId'];
        $sql = "SELECT receiptId, sessionName, studentId, receiptDate, remark, userId FROM receiptsList WHERE receiptId = $receiptId";
        $result=mysqli_query($conn,$sql);
            
        $r = mysqli_fetch_assoc($result);
        print json_encode($r); 
    }

    else if($type == "getReceiptDetails"){
        $receiptId = $_POST['receiptId'];
        $sql = "SELECT `headId`, `amount` FROM `feesDetails` WHERE receiptid = '$receiptId'";
        $rows = array();    
        $result=mysqli_query($conn,$sql);
            
        while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
        }
        print json_encode($rows); 
    }


    else if($type == "newReceipt"){
        $studentId = $_POST['studentId'];
        $sessionName = $_POST['sessionName'];
        $receiptDate = $_POST['receiptDate'];
        $remark = $_POST['receiptRemark'];
        $userId = $_POST['userId'];
        $headValues = $_POST['headValues'];
        $classId = $_POST['classId'];
        $rDate = date('Y-m-d', strtotime($receiptDate));
        $class = "amount_".$classId;

        $sqlNewReceipt = "INSERT INTO `receiptsList`(`sessionName`, `studentId`, `receiptDate`, `remark`, `userId`) VALUES ('$sessionName', '$studentId', '$rDate', '$remark', '$userId')";
        if($conn->query($sqlNewReceipt) == TRUE) {
            $receiptId = $conn->insert_id;

            $sqlForHeads = "SELECT  headId, headName, `$class` FROM feesHeads WHERE `$class` > 0 ORDER BY headId";
            $result=mysqli_query($conn,$sqlForHeads);
            
            $itr = 0;
            $sqlHead = "INSERT INTO `feesDetails` (`receiptId`, `headId`, `amount`) VALUES ";
            $lengthHeads = count($headValues);
            while($r = mysqli_fetch_assoc($result)) {
                $tempHeadId = $r['headId'];
                $tempHeadVal = $headValues[$itr];
                if($tempHeadVal != 0){
                    $sqlHead = $sqlHead."('$receiptId', '$tempHeadId', '$tempHeadVal'), ";
                }
                $itr++;
            }

            $finalSQLArr = explode(",", $sqlHead);
            $FinalSql = "";
            for($i = 0; $i < count($finalSQLArr); $i++){
                if($i == count($finalSQLArr)-1){
                    $FinalSql = $FinalSql.";".$finalSQLArr[$i];
                }
                else{
                    if($i==0){
                        $FinalSql = $finalSQLArr[$i];
                    }
                    else{
                        $FinalSql = $FinalSql.",".$finalSQLArr[$i];
                    }
                    
                }
            }
            if($conn->query($FinalSql) == TRUE) {
                $res = '{"resCode":200,"id":'.$receiptId.'}';
            echo $res;
            }
            else{
                echo $FinalSql;
            }
        }
    }

    else if($type == "reportByDate"){
        $dateFrom = $_POST['dateFrom'];
        $dateTo = $_POST["dateTo"];
        $studentClass = $_POST['studentClass'];
        $studentSection = $_POST['studentSection'];
        $sessionName = $_POST['sessionName'];

        $tblName = "studentDetails";

        $studentClass1 = $studentClass . "%";
        $studentSection1 = $studentSection . "%";

        $dateFrom = date('Y-m-d', strtotime($dateFrom)); 
        $dateTo = date('Y-m-d', strtotime($dateTo)); 
        

        $sql= "SELECT studentId, photo FROM `$tblName` WHERE `class` LIKE '$studentClass1' AND `section` LIKE '$studentSection1' AND sessionName = '$sessionName'";
        $rows = array();     
        $result=mysqli_query($conn,$sql);
           
        $rowFinal = array();

        while($stud = mysqli_fetch_assoc($result)) {
            $studId = $stud['studentId'];

            $sqlName = "SELECT firstName, middleName, lastName FROM studentInfo WHERE studentId = '$studId'"; 
            $resultName=mysqli_query($conn,$sqlName);
            $studName = mysqli_fetch_assoc($resultName);

            $sqlFinal = "SELECT * FROM receiptsList WHERE receiptDate BETWEEN '$dateFrom' AND '$dateTo' AND sessionName = '$sessionName' AND `studentId` = '$studId'";
            $resultFinal=mysqli_query($conn,$sqlFinal);
            while($r = mysqli_fetch_assoc($resultFinal)) {
                $receiptId = $r['receiptId'];
                $sqlTotal = "SELECT amount FROM feesDetails WHERE receiptId = '$receiptId'";
                $resultTotal=mysqli_query($conn,$sqlTotal);
                $totalAmount = 0;
                while($rTotal = mysqli_fetch_assoc($resultTotal)) {
                    $totalAmount += $rTotal['amount']; 
                }
                $photo = $stud['photo'];
                $r = array_merge($r,array($totalAmount));
                $r = array_merge($r,array($studName));
                $r = array_merge($r,array($photo));
                
                $rowFinal[] = $r;
            }
        }
        echo json_encode($rowFinal);
    }

    else if($type  == "classSummeryReport"){
        $class = $_POST['class'];
        $section = $_POST['section'];
        $sessionName = $_POST['sessionName'];

        $sql = "SELECT studentId, fullname, totalFees, paidFees FROM studentFees WHERE class = '$class' AND section = '$section'";
        $rows = array();     
        $result=mysqli_query($conn,$sql);
                  
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
    }
    else if($type=="headWiseSumm"){ 
        $sql = "SELECT * from headWiseSumm";
        $rows = array();     
        $result=mysqli_query($conn,$sql);
                  
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
    }

}

?>