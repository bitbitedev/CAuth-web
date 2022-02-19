<?php
	$url = "";
	if(isset($_GET["url"])){
		$url = $_GET["url"];
	}
	$requestedSite = "home";
	$args = [];
	if($url != ""){
		$args = explode("/",$url);
		$requestedSite = $args[0];
	}

	session_start();

	require("./backend/databaseManager.php");
	require("./backend/scssAutoCompiler.php");

	$db = new DatabaseManager();
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>C-Auth &there4; Cryptographic Authentication</title>
		<base href="/">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#FBB4CB">
        <meta name="description" content="Rape your enemies">
		<link rel="preload" as="font" href="https://fonts.gstatic.com/s/materialicons/v121/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2" type="font/woff2" crossorigin>
		<link rel="preload" as="font" href="https://fonts.gstatic.com/s/oswald/v40/TK3iWkUHHAIjg752FD8Ghe4.woff2" type="font/woff2" crossorigin>
		<link rel="stylesheet" href="/style/global.css" media="screen">
		<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="/style/error.css" media="screen">
		<?php
			if(file_exists("./style/".$requestedSite.".css")){?>
			<link rel="stylesheet" href="/style/<?=$requestedSite?>.css" media="screen">
		<?php
			}
		?>
		<link rel="shortcut icon" href="/assets/image/CAuth-logo.svg" type="image/svg">
        <link rel="manifest" href="/manifest.json">
		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700&display=swap" crossorigin>
		<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap" crossorigin>
		<script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
		<script src="/script/index.js" defer></script>
	</head>
	<body>
		<header>
			<div class="content">
				<a href="/">
					<img src="/assets/image/CAuth-logo.svg" alt="CAuth Logo">
					<span>C-Auth</span>
				</a>
				<menu>
					<a href="/about"<?=($requestedSite=="about")?" selected":""?>>About</a>
				</menu>
			</div>
		</header>
		<main>
			<?php
				if(file_exists("./pages/".$requestedSite.".php")){
					require("./pages/".$requestedSite.".php");
				} else {
					require("./pages/errors/404.php");
				}
			?>
		</main>
		<footer>
			<div class="content">
				&copy; C-Auth <?=date("Y");?>
			</div>
		</footer>
	</body>
</html>