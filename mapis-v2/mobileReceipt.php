<?php
require_once '../vendor/autoload.php';
require_once 'db.php';

use \Firebase\JWT\JWT;


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $jwt = getBearerToken();
    if (isset($jwt)) {
        try {
            $conn = new mysqli($DB_servername, $DB_username, $DB_password, $dbname);
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
            else{

                $secret = getSecretForToken($jwt,$conn);
                $decoded = JWT::decode($jwt, $secret,array('HS256'));
                $decoded_array = (array) $decoded;
                //Auth Success!

                $studentId = $decoded_array["studentId"];
                $className = $decoded_array["className"];
                
                $sessionName = $decoded_array["sessionName"];
                $className = $conn->real_escape_string($className);
                $studentId = $conn->real_escape_string($studentId);
                $sessionName = $conn->real_escape_string($sessionName);
                $className = "amount_".$className;
                $sql = "SELECT `receiptId`, `recamt` from vreceiptamount WHERE `studentId` = '$studentId' AND `sessionName` = '$sessionName'";
                $result=mysqli_query($GLOBALS['conn'],$sql);  
                $toPrint = array();       
                $itr = 0;
                while($r = mysqli_fetch_assoc($result)) {
                    $receiptId = $r['receiptId'];
                    $sql = "SELECT `receiptNo`, `receiptDate`, `remark` FROM receiptslist WHERE receiptId = $receiptId";
                    $result1 = mysqli_query($conn,$sql);            
                    $r1 = mysqli_fetch_assoc($result1);
                    $toPrint["receipts"][$itr] = array_merge($r,$r1);
                    $itr = $itr + 1;
                }
            
                $sql = "SELECT paidFees FROM studentfees where studentId = '$studentId' AND sessionName = '$sessionName'";
                $result2 = mysqli_query($conn,$sql); 
                $r2 = mysqli_fetch_assoc($result2);
                $sql = "SELECT sum(`$className`) as 'fees' FROM `feesheads` WHERE sessionName = '$sessionName'";
                $result3 = mysqli_query($conn,$sql);
                $r3 = mysqli_fetch_assoc($result3);
                $r2["totalFees"] = $r3["fees"];
                $toPrint["details"] = $r2;
                
                $r = array_merge($r,$r1);
                $tokenId    = base64_encode(random_bytes(6));
                $issuedAt   = time();
                $notBefore  = $issuedAt - 1.5;    
                $expire     = $notBefore + 10;
                $serverName = "SCHOOL-mAPIsV2"; 

                $data = [
                    'iat'  => $issuedAt,         // Issued at: time when the token was generated
                    'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
                    'iss'  => $serverName,       // Issuer
                    'nbf'  => $notBefore,        // Not before
                    'exp'  => $expire,           // Expire
                ];

                $data = array_merge($data, $toPrint);
                $jwtEcho = JWT::encode($data, $secret);
                echo $jwtEcho;
            }
        }
        catch (Exception $e) {
            echo $e;
            header('HTTP/1.0 401 Unauthorized');
        }
    } 
    else {
        header('HTTP/1.0 400 Bad Request');
        echo 'Token not found in request';
    }
} else {
    header('HTTP/1.0 405 Method Not Allowed');
}


function getSecretForToken($jwt,$conn){
    $body = explode(".",$jwt)[1];
    $body = json_decode(base64_decode($body));
    $studentId = "studentId";
    $studentId = $body->$studentId;
    $sql = "SELECT `secret` from studentinfo where `studentId` = '$studentId'";
    $result=mysqli_query($conn,$sql);          
    $r = mysqli_fetch_assoc($result);
    if($r != null){
        return $r["secret"];
    }
    else{
        header('HTTP/1.0 401 Unauthorized');
    }
}

function getAuthorizationHeader()
{
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        //print_r($requestHeaders);
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}

function getBearerToken()
{
    $headers = getAuthorizationHeader();
    // HEADER: Get the access token from the header
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}