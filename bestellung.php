<html>
<head> 
	<title> Sammies </title>
	<script type="text/javascript" src="bestell.js"></script>
	 <meta charset="UTF-8"> 
	 <link rel="stylesheet" href="bestell.css">
</head>
<body>
	<?php
		class Bin{
			public $quantity;
			public $type;
			public $size;
			public $schedule;

			public function __construct($type, $size, $quantity, $schedule){
				$this->type = $type;
				$this->size = $size;
				$this->quantity = $quantity;
				$this->schedule = $schedule;
			}

			public function toString(){
				return $this->quantity . " " . $this->type . " " . $this->size . " " . $this->schedule . "<br />";
			}
		}

		error_reporting(E_ERROR | E_WARNING | E_PARSE);
		if(isset($_POST['submit'])) {
			$fname = $_POST['vorname'];
			$lname = $_POST['nachname'];
			$anrede = $_POST['anrede'];
			$email = $_POST['email'];
			$firma = $_POST['firm'];
			$tel = $_POST['tel'];
			$myBins = [];
			if(isset($_POST['hiddenbins0'])){
				$binArr = explode(" ", chop($_POST['hiddenbins0']));
				if(count($binArr) != 4){
					echo "SOMETHING WENT WRONG ABORT MISSION: " . $_POST['hiddenbins0'] . count($binArr) . "<br />";
					foreach ($binArr as $item) {
						echo "--" .$item . "<br />";
					}
				}
				array_push($myBins, new Bin($binArr[0], $binArr[1], $binArr[2], $binArr[3]));
			}
			if(isset($_POST['hiddenbins1'])){
				$binArr = explode(" ", chop($_POST['hiddenbins1']));
				if(count($binArr) != 4){
					echo "SOMETHING WENT WRONG ABORT MISSION" . $_POST['hiddenbins1'];
				}
				array_push($myBins, new Bin($binArr[0], $binArr[1], $binArr[2], $binArr[3]));
			}
			if(isset($_POST['hiddenbins2'])){
				$binArr = explode(" ", chop($_POST['hiddenbins2']));
				if(count($binArr) != 4){
					echo "SOMETHING WENT WRONG ABORT MISSION" . $_POST['hiddenbins2'];
				}
				array_push($myBins, new Bin($binArr[0], $binArr[1], $binArr[2], $binArr[3]));
			}
			if(isset($_POST['hiddenbins3'])){
				$binArr = explode(" ", chop($_POST['hiddenbins3']));
				if(count($binArr) != 4){
					echo "SOMETHING WENT WRONG ABORT MISSION" . $_POST['hiddenbins3'];
				}
				array_push($myBins, new Bin($binArr[0], $binArr[1], $binArr[2], $binArr[3]));
			}

			echo "<h2>";
			if ($anrede == "Herr" || $anrede == "Frau"){
				echo "Vielen Dank für Ihre Bestellung " . $anrede . " " . $lname . "!<br>";
			}else{
				echo "Vielen Dank für Ihre Bestellung!<br>";
			}
			echo "</h2>";

			echo "<div class='binOrderConfirmDiv'> ";
			foreach ($myBins as $bin) {
				echo "<li>".$bin->toString() . "</li>";
			}
			echo "</div>";

			echo "Eine Bestätigungs-Email wurde an <b>" .$email ."</b> geschickt.";
			
		    $msg = "this is my message";
		    $msg = wordwrap($msg, 70);
		    $headers = "From: user1@localhost.com"; 
		    if(mail($email, "test subject", $msg, $headers)){
		    	echo "mail sent successfully.";
		    }else{
		    	echo "email NOT sent.";
		    }
		    
		    
	  	} else {
			echo "";
		}
	?>
	<br>
	<img src="sammies_logo.png">
</body>
</html>