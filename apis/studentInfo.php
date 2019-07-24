<?php
require_once 'db.php';
require_once 'commonFunctions.php';

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
        $category = $_POST["category"];
        $caste = $_POST['caste'];
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

        $sql = "INSERT INTO `studentinfo` (`formNumber`, `admissionNumber`, `govermentId`, `firstName`, `middleName`, `lastName`, `motherName`, `fatherName`,`gender`, `aadharNumber`, `dob`,`pob_city`, `pob_dist`, `pob_state`, `religion`, `caste`, `category`, `nationality`, `motherTounge`, `lastSchool`, `lastClass`, `doa`, `submittedTC`,`rte`) VALUES ('$formNumber','$admissionNumber','$govermentId','$firstName','$middleName','$lastName','$motherName','$fatherName','$gender','$aadharNumber','$dob','$pob_city','$pob_dist','$pob_state','$religion', '$caste','$category','$nationality','$motherTounge','$lastSchool','$lastClass','$doa','$submittedTC','$rte')";
        if($conn->query($sql) == TRUE) {
            $res = '{"resCode":200,"id":'.$conn->insert_id.'}';
            $studentId = $conn->insert_id;
            $sqlforSession = "INSERT INTO studentdetails (studentId, sessionName) VALUES ('$studentId', '$sessionName')";
            if($conn->query($sqlforSession) == TRUE){
                echo $res;
            }
        }
        else{
            echo 500;
        }
    }

    else if($type=="getStudentDetailsById"){
        $studentId = $_POST['studentId'];
        $sql = "SELECT `formNumber`, `admissionNumber`, `govermentId`, `firstName`, `middleName`, `lastName`, `motherName`, `fatherName`, `gender`, `aadharNumber`, `dob`, `pob_city`, `pob_dist`,`pob_state`, `religion`, `category`, `caste`, `nationality`, `motherTounge`, `lastSchool`, `lastClass`, `doa`, `submittedTC`, `rte` FROM `studentinfo` WHERE studentId = $studentId";
        printOnlyRowFromQueary($sql);
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
        $category = $_POST["category"];
        $caste = $_POST['caste'];
        $nationality = $_POST["nationality"];
        $motherTounge = $_POST["motherTounge"];
        $lastSchool = $_POST["lastSchool"];
        $lastClass = $_POST["lastClass"];
        $doa_temp = $_POST["doa"];
        $submittedTC = $_POST["submittedTC"];
        $rte = $_POST['rte'];

        $dob = date('Y-m-d', strtotime($dob_temp)); 
        $doa = date('Y-m-d', strtotime($doa_temp));

        $sql = "UPDATE studentinfo SET formNumber = '$formNumber',admissionNumber = '$admissionNumber', govermentId = '$govermentId', firstName = '$firstName', middleName = '$middleName', lastName = '$lastName', motherName = '$motherName', fatherName = '$fatherName', gender='$gender', aadharNumber = '$aadharNumber', dob = '$dob', pob_city='$pob_city', pob_dist='$pob_dist', pob_state='$pob_state', religion = '$religion', caste = '$caste', category = '$category', nationality = '$nationality', motherTounge = '$motherTounge', lastSchool = '$lastSchool', lastClass = '$lastClass', doa = '$doa', submittedTC = '$submittedTC', rte='$rte' WHERE studentId = $studentId"; 
        get200AsYes($sql);
    }

    else if($type == "getContactDetailsById"){
        $studentId = $_POST["studentId"];
        $sql = "SELECT `localAddress`, `localState`, `localCity`, `localPincode`, `permanentAddress`, `permanentState`, `permanentCity`, `permanentPincode`, `guardianName`, `guardianPhone`, `guardianEmail` FROM studentinfo WHERE studentId = $studentId";
        printOnlyRowFromQueary($sql);
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

        $sql = "UPDATE `studentinfo` SET `localAddress`='$localAddress',`localState`='$localState',`localCity`='$localCity',`localPincode`='$localPincode',`permanentAddress`='$permanentAddress',`permanentState`='$permanentState',`permanentCity`='$permanentCity',`permanentPincode`='$permanentPincode',`guardianName`='$guardianName',`guardianPhone`='$guardianPhone', `guardianEmail` = '$guardianEmail' WHERE studentId = $studentId";
        get200AsYes($sql);
    }

    else if($type = "onlyNameNsessionDetals"){
        $studentId = $_POST["studentId"];
        $sessionName = $_POST['sessionName'];
        
        $sql = "SELECT firstName, middleName, lastName FROM studentinfo WHERE studentId = $studentId";
        $result=mysqli_query($conn,$sql);
        $r = mysqli_fetch_assoc($result);

        $tbl_name = "studentdetails";
        $sql1 = "SELECT class, section FROM `$tbl_name` WHERE studentId = $studentId AND sessionName = '$sessionName'";
        $result1=mysqli_query($conn,$sql1);
        $r1 = mysqli_fetch_assoc($result1);
        echo json_encode(array_merge($r, $r1));

    }
}