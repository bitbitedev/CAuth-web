<?php

if($_SERVER["REQUEST_URI"] == str_replace("\\","/",substr(__FILE__, strlen($_SERVER['DOCUMENT_ROOT'])))){
    header("Location: /");
}