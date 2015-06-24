<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));	
	$mercury_room_id = $_POST["mercury_room_id"];
	$mercury_room_title = $_POST["mercury_room_title"];
	$mercury_room_description = $_POST["mercury_room_description"];

	$status;
	$dbc = getDBConnection();		

	// first check the verification code
	$sql = "UPDATE mercury_rooms SET mercury_room_title = ?, mercury_room_description = ? WHERE mercury_room_id=" . $mercury_room_id;
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		

		$stmt->bind_param('ss', $mercury_room_title, $mercury_room_description);
		if($stmt->execute()){

			$status['value'] = true;

		}else{
			echo false;
		}		
		print json_encode($status);	
	}else{
		echo false;
	}
?>
