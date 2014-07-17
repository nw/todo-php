<?php

switch($task){
	case 'account' :
		include(NODE_DIR.'log/in.php');
		break;
	case 'category' :
		$request = $user->addCategory($_REQUEST['name']);
		break;
	case 'todo' :
		if(!isset($_REQUEST['submit'])){
			header('Location: '.APP_URL.'todo.list');
			die();
		}
		$categories = $user->getCategories();
		$request = $user->addTodo($_REQUEST['message'],$categories[0]['id']);
		break;
		
}

header('Content-type: application/x-json');
header('X-JSON: true');
echo json_encode($request);

exit();

?>