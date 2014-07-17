<?php

switch($task){
	case 'todoList' :
		$request = $user->getTodos();
		break;
	case 'reorder' : 
		$json = file_get_contents('php://input');
		$priority = json_decode($json,true);
		$request = $user->reorderTodos($priority);
		break;
}

header('Content-type: application/x-json');
header('X-JSON: true');
ob_start('ob_gzhandler');
echo json_encode($request);
ob_end_flush();
exit();

?>