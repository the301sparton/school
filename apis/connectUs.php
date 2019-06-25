<?php
require_once 'db.php';
$type = $_POST['type'];
   
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    if($type=="newMessage"){
        $name = $_POST['name'];
        $email = $_POST['email'];
        $subject = $_POST['subject'];
        $message = $_POST['message'];

        $sql = "INSERT INTO `clientMessage`(`name`, `email`, `subject`, `message`) VALUES ('$name', '$email', '$subject', '$message')";
        if($conn->query($sql) == TRUE) {
            echo "200";
        }
        else{
            echo "400";
        }
    }
}