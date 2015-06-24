<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));	
	$exhibit_museum_id = $_POST["exhibit_museum_id"];
	$exhibit_title = $_POST["exhibit_title"];
	$exhibit_description = $_POST["exhibit_description"];
	$exhibit_hash = $_POST["exhibit_hash"];
	$exhibit_website = $_POST["exhibit_website"];
	$exhibiti_twitter = $_POST["exhibiti_twitter"];
	$exhibit_facebook = $_POST["exhibit_facebook"];
	$exhibit_subtitle = $_POST["exhibit_subtitle"];
	$exhibit_cover_image = $_POST["exhibit_cover_image"];
	$exhibit_twitter_enabled = $_POST["exhibit_twitter_enabled"];
	$exhibit_facebook_enabled = $_POST["exhibit_facebook_enabled"];
	$exhibit_adres = $_POST["exhibit_adres"];
	$exhibit_opening = $_POST["exhibit_opening"];

	$dbc = getDBConnection();		
	$status;

	// first check the verification code
	$sql = "INSERT INTO mercury_exhibits(exhibit_museum_id, exhibit_title, exhibit_description, exhibit_hash, exhibit_website, exhibiti_twitter, exhibit_facebook, exhibit_subtitle, exhibit_cover_image, exhibit_twitter_enabled, exhibit_facebook_enabled, exhibit_adres, exhibit_opening) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		
		$stmt->bind_param('issssssssssss', $exhibit_museum_id, $exhibit_title, $exhibit_description, $exhibit_hash, $exhibit_website, $exhibiti_twitter, $exhibit_facebook, $exhibit_subtitle, $exhibit_cover_image, $exhibit_twitter_enabled, $exhibit_facebook_enabled, $exhibit_adres, $exhibit_opening);
		if($stmt->execute()){

			$status['id'] = mysqli_insert_id($dbc);
			$mercury_room_exhibit_id = mysqli_insert_id($dbc);
			$mercury_room_type = "intro";
			$mercury_room_title = "Ingang";
			$mercury_room_description = $exhibit_description;
			$mercury_room_order = 0;



			// now insert the default intro room (because this is needed)
			$sql = "INSERT INTO mercury_rooms(mercury_room_exhibit_id, mercury_room_type, mercury_room_title, mercury_room_description, mercury_room_order) VALUES (?,?,?,?,?)";
			$stmt2 = null;
			if($stmt2 = $dbc->prepare($sql)){	
				$stmt2->bind_param('isssi', $mercury_room_exhibit_id, $mercury_room_type, $mercury_room_title, $mercury_room_description, $mercury_room_order);
				if($stmt2->execute()){
					$status['value'] = true;
				}else{
					echo false;
				}
			}

			// now insert the default intro room (because this is needed)
			$mercury_room_type = "exit";
			$mercury_room_title = "Uitgang";
			$mercury_room_order = 999;
			$sql = "INSERT INTO mercury_rooms(mercury_room_exhibit_id, mercury_room_type, mercury_room_title, mercury_room_description, mercury_room_order) VALUES (?,?,?,?,?)";
			$stmt2 = null;
			if($stmt2 = $dbc->prepare($sql)){	
				$stmt2->bind_param('isssi', $mercury_room_exhibit_id, $mercury_room_type, $mercury_room_title, $mercury_room_description, $mercury_room_order);
				if($stmt2->execute()){
					$status['value'] = true;
					$status['edee'] = true;
				}else{
					echo false;
				}
			}


		}else{
			echo false;
		}		
		print json_encode($status);	
	}else{
		echo false;
	}
	
?>


