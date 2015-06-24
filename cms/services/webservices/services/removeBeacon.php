<?php
	require_once("../core/core_functions.php");
	$beacon_id = $_POST['beacon_id'];
	$visible = 0;

	$dbc = getDBConnection();		
	$sql = "UPDATE mercury_beacons SET mercury_beacon_visible=? WHERE mercury_beacon_id=" . $beacon_id;

	$result = $dbc->query($sql);
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){
		$stmt->bind_param("i", $visible);
		
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
