<?php

//	We got here because the user has yet to be authenticated

$form = false;
// check if the user is trying to login
if(isset($_POST['login'])){
	$form = 'login';
	$username = $_POST['user'];
	$password = $_POST['pass'];
	$user->validate($username,$password);
}

// check if the user is trying to create an account
else if(isset($_POST['add'])){
	$form = 'add';
	$display = $username = $_POST['user'];
	$password = $_POST['pass'];
	$confirm = $_POST['confirm'];
	$email = $_POST['email'];
	
	if($password == $confirm)
		$user->create($display,$username,$password,$email);
}

if($user->isAuthenticated()){
	header('Location: '.APP_URL.'todo.list');
	die();
}

$layout  = new Template('master.tpl');
$content = new Template('default.tpl');

$layout->set('title','TODO : Please Login');
$layout->set('script','js/login.js');

$content->set('action',$action);
$content->set('task', $task);
$content->set('authenticated', $user->isAuthenticated());

$content->addChild('content','login.tpl',array('form' => $form,'action' => $action, 'task' => $task));

$layout->set('content', $content->render());

echo $layout->render();

exit();

?>