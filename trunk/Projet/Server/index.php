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
	
	switch($_GET['action']){
		case 'allDistance' :
			$controller->allDistance();
			break;
		case 'getSignif' :
			if(!empty($_GET['id'])&&!empty($_GET['nn']))
				$controller->getSignificativesNodes($_GET['id'], $_GET['nn']);
			break;
		case 'getSignifV1':
			$controller->getSignificativesNodesV1($_GET['id'], $_GET['nn'], !empty($_GET['s']) ? $_GET['s'] : false);
			break;
		default :
			break;
	}
	 
}
