
<? if($action == 'todo'){?>
<a href="#" id="settings_link">Settings</a> | 
<? } else { ?>
<a href="todo.list">Todo</a> | 	
<? } if($action != 'page' ||( $action == 'page' && $task != 'about') ){?>
<a href="page.about" id="add">About</a> |  
<? } if($action != 'page' || ($action == 'page' && $task != 'help') ){?>
<a href="page.help">Help</a> |  	
<? } ?>
<a href="log.out">Logout</a>