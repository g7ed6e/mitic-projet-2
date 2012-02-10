<?php
require_once 'config/constants.php';
require_once 'Interface.php';
require_once 'controller/ImageController.php';

if(!empty($_GET['controller']) && !empty($_GET['action'])){

	switch ($_GET['controller']){
		case 'image':
			$controller = new ImageController();
			break;
		default:
			break;	
	}
	
	$controller->$_GET['action']();
	 
}
