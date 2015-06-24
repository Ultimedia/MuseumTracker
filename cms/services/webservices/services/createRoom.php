<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));	
	$mercury_room_exhibit_id = $_POST["mercury_room_exhibit_id"];
	$mercury_room_type = $_POST["mercury_room_type"];
	$mercury_room_title = $_POST["mercury_room_title"];
	$mercury_room_description = $_POST["mercury_room_description"];
	$mercury_room_order = $_POST["mercury_room_order"];

	$status;
	$dbc = getDBConnection();		


	// first check the verification code
	$sql = "INSERT INTO mercury_rooms(mercury_room_exhibit_id, mercury_room_type, mercury_room_title, mercury_room_description, mercury_room_order) VALUES (?,?,?,?,?)";
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		



		$stmt->bind_param('isssi', $mercury_room_exhibit_id, $mercury_room_type, $mercury_room_title, $mercury_room_description, $mercury_room_order);
		if($stmt->execute()){

			$status['id'] = mysqli_insert_id($dbc);
			$status['value'] = true;

		}else{
			echo false;
		}		
		print json_encode($status);	
	}else{
		echo false;
	}
?>
