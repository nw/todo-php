<?php

class Node {
	
	private $_tpl;
	private $_tplDir = TEMPLATE_DIR;
	private $_vals = array();
	private $definition;
	private $base;

	function __construct($definition,$base = null){
		$this->definition = $definition;
		
		if(isset($this->definition['template_dir'])){ 
			$this->setTemplateDir($this->definition['template_dir']); 
		}		
		if(isset($this->definition['template'])){ 
			$this->setTemplate($this->definition['template']); 
		}
	
		if(isset($parent)){ $this->base = $base; }
		else { $this->base = $this; }
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

	public function addChild($name,$child,$definition){
		$this->_vals[$name] = $this->build($this->_tplDir.$child,$vals);
	}

	public function render(){
		return $this->build($this->getTemplate(),$this->_vals);
	}

	public function build($template,$vals){
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