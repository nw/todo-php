<?php

class Conf {

	private $configuration = array();

	private function __construct(){
	
	}
	
	public function getInstance(){
		static $instance;
		
		if($instance === null){
			$instance = new Conf();
		}
		return $instance;
	}
	
	public function loadFile($name){
		$result = @include(CONF_DIR.$name.'.conf');
		$this->configuration[$name] = $result;
		return true;
	}
	
	public function setRuntimeValue($path,$value){
	
		$fragments = explode('/', $path);
		$empty = array_shift($fragments);
		if($empty !== '')
			return false;
	
		
		if( count($fragments) > 0 && $fragments[count($fragments) - 1] == '')
				array_pop($fragments);
				
		$arr_ref =& $this->configuration;
		
		$path_exists = true;
		for($i = 0; $i < count($fragments); $i++){
			$path_exists = $path_exists && isset($arr_ref[$fragments[$i]]);
			$arr_ref =& $arr_ref[$fragments[$i]];
		}
		
		$arr_ref = $value;
		
		return true;
	}
	
	public function set($path,$value){
		return $this->setRuntimeValue($path,$value);
	}
	
	public function get($path){
	
		$fragments = explode('/', $path);
		$empty = array_shift($fragments);
		
		if($empty !== '')
			return null;
			
		if( count($fragments) > 0 && $fragments[count($fragments) - 1] == '')
			array_pop($fragments);
			
		$conf_to_search = array($this->configuration);
		
		$found_settings = array();
	        foreach ($conf_to_search as $i => $conf) {
	            $current =& $conf_to_search[$i];
	            $found = true;

	            foreach($fragments as $fragment) {
	                if (isset($current[$fragment])) {
	                    $current =& $current[$fragment];
	                } else {
	                    $found = false;
	                    break;
	                }
	            }

	            if ($found)
	                $found_settings[] = $current;
	        }
	        /* Merge settings */
	        $result = array();
	        foreach ($found_settings as $settings) {
	            // TODO: Revise that array_merge_rec works well enough for us (defined in init/functions.php)
	            if (!is_array($settings ))
	                $result = $settings;
	            else if (!is_array($result) and is_array($settings))
	                $result = $settings;
	            else
	                $result = array_merge_recursive($result, $settings);
	        }

	        if (count($found_settings))
	            return $result;
	        else
	            return null;


   }
}


?>