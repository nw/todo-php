<?php

$layout  = new Template('master.tpl');
$content = new Template('default.tpl');

$layout->set('title','TODO : Welcome');
$layout->set('script', 'js/redo.js');

$content->set('action',$action);
$content->set('task', $task);
$content->set('authenticated', $user->isAuthenticated());

$content->set('settings',$content->build(TEMPLATE_DIR.'settings.tpl'));

$content->addChild('content','todo.tpl');
$content->addChild('sidebar','sidebar.tpl',array('categories' => $user->getCategories() ));

$layout->set('content',$content->render());

echo $layout->render();

exit();

?>