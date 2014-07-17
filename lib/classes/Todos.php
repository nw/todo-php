<?php

class Todos {

	function __construct($dbobj,$user){
		$this->db = $dbobj;
		$this->user = $user;
	}
	
	public function create($todo,$category_id,$priority=null){

		if(!$id = $this->user->getId()) return false;

		if($priority === null){	
			$sql = "SELECT MAX(`priority`) AS `priority` FROM `todos` WHERE `user_id` = '$id'";

			if(!$max = $this->db->getFirst($sql)) $priority = 1;
			else $priority = ($max['priority'] + 1);
		}
		
		$todo = $this->db->escape($todo);
		
		$sql = "INSERT INTO `todos` (`user_id`, `category_id`, `message`, `created`, `priority`) 
					  			 VALUES ( '$id', '$category_id', '$todo', NOW(), '$priority')";

		if(!$this->db->query($sql,true)) return false;
		else return $this->db->getInsertID();
		
	}
	
	public function getTodo($id){
		$uid = $this->user->getId();
		
		$sql = "SELECT t.id, c.name AS category, t.message, DATE_FORMAT( ADDTIME(t.created, '0 7:0:0.000000'),  '%a %b %d %H:%i:%s +0000 %Y' ) AS created, t.priority, t.status
				FROM  `todos` AS t,  `categories` AS c
				WHERE t.id = '$id' 
					AND t.user_id =  '$uid' 
					AND t.category_id = c.id
				LIMIT 1";
		
		return $this->db->getFirst($sql);
	}
	
	public function changePriority($id,$priority){
		$uid = $this->user->getId();
		
		$sql = "UPDATE `todos` SET `priority` = '$priority' WHERE `user_id` = '$uid' AND `id` = '$id'";
		if($this->db->query($sql)) return true;
		else false;
	}
	
	public function toArray(){
		if(!$id = $this->user->getId()) return false;
		
		$sql = "SELECT t.id, c.id AS category_id, c.name AS category, t.message, DATE_FORMAT( ADDTIME(t.created, '0 7:0:0.000000'),  '%a %b %d %H:%i:%s +0000 %Y' ) AS created, t.priority, t.status
				FROM  `todos` AS t,  `categories` AS c
				WHERE t.user_id =  '$id'
					AND t.category_id = c.id
				ORDER BY priority ASC";
		
		if($result = $this->db->getArray($sql)) return $result;
		
		return array();
	}


}

?>