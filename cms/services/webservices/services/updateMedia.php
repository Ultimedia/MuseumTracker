<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));	
	$mercury_room_media_id = $_POST["mercury_room_media_id"];
	$mercury_room_media_caption = $_POST["mercury_room_media_caption"];
	$mercury_room_media_url = $_POST["mercury_room_media_url"];
	$mercury_room_media_type = $_POST["mercury_room_media_type"];

	$status;
	$dbc = getDBConnection();		

	// first check the verification code
	$sql = "UPDATE mercury_rooms_media SET mercury_room_media_caption=?, mercury_room_media_url=?, mercury_room_media_type=? WHERE mercury_rooms_media.mercury_room_media_id=" . $mercury_room_media_id;
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		

		$stmt->bind_param('sss', $mercury_room_media_caption, $mercury_room_media_url, $mercury_room_media_type);
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