<?php

    include($_SERVER['DOCUMENT_ROOT']."/backend/DirectAccessChecker.php");

    if(!isset($_SESSION["id"])){
        header("Location: /");
    }

<div id="dashboard">
    <menu>
        <button class="material-icons" id="dashboard-menu-collapse">menu</button>
        <div class="clear"></div>
        <a href="/dashboard/profile" title="Profile"><i class="material-icons">account_circle</i> Profile</a>
        <a href="/dashboard/admin" title="Admin"><i class="material-icons">local_police</i> Admin</a>
        <a href="/dashboard/access-histroy" title="Data access history"><i class="material-icons">bar_chart</i> Data access history</a>
        <a href="/dashboard/settings" title="Settings"><i class="material-icons">settings</i> Settings</a>
    </menu>
    <content>
        <?php
            if(isset($args[1]) and file_exists("./pages/dashboard/{$args[1]}.php")){
                require("./pages/dashboard/{$args[1]}.php");
            } else {
                require("./pages/dashboard/overview.php");
            }
        ?>
    </content>
</div>
