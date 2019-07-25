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
        $formNumber = mysqli_real_escape_string($conn,$formNumber);

        $admissionNumber = $_POST["admissionNumber"];
        $admissionNumber = mysqli_real_escape_string($conn,$admissionNumber);

        $govermentId = $_POST["govermentId"];
        $govermentId = mysqli_real_escape_string($conn,$govermentId);

        $firstName = $_POST["firstName"];
        $firstName = mysqli_real_escape_string($conn,$firstName);

        $middleName = $_POST["middleName"];
        $middleName = mysqli_real_escape_string($conn,$middleName);

        $lastName = $_POST["lastName"];
        $lastName = mysqli_real_escape_string($conn,$lastName);

        $motherName = $_POST["motherName"];
        $motherName = mysqli_real_escape_string($conn,$motherName);

        $fatherName = $_POST["fatherName"];
        $fatherName = mysqli_real_escape_string($conn,$fatherName);

        $gender = $_POST['gender'];
        $gender = mysqli_real_escape_string($conn,$gender);

        $aadharNumber = $_POST["aadharNumber"];
        $aadharNumber = mysqli_real_escape_string($conn,$aadharNumber);

        $dob_temp = $_POST["dob"];
        $dob_temp = mysqli_real_escape_string($conn,$dob_temp);

        $pob_city = $_POST['pob_city'];
        $pob_city = mysqli_real_escape_string($conn,$pob_city);

        $pob_dist = $_POST['pob_dist'];
        $pob_dist = mysqli_real_escape_string($conn,$pob_dist);

        $pob_state = $_POST['pob_state'];
        $pob_state = mysqli_real_escape_string($conn,$pob_state);

        $religion = $_POST["religion"];
        $religion = mysqli_real_escape_string($conn,$religion);

        $category = $_POST["category"];
        $category = mysqli_real_escape_string($conn,$category);

        $caste = $_POST['caste'];
        $caste = mysqli_real_escape_string($conn,$caste);

        $nationality = $_POST["nationality"];
        $nationality = mysqli_real_escape_string($conn,$nationality);

        $motherTounge = $_POST["motherTounge"];
        $motherTounge = mysqli_real_escape_string($conn,$motherTounge);

        $lastSchool = $_POST["lastSchool"];
        $lastSchool = mysqli_real_escape_string($conn,$lastSchool);

        $lastClass = $_POST["lastClass"];
        $lastClass = mysqli_real_escape_string($conn,$lastClass);

        $doa_temp = $_POST["doa"];
        $doa_temp = mysqli_real_escape_string($conn,$doa_temp);

        $submittedTC = $_POST["submittedTC"];
        $rte = $_POST['rte'];

        $sessionName = $_POST["sessionName"];
        $sessionName = mysqli_real_escape_string($conn,$sessionName);
        
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
            echo $sql;
        }
    }

    else if($type=="getStudentDetailsById"){
        $studentId = $_POST['studentId'];
        $sql = "SELECT `formNumber`, `admissionNumber`, `govermentId`, `firstName`, `middleName`, `lastName`, `motherName`, `fatherName`, `gender`, `aadharNumber`, `dob`, `pob_city`, `pob_dist`,`pob_state`, `religion`, `category`, `caste`, `nationality`, `motherTounge`, `lastSchool`, `lastClass`, `doa`, `submittedTC`, `rte` FROM `studentinfo` WHERE studentId = $studentId";
        printOnlyRowFromQueary($sql);
    }
    else if($type == "updateStudentId"){
        $studentId = $_POST['studentId'];
        $studentId = mysqli_real_escape_string($conn,$studentId);

        $formNumber = $_POST["formNumber"];
        $formNumber = mysqli_real_escape_string($conn,$formNumber);

        $admissionNumber = $_POST["admissionNumber"];
        $admissionNumber = mysqli_real_escape_string($conn,$admissionNumber);

        $govermentId = $_POST["govermentId"];
        $govermentId = mysqli_real_escape_string($conn,$govermentId);

        $firstName = $_POST["firstName"];
        $firstName = mysqli_real_escape_string($conn,$firstName);

        $middleName = $_POST["middleName"];
        $middleName = mysqli_real_escape_string($conn,$middleName);

        $lastName = $_POST["lastName"];
        $lastName = mysqli_real_escape_string($conn,$lastName);

        $motherName = $_POST["motherName"];
        $motherName = mysqli_real_escape_string($conn,$motherName);

        $fatherName = $_POST["fatherName"];
        $fatherName = mysqli_real_escape_string($conn,$fatherName);

        $gender = $_POST['gender'];
        $gender = mysqli_real_escape_string($conn,$gender);

        $aadharNumber = $_POST["aadharNumber"];
        $aadharNumber = mysqli_real_escape_string($conn,$aadharNumber);

        $dob_temp = $_POST["dob"];
        $dob_temp = mysqli_real_escape_string($conn,$dob_temp);

        $pob_city = $_POST['pob_city'];
        $pob_city = mysqli_real_escape_string($conn,$pob_city);

        $pob_dist = $_POST['pob_dist'];
        $pob_dist = mysqli_real_escape_string($conn,$pob_dist);

        $pob_state = $_POST['pob_state'];
        $pob_state = mysqli_real_escape_string($conn,$pob_state);

        $religion = $_POST["religion"];
        $religion = mysqli_real_escape_string($conn,$religion);

        $category = $_POST["category"];
        $category = mysqli_real_escape_string($conn,$category);

        $caste = $_POST['caste'];
        $caste = mysqli_real_escape_string($conn,$caste);

        $nationality = $_POST["nationality"];
        $nationality = mysqli_real_escape_string($conn,$nationality);

        $motherTounge = $_POST["motherTounge"];
        $motherTounge = mysqli_real_escape_string($conn,$motherTounge);

        $lastSchool = $_POST["lastSchool"];
        $lastSchool = mysqli_real_escape_string($conn,$lastSchool);

        $lastClass = $_POST["lastClass"];
        $lastClass = mysqli_real_escape_string($conn,$lastClass);

        $doa_temp = $_POST["doa"];
        $doa_temp = mysqli_real_escape_string($conn,$doa_temp);

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
        $localAddress = mysqli_real_escape_string($conn,$localAddress);

        $localState = $_POST['localState'];
        $localState = mysqli_real_escape_string($conn,$localState);
        
        $localCity = $_POST['localCity'];
        $localCity = mysqli_real_escape_string($conn,$localCity);
        
        $localPincode = $_POST['localPincode'];
        $localPincode = mysqli_real_escape_string($conn,$localPincode);
        
        $permanentAddress = $_POST['permanentAddress'];
        $permanentAddress = mysqli_real_escape_string($conn,$permanentAddress);
        
        $permanentState = $_POST['permanentState'];
        $permanentState = mysqli_real_escape_string($conn,$permanentState);
        
        $permanentCity = $_POST['permanentCity'];
        $permanentCity = mysqli_real_escape_string($conn,$permanentCity);
        
        $permanentPincode = $_POST['permanentPincode'];
        $permanentPincode = mysqli_real_escape_string($conn,$permanentPincode);
        
        $guardianName = $_POST['guardianName'];
        $guardianName = mysqli_real_escape_string($conn,$guardianName);
        
        $guardianPhone = $_POST['guardianPhone'];
        $guardianPhone = mysqli_real_escape_string($conn,$guardianPhone);
        
        $guardianEmail = $_POST['guardianEmail'];
        $guardianEmail = mysqli_real_escape_string($conn,$guardianEmail);
        
        $studentId = $_POST["studentId"];
        $studentId = mysqli_real_escape_string($conn,$studentId);
        

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