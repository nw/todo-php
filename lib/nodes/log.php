<?php

switch($task){
	case 'in' :
		include(NODE_DIR.'log/in.php');
		break;
	case 'out' :
		$session = Session::getInstance();
		$session->destroy();
		header('Location: '.APP_URL.'log.in');
		die();
		break;
}

?>