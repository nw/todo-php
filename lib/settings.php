<?php

// User Settings Begin

define('APP_URL', 'http://www.nwhite.net/todo/');

define('DB_HOST','dbserver');
define('DB_DB', 'db_name');
define('DB_USER','db_user');
define('DB_PASSWORD','db_pass'); 

// User Settings End



// get our bearings
define('SITE_DIR', dirname(__FILE__));
define('CONF_DIR', SITE_DIR.'/conf/');
define('TEMPLATE_DIR', SITE_DIR.'/templates/' );
define('NODE_DIR', SITE_DIR.'/nodes/' );


// globals
$db = new MySql();
$user = new User($db);

$action = (isset($_REQUEST['action'])) ? $_REQUEST['action'] : '';
$task = (isset($_REQUEST['task'])) ? $_REQUEST['task'] : '';

?>