<?php
	require_once("../core/core_functions.php");

	$user_email = $_POST["user_email"];
	$password = $_POST["user_password"];
	$dbc = getDBConnection();		
	$status;

	// first see if this user has login permissions
	$sql = "SELECT user_id FROM mercury_users WHERE user_email = ? AND  user_password = ? AND user_admin = 1";
	if($stmt = $dbc->prepare($sql))
	{


		$stmt->bind_param('ss',$user_email, $password);
		if($stmt->execute())
		{
			$stmt->store_result();
			$stmt->bind_result($user_id);
			$stmt->fetch();

			if($stmt->num_rows() == 0)
			{
				echo false;
			}else{

				$status['id'] = $user_id;
				$status['value'] = true;
			}
		}else{
			echo false;
		}

				print json_encode($status);	

	}else{
		return false;
	}
?>
