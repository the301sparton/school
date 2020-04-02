<?php
require_once '../vendor/autoload.php';
require_once 'db.php';

use \Firebase\JWT\JWT;


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $jwt = getBearerToken();
    if (isset($jwt)) {
        try {
           $decryptKey = <<<EOD
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAoNX50SVUQUS7hR4tQOSN
3hy6XcSmckO+BDCFMGrLoqw+VxkuO2HLBi/q6HhzgBPDwz3OasGIrI7UXjV6mosi
rGKM5AFQ/St0ZvNwTmGYodE+VRC+TUpoqBSGZcDzwPf8QxTH7JSPdk2wnkqhCpLB
UV6HFtRBLfv5ydOBc3EFz9I8pvNX+ZvnpLkKA4K4WPI5F5rwiOgEPPkfyv279iYR
tkZNRAS+VCNbEUXAQxYn8OfftVI42sCgGeKlVzLR8QRlJxKKtN+7ztZEKXDRMrr6
QbXjjj9jYOVctEulgxuKypgUylJnqZIl208hjAd3d/B6j+agDEkFP4fsS185yT7z
T2B9q2Y0TaAqw4jN9bCjZvRl9dyQ/rtK1bGjg/Jm10AnRxlZng3i00j5Ld/nxQ0W
ie0kejpWAN6gRCzgeZav1bU2aYf2YOz6pdnFqxSkXw1WtaT4AeURzXV0QD3ABUle
HMD1tIqjd8K1JOlnGE2CrDaxKlKQx8xvBX+z7bjCpmQsiehAg7VLLybb7lX62eeV
0aMOFzHYl13A78dT31nsgJuuOEYmHXKaBz+sLexCMzeVzUL4YMHaRPdvjcHnEA8r
1QUjtjeUrJMjwa6Gg6OpAXBcP0Y4eBvHvA6Ah9EldylJp/exuQV8ZHji+203RJzU
ZcTcVi1HqqRbfXT5e7CGFEMCAwEAAQ==
-----END PUBLIC KEY-----
EOD;

            $decoded = JWT::decode($jwt, $decryptKey, array('RS512'));
            $decoded_array = (array) $decoded;
            $username = $decoded_array["username"];
            $password = $decoded_array["password"];
            $conn = new mysqli($DB_servername, $DB_username, $DB_password, $dbname);
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            } else {
                $username = $conn->real_escape_string($username);
                $password = $conn->real_escape_string($password);
                $sql = "Select `studentId`, `firstName`, `middleName`, `gender`, `lastName` from studentinfo WHERE `admissionNumber` = '$username' AND `password` = '$password'";
                $result = mysqli_query($conn, $sql);

                $res = mysqli_fetch_assoc($result);

                if ($res != null) {

                    $sql = "SELECT sessionName FROM sessionlist  
                    ORDER BY sessionId DESC  
                    LIMIT 1";

                    $result = mysqli_query($conn, $sql);
                    $r = mysqli_fetch_assoc($result);

                    $studentId = $res["studentId"];
                    $sessionName = $r["sessionName"];

                    $sql = "SELECT className, section, schoolId, schoolName FROM schoolwisestudents WHERE studentId = '$studentId' AND sessionName = '$sessionName'";
                    $result1 = mysqli_query($conn, $sql);
                    $r1 = mysqli_fetch_assoc($result1);
                    $publicKey = createNewKeyPair($conn,$username, $password);

                    if (!$publicKey == null) {
                        //$r1["publicKey"] = $publicKey;
                        $res = array_merge(array_merge($res, $r),$r1);

                        $tokenId    = base64_encode(random_bytes(6));
                        $issuedAt   = time();
                        $notBefore  = $issuedAt + 10;             //Adding 10 seconds
                        $expire     = $notBefore + 120;            // Adding 60 seconds
                        $serverName = 'mAPIsv2';

                        $data = [
                            'iat'  => $issuedAt,         // Issued at: time when the token was generated
                            'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
                            'iss'  => $serverName,       // Issuer
                            'nbf'  => $issuedAt,        // Not before
                            'exp'  => $expire,           // Expire
                            'data' => $res
                        ];


                        $encryptKey = <<<EOD
-----BEGIN PRIVATE KEY-----
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
bgedrgZ4ZuurO29CFuSmlFsylfxPEPXvCQ==
-----END PRIVATE KEY-----
EOD;
                        $jwt = JWT::encode(
                            $data,      //Data to be encoded in the JWT
                            $encryptKey, // The signing key
                            'RS512'     // Algorithm used to sign the token
                        );

                        $unencodedArray = ['jwt' => $jwt,
                                           'key' => $publicKey];
                        echo json_encode($unencodedArray);
                    } else {
                        echo 500;
                    }
                } else {
                    //echo $sql;
                    echo "Invalid Username or Password";
                }
                }
        } catch (Exception $e) {
            echo "Session Expired";
            header('HTTP/1.0 401 Unauthorized');
        }
    } else {
        header('HTTP/1.0 400 Bad Request');
    }
} else {
    header('HTTP/1.0 405 Method Not Allowed');
}

function createNewKeyPair($conn,$username, $password)
{
    $config = array(
        "digest_alg" => "sha512",
        "private_key_bits" => 4096,
        "private_key_type" => OPENSSL_KEYTYPE_RSA,
    );

    $res = openssl_pkey_new($config);
    openssl_pkey_export($res, $privKey);
    $pubKey = openssl_pkey_get_details($res);
    $pubKey = $pubKey["key"];

    $sql = "UPDATE studentinfo SET rsa_private = '$privKey' WHERE `admissionNumber` = '$username' AND `password` = '$password'";
    if ($conn->query($sql) == TRUE) {
        return $pubKey;
    } else {
        return null;
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