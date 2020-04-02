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
                        $res = array_merge(array_merge($res, $r));

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
HEhxhMgCXGIX6/0KZl2n1d/o2WLF
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
                    echo $sql;
                    //echo "Invalid Username or Password";
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