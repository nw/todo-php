<?php

$routes = array(

	'validated' => array(
		'log' => array(
			'out'
		),
		'create' => array(
			'category', 'todo'
		),
		'todo' => array(
			'list'
		),
		'json' => array(
			'todoList', 'reorder'
		),
		'page' => array(
			'about','help'
		)
	),

	'default' => array(
		'log' => array(
			'in'
		),
		'create' => array(
			'account'
		),
		'check' => array(
			'name'
		),
		'page' => array(
			'about'
		)	
	),

);

?>