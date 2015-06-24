<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));	
	$mercury_beacon_identifier = $_POST["mercury_beacon_identifier"];
	$mercury_beacon_device_id = $_POST["mercury_beacon_device_id"];
	$mercury_exhibit_id = $_POST["mercury_exhibit_id"];
	$mercury_beacon_uuid = $_POST["mercury_beacon_uuid"];
	$mercury_room_id = $_POST["mercury_room_id"];
	$mercury_media_id = $_POST["mercury_media_id"];
	$mercury_museum_id = $_POST["mercury_museum_id"];
	$mercury_beacon_id = $_POST["mercury_beacon_id"];

	$status;
	$dbc = getDBConnection();		


	// first check the verification code
	$sql = "UPDATE mercury_beacons SET mercury_beacon_identifier=?, mercury_beacon_uuid=?, mercury_beacon_device_id=? WHERE mercury_beacons.mercury_beacon_id=" . $mercury_beacon_id;
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		

		$stmt->bind_param('sss', $mercury_beacon_identifier, $mercury_beacon_uuid, $mercury_beacon_device_id);
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


