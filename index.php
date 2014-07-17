<?php

require_once('lib/settings.php');
require_once('lib/routes.php');

if(!$user->isAuthenticated()){
	if(array_key_exists($action,$routes['default']) && in_array($task, $routes['default'][$action]))
		include(NODE_DIR.$action.'.php');
	else
		header('Location: '.APP_URL.'log.in');
} else {
	if(array_key_exists($action,$routes['validated']) && in_array($task, $routes['validated'][$action]))
		include(NODE_DIR.$action.'.php');
	else
		header('Location: '.APP_URL.'todo.list');
}


function __autoload($className){
	include_once(SITE_DIR."/classes/{$className}.php"); 
}

?>