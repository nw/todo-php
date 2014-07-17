<?php


class MySql {

	function __construct($host='',$db='',$user='',$pass=''){
	
		if($host == '') { $host = DB_HOST; }
		if($db == ''){ $db = DB_DB; }
		if($user == ''){ $user = DB_USER; }
		if($pass == ''){ $pass = DB_PASSWORD; }
		
		$this->host = $host;
		$this->db = $db;
		$this->user = $user;
		$this->pass = $pass;
		
		$this->mysqlObj = new mysqli($this->host,$this->user,$this->pass,$this->db);
		
		
	}
	
	public function query($query,$affected=false){
		if(!$resultObj = $this->mysqlObj->query($query)){
			$error = 'Set';
			$this->sendError($error);
		}
		if($affected) {
			if(is_object($resultObj)){
				return $resultObj->affect_rows;
			} else {
				return $resultObj;
			}
		} else {
			return $resultObj;
		}
	}
	
	public function getArray($query,$type=MYSQLI_ASSOC){
		if(!$resultObj = $this->mysqlObj->query($query)){
			$error = '';
			$this->sendError($error);
		}
		
		if($resultObj->num_rows){
			$data = array();
			while($row = $resultObj->fetch_array($type)){
				$data[] = $row;
			}
			
			return $data;
		} else {
			return false;
		}
		
	}
	
	public function getFirst($query,$type=MYSQLI_ASSOC){
		if(!$resultObj = $this->mysqlObj->query($query)){
			$error = '';
			$this->sendError($error);
		}
		
		if($resultObj->num_rows){
			return $resultObj->fetch_array($type);
		} else {
			return false;
		}
	}
	
	public function getInsertID(){
		return $this->mysqlObj->insert_id;
	}
	
	public function affectedRows(){
		return $this->mysqlObj->affect_rows;
	}
	
	public function escape($string){
		if(get_magic_quotes_gpc()){
			return $string;
		} else {
			return $this->mysqlObj->real_escape_string($string);
		}
	}
	
	public function sendError($error){
	
		die();
	}

}


?>