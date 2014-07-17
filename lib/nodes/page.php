<?php

$layout  = new Template('master.tpl');
$content = new Template('default.tpl');

$layout->set('title','TODO : '.ucfirst($task));

$file = TEMPLATE_DIR.'page/'.$task.'.tpl';

if(file_exists($file)) $content->addChild('content','page/'.$task.'.tpl');
else {
	header('Location: '.APP_URL);
	die();
}

$content->set('action',$action);
$content->set('task', $task);
$content->set('authenticated', $user->isAuthenticated());

$layout->set('content',$content->render());

echo $layout->render();

exit();

?>