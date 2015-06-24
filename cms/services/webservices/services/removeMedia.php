<?php
	require_once("../core/core_functions.php");

	$mercury_room_media_id = $_POST['mercury_room_media_id'];
	$visible = 0;

	$dbc = getDBConnection();		
	$sql = "UPDATE mercury_rooms_media SET mercury_room_media_visible=? WHERE mercury_room_media_id=" . $mercury_room_media_id;

	$result = $dbc->query($sql);
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){
		$stmt->bind_param("s", $visible);
		
		if($stmt->execute())
		{
			if($count == 0)
			{
				$status['value'] = true;
			}else{
				$status['value'] = false;
			}
			print json_encode($status);
		}else{
			$status['value'] = false;
			print json_encode($status);
		}
	}
	$dbc->close();
?>