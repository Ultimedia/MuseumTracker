<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));	
	$mercury_beacon_identifier = $_POST["mercury_beacon_identifier"];
	$mercury_beacon_device_id = $_POST["mercury_beacon_device_id"];
	$mercury_exhibit_id = $_POST["mercury_exhibit_id"];
	$mercury_beacon_uuid = $_POST["mercury_beacon_uuid"];
	$mercury_room_id = 0;
	$mercury_media_id = $_POST["mercury_media_id"];
	$mercury_museum_id = $_POST["mercury_museum_id"];

	$status;
	$dbc = getDBConnection();		


	// first check the verification code
	$sql = "INSERT INTO mercury_beacons(mercury_beacon_identifier, mercury_beacon_device_id, mercury_exhibit_id, 
		mercury_beacon_uuid, mercury_room_id, mercury_media_id, mercury_museum_id) VALUES (?,?,?,?,?,?,?)";
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		

		$stmt->bind_param('sssssss', $mercury_beacon_identifier, $mercury_beacon_device_id, $mercury_exhibit_id, $mercury_beacon_uuid, $mercury_room_id, $mercury_media_id, $mercury_museum_id);
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