<?php
require_once 'config/constants.php';
require_once 'Interface.php';
require_once 'controller/ImageController.php';
require_once 'controller/VoisinsNController.php';
require_once 'controller/VoisinsNPlusUnController.php';

if(!empty($_GET['controller']) && !empty($_GET['action'])){

	switch ($_GET['controller']){
		case 'image':
			$controller = new ImageController();
			break;
		case 'voisinsN':
			$controller = new VoisinsNController();
			break;
		case 'voisinsNPlusUn':
			$controller = new VoisinsNPlusUnController();
			break;
		default:
			break;
	}

	switch($_GET['action']){
// 		case 'allDistance' :
// 			$controller->allDistance();
// 			break;
// 		case 'getSignif' :
// 			if(!empty($_GET['id'])&&!empty($_GET['nn']))
// 			$controller->getSignificativesNodes($_GET['id'], $_GET['nn']);
// 			break;
// 		case 'getSignifV1':
// 			$controller->getSignificativesNodesV1($_GET['id'], $_GET['nn']);
// 			break;
// 		case 'getSignifV2':
// 			$controller->getSignificativesNodesV2($_GET['id'], $_GET['nn']);
// 			break;
		case 'getImg':
			if(!empty($_GET['id']))
				$controller->getImage($_GET['id'],$_GET['w'],$_GET['l'],$_GET['c']);
			break;
		case 'getVoisinsN':
// 			if(!empty($_GET['nn_plus_1'])) $controller->voisins_n_plus_1($_GET['id'], $_GET['nn'], $_GET['nn_plus_1']); 
// 			else 
			$controller->getVoisinsN($_GET['id'], $_GET['nn']);
			break;
		case 'getVoisinsNPlusUn':
			$controller->getVoisinsNPlusUn($_GET['id'], $_GET['nn'], $_GET['nPlusUn']);
			break;
		default :
			break;
	}

}
