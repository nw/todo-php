<?php

class Singleton
{
	private static $instances = array();

	private function __construct(){}

	public function getInstance( $class = null )
	{
		if( is_null( $class ) )
		{
			trigger_error( "Missing class information", E_USER_ERROR );
		}
		if( !array_key_exists( $class, self::$instances ) )
		{
			self::$instances[ $class ] = new $class;
		}
		return self::$instances[ $class ];
	}
	public final function __clone()
	{
		trigger_error( "Cannot clone instance of Singleton pattern", E_USER_ERROR );
	}
}

?>