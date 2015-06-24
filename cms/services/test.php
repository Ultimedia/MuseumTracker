<?php


	$evaluation = "test=BodyValue1&test2=BodyValue2";
	$user = array("user_name"=>"", "user_image"=>"", "user_twitterhandle"=>"", "user_active"=>"");


	foreach (explode('&', $evaluation) as $chunk) {
	    $param = explode("=", $chunk);

	    if ($param) {
	    	$user[$param[0]] = $param[1];
	    }
	}

	print_r($user);

?>

