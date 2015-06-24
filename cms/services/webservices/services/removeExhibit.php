<?php
	require_once("../core/core_functions.php");

	$exhibit_id = $_POST['exhibit_id'];
	$visible = $_POST['visible'];

	$dbc = getDBConnection();		
	$sql = "UPDATE mercury_exhibits SET exhibit_visible=? WHERE exhibit_id=" . $exhibit_id;

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