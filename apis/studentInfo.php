<?php
require_once 'db.php';
$type = $_POST['type'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type=="newStudentDetails"){
        $formNumber = $_POST["formNumber"];
        $admissionNumber = $_POST["admissionNumber"];
        $govermentId = $_POST["govermentId"];
        $firstName = $_POST["firstName"];
        $middleName = $_POST["middleName"];
        $lastName = $_POST["lastName"];
        $motherName = $_POST["motherName"];
        $fatherName = $_POST["fatherName"];
        $gender = $_POST['gender'];
        $aadharNumber = $_POST["aadharNumber"];
        $dob_temp = $_POST["dob"];
        $pob_city = $_POST['pob_city'];
        $pob_dist = $_POST['pob_dist'];
        $pob_state = $_POST['pob_state'];
        $religion = $_POST["religion"];
        $castNRace = $_POST["casteNRace"];
        $nationality = $_POST["nationality"];
        $motherTounge = $_POST["motherTounge"];
        $lastSchool = $_POST["lastSchool"];
        $lastClass = $_POST["lastClass"];
        $doa_temp = $_POST["doa"];
        $submittedTC = $_POST["submittedTC"];
        $rte = $_POST['rte'];
        $sessionName = $_POST['sessionName'];
        
        $dob = date('Y-m-d', strtotime($dob_temp)); 
        $doa = date('Y-m-d', strtotime($doa_temp));

        $sql = "INSERT INTO `studentInfo` (`formNumber`, `admissionNumber`, `govermentId`, `firstName`, `middleName`, `lastName`, `motherName`, `fatherName`,`gender`, `aadharNumber`, `dob`,`pob_city`, `pob_dist`, `pob_state`, `religion`, `casteNRace`, `nationality`, `motherTounge`, `lastSchool`, `lastClass`, `doa`, `submittedTC`,`rte`) VALUES ('$formNumber','$admissionNumber','$govermentId','$firstName','$middleName','$lastName','$motherName','$fatherName','$gender','$aadharNumber','$dob','$pob_city','$pob_dist','$pob_state','$religion','$castNRace','$nationality','$motherTounge','$lastSchool','$lastClass','$doa','$submittedTC','$rte')";
        if($conn->query($sql) == TRUE) {
            $res = '{"resCode":200,"id":'.$conn->insert_id.'}';
            $studentId = $conn->insert_id;
            $sqlforSession = "INSERT INTO studentDetails (studentId, sessionName) VALUES ('$studentId', '$sessionName')";
            if($conn->query($sqlforSession) == TRUE){
                echo $res;
            }
        }
        else{
            echo $sql;
        }
    }

    else if($type=="getStudentDetailsById"){
        $studentId = $_POST['studentId'];
        $sql = "SELECT `formNumber`, `admissionNumber`, `govermentId`, `firstName`, `middleName`, `lastName`, `motherName`, `fatherName`, `gender`, `aadharNumber`, `dob`, `pob_city`, `pob_dist`,`pob_state`, `religion`, `casteNRace`, `nationality`, `motherTounge`, `lastSchool`, `lastClass`, `doa`, `submittedTC`, `rte` FROM `studentInfo` WHERE studentId = $studentId";
        $result=mysqli_query($conn,$sql);
        $rows = array();    
        $r = mysqli_fetch_assoc($result);
        print json_encode($r); 
    }
    else if($type == "updateStudentId"){
        $studentId = $_POST['studentId'];
        $formNumber = $_POST["formNumber"];
        $admissionNumber = $_POST["admissionNumber"];
        $govermentId = $_POST["govermentId"];
        $firstName = $_POST["firstName"];
        $middleName = $_POST["middleName"];
        $lastName = $_POST["lastName"];
        $motherName = $_POST["motherName"];
        $fatherName = $_POST["fatherName"];
        $gender = $_POST['gender'];
        $aadharNumber = $_POST["aadharNumber"];
        $dob_temp = $_POST["dob"];
        $pob_city = $_POST['pob_city'];
        $pob_dist = $_POST['pob_dist'];
        $pob_state = $_POST['pob_state'];
        $religion = $_POST["religion"];
        $castNRace = $_POST["casteNRace"];
        $nationality = $_POST["nationality"];
        $motherTounge = $_POST["motherTounge"];
        $lastSchool = $_POST["lastSchool"];
        $lastClass = $_POST["lastClass"];
        $doa_temp = $_POST["doa"];
        $submittedTC = $_POST["submittedTC"];
        $rte = $_POST['rte'];

        $dob = date('Y-m-d', strtotime($dob_temp)); 
        $doa = date('Y-m-d', strtotime($doa_temp));

        $sql = "UPDATE studentInfo SET formNumber = '$formNumber',admissionNumber = '$admissionNumber', govermentId = '$govermentId', firstName = '$firstName', middleName = '$middleName', lastName = '$lastName', motherName = '$motherName', fatherName = '$fatherName', gender='$gender', aadharNumber = '$aadharNumber', dob = '$dob', pob_city='$pob_city', pob_dist='$pob_dist', pob_state='$pob_state', religion = '$religion', casteNRace = '$castNRace', nationality = '$nationality', motherTounge = '$motherTounge', lastSchool = '$lastSchool', lastClass = '$lastClass', doa = '$doa', submittedTC = '$submittedTC', rte='$rte' WHERE studentId = $studentId"; 
        if($conn->query($sql) == TRUE) {
            echo 200;
        }
        else{
            echo $sql;
        }
    }

    else if($type == "getContactDetailsById"){
        $studentId = $_POST["studentId"];
        $sql = "SELECT `localAddress`, `localState`, `localCity`, `localPincode`, `permanentAddress`, `permanentState`, `permanentCity`, `permanentPincode`, `guardianName`, `guardianPhone`, `guardianEmail` FROM studentInfo WHERE studentId = $studentId";
        $result=mysqli_query($conn,$sql);
        $rows = array();    
        $r = mysqli_fetch_assoc($result);
        print json_encode($r); 
    }

    else if($type == "updateContactDetails"){
        $localAddress = $_POST['localAddress'];
        $localState = $_POST['localState'];
        $localCity = $_POST['localCity'];
        $localPincode = $_POST['localPincode'];
        $permanentAddress = $_POST['permanentAddress'];
        $permanentState = $_POST['permanentState'];
        $permanentCity = $_POST['permanentCity'];
        $permanentPincode = $_POST['permanentPincode'];
        $guardianName = $_POST['guardianName'];
        $guardianPhone = $_POST['guardianPhone'];
        $guardianEmail = $_POST['guardianEmail'];
        $studentId = $_POST["studentId"];

        $sql = "UPDATE `studentInfo` SET `localAddress`='$localAddress',`localState`='$localState',`localCity`='$localCity',`localPincode`='$localPincode',`permanentAddress`='$permanentAddress',`permanentState`='$permanentState',`permanentCity`='$permanentCity',`permanentPincode`='$permanentPincode',`guardianName`='$guardianName',`guardianPhone`='$guardianPhone', `guardianEmail` = '$guardianEmail' WHERE studentId = $studentId";
        if($conn->query($sql) == TRUE) {
            echo 200;
        }
        else{
            echo 500;
        }
    }

    else if($type = "onlyNameNsessionDetals"){
        $studentId = $_POST["studentId"];
        $sessionName = $_POST['sessionName'];
        
        $sql = "SELECT firstName, middleName, lastName FROM studentInfo WHERE studentId = $studentId";
        $result=mysqli_query($conn,$sql);
        $r = mysqli_fetch_assoc($result);

        $tbl_name = "studentDetails";
        $sql1 = "SELECT class, section FROM `$tbl_name` WHERE studentId = $studentId AND sessionName = '$sessionName'";
        $result1=mysqli_query($conn,$sql1);
        $r1 = mysqli_fetch_assoc($result1);
        echo json_encode(array_merge($r, $r1));

    }
}