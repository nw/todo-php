<?php

class Session {

	private function __construct(){
		session_name('todo');
		session_start();
		
		header('Cache-control: private');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');				// Date in the past
		header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');		// always modified
		header('Cache-Control: no-store, no-cache, must-revalidate');	// HTTP_1.1
		header('Cache-Control: post-check=0, pre-check=0', false);
		header('Pragma: no-cache');										// HTTP_1.0

		$this->cookieID = (isset($_COOKIE['todo'])) ? $_COOKIE['todo']: '';
	}
	
	public function getInstance(){
		static $instance;
		
		if($instance === null){
			$instance = new Session();
		}
		return $instance;
	}
	
	public function set($name,$value){
		$_SESSION[$name] = $value;
	}
	
	public function get($name){
		if(isset($_SESSION[$name])) {
			return $_SESSION[$name];
			} else {
			return false;
		}
	}
	
	public function delete($name){
		unset($_SESSION[$name]);
	}
	
	public function destroy(){
		$_SESSION = array();
		unset($_SESSION);
		unset($_COOKIE['todo']);
	}

}

?>