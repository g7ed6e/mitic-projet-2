<?php
require_once 'Config/constants.php';
require_once 'Interface.php';
require_once 'Controller/ImageController.php';
require_once 'Controller/VoisinsNController.php';
require_once 'Controller/VoisinsNPlusUnController.php';

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
				/*
				 * id : id de l'image, paramètre obligatoire
				 * w et h : entier pour choisir une taille définie de l'image sans ration (ne marche pas l'un sans l'autre), paramètre optionnel
				 * s : scale de redimessionnement de l'image, paramètre optionnel
				 * t : paramètre de redimensionnement fixe en respectant le ratio, paramètre optionnel
				 * sans paramètre optionnel -> retour de l'image sans redimensionnement
				 */
				$controller->getImage($_GET['id'],$_GET['w'],$_GET['h'],$_GET['s'],$_GET['t']);
			break;
		case 'getVoisinsN':
// 			if(!empty($_GET['nn_plus_1'])) $controller->voisins_n_plus_1($_GET['id'], $_GET['nn'], $_GET['nn_plus_1']); 
// 			else 
			$controller->getVoisinsN($_GET['id'], $_GET['nn']);
			break;
		case 'getVoisinsNPlusUn':
			$controller->getVoisinsNPlusUn($_GET['id'], $_GET['nn'], $_GET['nnPlusUn']);
			break;
		default :
			break;
	}

}
?>
