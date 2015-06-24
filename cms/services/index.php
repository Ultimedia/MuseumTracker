<?php

require 'Slim/Slim.php';

$app = new Slim();
$app->contentType('text/html; charset=utf-8');
$app->get('/museums', 'getMuseums');
$app->get('/museumsAdmin/:id', 'getAdminMuseums');

$app->get('/users', 'getUsers');
$app->post('/user', 'addUser');
$app->post('/social', 'addSocial');
$app->get('/beacons', 'getBeacons');
$app->run();

/** 
* Get all users
*/
function getUsers(){
	$sql = "select * FROM mercury_users";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  

		$users = array('users' => "");
		$users["users"] = $stmt->fetchAll(PDO::FETCH_OBJ);

		$db = null;
		echo json_encode($users);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


/**
* Get all museums
*/
function getMuseums() {
	$sql = "select * FROM mercury_museums";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  

		$museums = array('museums' => "");
		$museums["museums"] = $stmt->fetchAll(PDO::FETCH_OBJ);

		// get exhibit data
		foreach ($museums["museums"] as $museum) {
		    $sql = "select * FROM mercury_exhibits WHERE mercury_exhibits.exhibit_museum_id="  . $museum->museum_id . " AND mercury_exhibits.exhibit_visible = 1";
			$stmt = $db->query($sql);  	
			$museum->exhibits = $stmt->fetchAll(PDO::FETCH_OBJ);
			
			// get room data
			foreach ($museum->exhibits as $exhibit) {
				$sql = "select * FROM mercury_rooms WHERE mercury_rooms.mercury_room_exhibit_id=". $exhibit->exhibit_id . " AND mercury_rooms.mercury_room_visible = 1 ORDER BY mercury_rooms.mercury_room_order";
				$stmt = $db->query($sql);  	
				$exhibit->rooms = $stmt->fetchAll(PDO::FETCH_OBJ);

				// get image data
				foreach ($exhibit->rooms as $room) {
					$sql = "select * FROM mercury_rooms_media WHERE mercury_rooms_media.mercury_room_id=". $room->mercury_room_id . " AND mercury_rooms_media.mercury_room_media_visible = 1";
					$stmt = $db->query($sql);  	
					$room->roomMedia = $stmt->fetchAll(PDO::FETCH_OBJ);


					$sql2 = "select * FROM mercury_rooms_social WHERE mercury_rooms_social.mercury_room_id=". $room->mercury_room_id;
					$stmt2 = $db->query($sql2);  	
					$room->socialData = $stmt2->fetchAll(PDO::FETCH_OBJ);
				}

			}

			// get beacons in this exhbiit
			foreach ($museum->exhibits as $exhibit) {
				$sql = "select * FROM mercury_beacons WHERE mercury_beacons.mercury_exhibit_id=". $exhibit->exhibit_id . " AND mercury_beacons.mercury_beacon_visible = 1";
				$stmt = $db->query($sql);  	
				$exhibit->beacons = $stmt->fetchAll(PDO::FETCH_OBJ);
			}
		}
		
		$db = null;
		echo json_encode($museums);

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



/**
* Get Admin Museums
*/
function getAdminMuseums($id) {
	$sql = "select * FROM mercury_museums WHERE admin_id=:admin_id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("admin_id", $id);
		$stmt->execute();

		$museums = $stmt->fetchAll(PDO::FETCH_OBJ);

		// get exhibit data
		foreach ($museums as $museum) {
		    $sql = "select * FROM mercury_exhibits WHERE mercury_exhibits.exhibit_museum_id="  . $museum->museum_id; 
			$stmt = $db->query($sql);  	
			$museum->exhibits = $stmt->fetchAll(PDO::FETCH_OBJ);
			
			// get room data
			foreach ($museum->exhibits as $exhibit) {
				$sql = "select * FROM mercury_rooms WHERE mercury_rooms.mercury_room_exhibit_id=". $exhibit->exhibit_id . " AND mercury_rooms.mercury_room_visible = 1 ORDER BY mercury_rooms.mercury_room_order";
				$stmt = $db->query($sql);  	
				$exhibit->rooms = $stmt->fetchAll(PDO::FETCH_OBJ);

				$sql = "select * FROM mercury_beacons WHERE mercury_beacons.mercury_exhibit_id=". $exhibit->exhibit_id . " AND mercury_beacons.mercury_beacon_visible = 1";
				$stmt = $db->query($sql);  	
				$exhibit->beacons = $stmt->fetchAll(PDO::FETCH_OBJ);

				// get image data
				foreach ($exhibit->rooms as $room) {
					$sql = "select * FROM mercury_rooms_media WHERE mercury_rooms_media.mercury_room_id=". $room->mercury_room_id . " AND mercury_rooms_media.mercury_room_media_visible = 1";
					$stmt = $db->query($sql);  	
					$room->roomMedia = $stmt->fetchAll(PDO::FETCH_OBJ);


					$sql2 = "select * FROM mercury_rooms_social WHERE mercury_rooms_social.mercury_room_id=". $room->mercury_room_id;
					$stmt2 = $db->query($sql2);  	
					$room->socialData = $stmt2->fetchAll(PDO::FETCH_OBJ);
				}
			}

		}
		
		$db = null;
		echo json_encode($museums);

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}




/**
* Get all beacons
*/
function getBeacons(){
	$request = Slim::getInstance()->request();
	$sql = "select * FROM mercury_beacons";
	$beacons = array('beacons' => "");

	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		$beacons["beacons"] = $stmt->fetchAll(PDO::FETCH_OBJ); 

		echo json_encode($beacons);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



/**
* Add a new social item to the database
*/
function addSocial(){
	$request = Slim::getInstance()->request();
	$evaluation = $request->getBody();
	$social = array("mercury_room_id"=>"", "mercry_room_social_type"=>"", "mercury_room_social_data"=>"", "mercury_user_id"=>"");
	
	// construct data object
	foreach (explode('&', $evaluation) as $chunk) {
	    $social = explode("=", $chunk);

	    if ($param) {
	    	$social[$param[0]] = $param[1];
	    }
	}

	$mercury_room_social_url = "";

	// check if the user exists
	$sql = "INSERT INTO mercury_rooms_social (mercury_room_social_type, mercury_room_social_data, mercury_user_id, mercury_room_social_url) VALUES (:mercury_room_social_type, :mercury_room_social_data, :mercury_user_id, :mercury_room_social_url)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("mercury_room_social_type", $social["mercury_room_social_type"]);
		$stmt->bindParam("mercury_room_social_data", $social["mercury_room_social_data"]);
		$stmt->bindParam("mercury_user_id", $social["mercury_user_id"]);
		$stmt->bindParam("mercury_room_social_url", $social["mercury_room_social_url"]);
		$stmt->execute();
		$social["mercury_room_id"] = $db->lastInsertId();
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}

}


/**
* Add a new user to the database
*/
function addUser(){
	$request = Slim::getInstance()->request();
	$evaluation = $request->getBody();
	$user = array("user_id"=>"", "user_name"=>"", "user_image"=>"", "user_twitterhandle"=>"", "user_facebookid"=>"", "user_active"=>"");
	
	// construct data object
	foreach (explode('&', $evaluation) as $chunk) {
	    $param = explode("=", $chunk);

	    if ($param) {
	    	$user[$param[0]] = $param[1];
	    }
	}

	// check if the user exists
	$sql = "SELECT * FROM mercury_users WHERE user_name = :user_name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("user_name", $user["user_name"]);
		$stmt->execute();
		$matchingEvaluation = $stmt->fetchObject();  

		if($matchingEvaluation){

		}else{
			$sql = "INSERT INTO mercury_users (user_name, user_image, user_twitterhandle, user_facebookid) VALUES (:user_name, :user_image, :user_twitterhandle, :user_facebookid)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);  
				$stmt->bindParam("user_name", $user["user_name"]);
				$stmt->bindParam("user_image", $user["user_image"]);
				$stmt->bindParam("user_twitterhandle", $user["user_twitterhandle"]);
				$stmt->bindParam("user_facebookid", $user["user_facebookid"]);
				$stmt->execute();
				$user["user_id"] = $db->lastInsertId();
				$db = null;
				echo json_encode($user); 
			} catch(PDOException $e) {
				error_log($e->getMessage(), 3, '/var/tmp/php.log');
				echo '{"error":{"text":'. $e->getMessage() .'}}'; 
			}
		}
	}catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



/**
* Get User
*/

function getConnection() {
	$dbhost="localhost";
	$dbuser="deb31925_watm";
	$dbpass="miniketen";
	$dbname="deb31925_watm";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	//$dbc = new mysqli('localhost', 'deb31925_watm', 'miniketen', 'deb31925_watm');
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh -> exec("set names utf8");
	return $dbh;
}		
?>

