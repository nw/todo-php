<?php

class Template {
	
	var $_tpl;
	var $_tplDir = TEMPLATE_DIR;
	var $_vals = array();
	
	
	function __construct($template='',$tplDir=null){
		if(isset($tplDir)){ $this->setTemplateDir($tplDir); }
		if(isset($template)){ $this->setTemplate($template); }
	}
	
	public function setTemplateDir($tplDir){
		$this->_tplDir = $tplDir;
	}
	
	public function setTemplate($tpl){
		$this->_tpl = $this->_tplDir.$tpl;
	}
	
	public function getTemplate(){
		return $this->_tpl;
	}
	
	public function set($name,$value){
		$this->_vals[$name] = $value;
	}
	
	public function setAll($object){
		foreach($object as $key => $value){
			$this->_vals[$key] = $value;
		}
	}
	
	public function addChild($name,$child,$vals=array()){
		$this->_vals[$name] = $this->build($this->_tplDir.$child,$vals);
	}
	
	public function render(){
		return $this->build($this->getTemplate(),$this->_vals);
	}
	
	public function build($template,$vals=array()){
		if(is_array($vals)){ 
			extract($vals); 			// Extract the vars to local namespace
		}
        ob_start();                    	// Start output buffering
        include($template);  			// Include the file
        $content = ob_get_contents(); 	// Get the contents of the buffer
        ob_end_clean();                	// End buffering and discard
        return $content;              	// Return the contents		
	}
	
}

?>