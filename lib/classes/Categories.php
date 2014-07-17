<?php

class Categories {

	function __construct($dbobj,$user){
		$this->db = $dbobj;
		$this->user = $user;
	}
	
	public function create($name,$priority=null){
	
		if(!$id = $this->user->getId()) return false;
		
		if($priority === null){	
			$sql = "SELECT MAX(`priority`) AS `priority` FROM `categories` WHERE `user_id` = '$id'";

			if(!$max = $this->db->getFirst($sql)) $priority = 1;
			else $priority = ($max['priority'] + 1);
		}
		
		$sql = "INSERT INTO `categories` (`user_id`, `name`, `priority`) VALUES ( '$id', '$name', '$priority')";
		
		if(!$this->db->query($sql,true)) return false;
		else return $this->db->getInsertID();
		
	}
	
	public function toArray(){
		if(!$id = $this->user->getId()) return false;
		
		$sql = "SELECT `id`, `name` FROM `categories` WHERE `user_id` = '$id' ORDER BY `priority`";
		
		if($result = $this->db->getArray($sql)) return $result;
		
		return array();
	}


}

?>