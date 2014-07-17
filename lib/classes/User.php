<?php

class User {
	
	private $authenticated = false;

	function __construct($dbobj){
		$this->db = $dbobj;
		$this->session = Session::getInstance();
		
		$this->categories = new Categories($this->db,$this);
		$this->todos = new Todos($this->db,$this);
		
		$this->authenticated = $this->session->get('authenticated');
		$this->settings = $this->session->get('user');
	}
	
	public function validate($login,$pass){
		
		$login = $this->db->escape($login);
		$pass = $this->db->escape($pass);
		
		$sql = "SELECT * FROM `users` WHERE (`user` || `email`) = '$login' && `password` = '$pass' LIMIT 1";

		if(!$user = $this->db->getFirst($sql)){
			return false;
		} else {
			$this->authenticated = true;
			$this->session->set('authenticated',true);
			$this->session->set('user',$user);
			$this->settings = $user;
			return true;
		}
		
	}
	
	public function isAuthenticated(){
		return $this->authenticated;
	}
	
	public function getId(){
		if(!$this->isAuthenticated()) 
			return false;
		
		return $this->settings['id'];
	}
	
	public function isAvailable($username){
		
		$username = $this->db->escape($username);
		
		$sql = "SELECT `id` FROM `users` WHERE `user` = '$username' LIMIT 1";
		
		if(!$user = $this->db->getFirst($sql)){ return true; }
		else { return false; }
	}
	
	public function create($display,$user,$password,$email){
		
		if(!$this->isAvailable($user)){ return false; }
		
		$display = $this->db->escape($display);
		$user = $this->db->escape($user);
		$password = $this->db->escape($password);
		$email = $this->db->escape($email);
		
		$sql = "INSERT INTO `users` ( `display`, `user`, `password`, `email` ) 
				VALUES ( '$display', '$user', '$password', '$email' )";
				
		$this->db->query($sql);
		
		if($id = $this->setUser($this->db->getInsertID())){
			if($this->addCategory('General')) return $id;
			else return false;
		}
		
		return false;
		
	}
	
	public function addCategory($name,$priority=null){
		if(!$this->isAuthenticated()) return false;
		
		return $this->categories->create($name,$priority);
	}
	
	public function addTodo($todo,$category_id){
		if(!$this->isAuthenticated()) return false;
		
		$id = $this->todos->create($todo,$category_id);
		return $this->todos->getTodo($id);
	}
	
	public function getTodos(){
		if(!$this->isAuthenticated()) return false;
		return $this->todos->toArray();
	}
	
	public function reorderTodos($effected){
		foreach($effected as $id => $priority){
			$this->todos->changePriority($id,$priority);
		}
		return true;
	}
	
	public function getCategories(){
		return $this->categories->toArray();
	}
	
	private function setUser($id){

		$sql = "SELECT * FROM `users` WHERE `id` = '$id'";
		
		if(!$user = $this->db->getFirst($sql)){ return false; }
		else {
			$this->authenticated = true;
			$this->session->set('authenticated',true);
			$this->session->set('user',$user);
			$this->settings = $user;
			return true;
		}
	}
	
	
	
	public function setDisplay($display){
		
		
	}

	public function changePassword($old,$new,$confirm){
		if(!$this->authenticated) { return false; }
		
		if($old == $this->settings['password'] || $new == $confirm){
			
			$confirm = $this->db->escape($confirm);
			
			$sql = "UPDATE `users` SET `password` = '$confirm' WHERE `id` = '".$this->settings['id']."'";
			$this->db->query($sql);
			if($this->db->affectedRows){
				$this->settings['password'] = $new;
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	function getTwitter(){
		
	}

}

?>