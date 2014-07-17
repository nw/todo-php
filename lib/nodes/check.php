<?php

header('Content-type: application/x-json');
header('X-JSON: true');

switch($task){
	case 'name' :
		echo json_encode($user->isAvailable($_REQUEST['user']));
		break;
}

exit();

?>