<?php
	require_once("../core/core_functions.php");
	//$exhibitData = json_decode(file_get_contents('php://input', true));
	$exhibit_exhibit_id = $_POST["exhibit_id"];
	
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
	$sql = "UPDATE mercury_exhibits SET exhibit_museum_id=?, exhibit_title=?, exhibit_description=?, exhibit_hash=?, exhibit_website=?, exhibiti_twitter=?, exhibit_facebook=?, exhibit_subtitle=?, exhibit_cover_image=?, exhibit_twitter_enabled=?, exhibit_facebook_enabled=?, exhibit_adres=?, exhibit_opening=? WHERE mercury_exhibits.exhibit_id =" . $exhibit_exhibit_id;
	$stmt = null;

	if($stmt = $dbc->prepare($sql)){		
		$stmt->bind_param('issssssssssss', $exhibit_museum_id, $exhibit_title, $exhibit_description, $exhibit_hash, $exhibit_website, $exhibiti_twitter, $exhibit_facebook, $exhibit_subtitle, $exhibit_cover_image, $exhibit_twitter_enabled, $exhibit_facebook_enabled, $exhibit_adres, $exhibit_opening);
		if($stmt->execute()){

			if($stmt->execute()){
				$status['value'] = true;
			}else{
				echo false;
			}

		}else{
			echo false;
		}		
		print json_encode($status);	
	}else{
		echo false;
	}
	
?>


