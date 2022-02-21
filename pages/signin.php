<?php

    include($_SERVER['DOCUMENT_ROOT']."/backend/DirectAccessChecker.php");

    if(isset($_POST["username"])){
        $_SESSION["id"] = $_POST["username"];
    }

    if(isset($_SESSION["id"])){
        header("Location: /dashboard");
    }

    $qrCodeData = "https://c-auth.com/login/bla/idc/wtfisthis/";
    $qrCode = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=".urlencode($qrCodeData)."&choe=UTF-8";
?>
<div id="login">
    <section class="center-v center-h">
        <img src="<?=$qrCode?>" alt="Sign in with QR-Code">
        <span>
            Scan this code using your CAuth app to authenticate yourself
        </span>
    </section>
    <section class="center-v center-h">
        <form method="post">
            <i class="image material-icons">groups</i>
            <p>
                Please enter your username. You will receive an
                authentication request in your CAuth app.
            </p>
            <input type="text" name="username" placeholder="Type your username here">
            <input type="submit" value="Send authentication request">
            <span>Not using CAuth yet? Start using <a href="/signup">now &raquo;</a></span>
        </form>
    </section>
</div>