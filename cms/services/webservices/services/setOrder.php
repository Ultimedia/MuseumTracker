<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));	
	$mercury_room_id = $_POST["mercury_room_id"];
	$mercury_room_order = $_POST["mercury_room_order"];

	$status;
	$dbc = getDBConnection();		

	// first check the verification code
	$sql = "UPDATE mercury_rooms SET mercury_room_order=? WHERE mercury_room_id=" . $mercury_room_id;
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		

		$stmt->bind_param('s', $mercury_room_order);
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
