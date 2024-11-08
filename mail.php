<?php

$name = $_POST['username'];
$email = $_POST['email'];
$disease = $_POST['disease'];
$forward = $_POST['fprimer'];
$reverse = $_POST['rprimer'];
$probe = $_POST['probe'];

$mailheader = "From:".$name."<".$email.">\r\n";

$subject = "New Assay Submitted to Website!";

$recipient = "ankhiban@gmail.com";

$message = "Disease : ".$disease."\nForward Primer : ".$forward."\nReverse Primer : ".$reverse."\nProbe : ".$probe;


mail($recipient, $subject, $message, $mailheader) or die("Error!");
