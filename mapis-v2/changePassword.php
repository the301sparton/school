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
                $secretOld = getSecretForToken($jwt,$conn);
                $decoded = JWT::decode($jwt, $secretOld,array('HS512'));

                $decoded_array = (array) $decoded;
            
                $username = $decoded_array["username"];
                $password = $decoded_array["password"];
                $newPassword = $decoded_array["newPassword"];

                $username = $conn->real_escape_string($username);
                $password = $conn->real_escape_string($password);
                $newPassword = $conn->real_escape_string($newPassword);
                
                $sql = "Select `studentId`, `firstName`, `middleName`, `gender`, `lastName` from studentinfo WHERE `admissionNumber` = '$username' AND `password` = '$password'";
                $result=mysqli_query($conn,$sql); 
                $res = mysqli_fetch_assoc($result);
                
                $sql = "UPDATE studentinfo set `password` = '$newPassword' WHERE `admissionNumber` = '$username' AND `password` = '$password'";
                if ($conn->query($sql) == TRUE) {
                    if($res != null){
                        $password = $newPassword;
                        $sql = "SELECT sessionName FROM sessionlist  
                        ORDER BY sessionId DESC  
                        LIMIT 1";
                
                        $result=mysqli_query($conn,$sql);
                        $r = mysqli_fetch_assoc($result);
                        
                        if($r != null){
                            $studentId = $res["studentId"];
                            $sessionName = $r["sessionName"];
                            
                            $sql = "SELECT className, section, schoolId, schoolName FROM schoolwisestudents WHERE studentId = '$studentId' AND sessionName = '$sessionName'";            
                            $result1=mysqli_query($conn,$sql);
                            $r1 = mysqli_fetch_assoc($result1);
                            if($r1 != null){
                                $secret = changeSecret($conn,$username, $password);
                                if($secret != null){
                                    $tokenId    = base64_encode(random_bytes(6));
                                    $issuedAt   = time();
                                    $notBefore  = $issuedAt - 1;              //Adding 10 seconds
                                    $expire     = $notBefore + 1800;            // Adding 60 seconds
                                    $serverName = "SCHOOL-mAPIsV2"; // Retrieve the server name from config file
                                    
                                    $data = [
                                        'iat'  => $issuedAt,         // Issued at: time when the token was generated
                                        'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
                                        'iss'  => $serverName,       // Issuer
                                        'nbf'  => $notBefore,        // Not before
                                        'exp'  => $expire,           // Expire
                                    ];
    
                                    $data = array_merge(array_merge(array_merge($res,$r), $r1),$data);
                                    $jwt = JWT::encode($data, $secret);
    
                                    $data = [
                                        'iat'  => $issuedAt,         // Issued at: time when the token was generated
                                        'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
                                        'iss'  => $serverName,       // Issuer
                                        'nbf'  => $notBefore,        // Not before
                                        'exp'  => $expire,           // Expire
                                        'key' => $secret
                                    ];
    
                                    $jwtKey = JWT::encode($data, $secretOld);
                                    print(json_encode(array('jwt'=>$jwt, 'keyjwt'=>$jwtKey)));
                                }          
                                else{
                                    header('HTTP/1.0 401 Unauthorized');
                                } 
                            }
                            else{
                                header('HTTP/1.0 401 Unauthorized');
                            }
                            
                        }
                        else{
                            header('HTTP/1.0 401 Unauthorized');
                        }      
                        
                    }
                    else{
                        echo "Invalid Password";
                    }
                } else {
                    header('HTTP/1.0 401 Unauthorized');
                }
            }
        } catch (Exception $e) {
            echo $e;
            header('HTTP/1.0 401 Unauthorized');
        }
    } else {
        header('HTTP/1.0 400 Bad Request');
        echo 'Token not found in request';
    }
} else {
    header('HTTP/1.0 405 Method Not Allowed');
}

function changeSecret($conn, $username, $password)
{
    $secret = bin2hex(random_bytes(64));

    $sql = "UPDATE studentinfo set `secret` = '$secret' WHERE `admissionNumber` = '$username' AND `password` = '$password'";
    if ($conn->query($sql) == TRUE) {
        return $secret;
    } else {
        return null;
    }
}

function getSecretForToken($jwt, $conn)
{
    $body = explode(".", $jwt)[1];
    $body = json_decode(base64_decode($body));
    $studentId = "studentId";
    $studentId = $body->$studentId;
    $sql = "SELECT `secret` from studentinfo where `studentId` = '$studentId'";
    $result = mysqli_query($conn, $sql);
    $r = mysqli_fetch_assoc($result);
    if ($r != null) {
        return $r["secret"];
    } else {
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
