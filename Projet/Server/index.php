<?php
require_once 'Config/constants.php';
require_once 'Controller/ImageController.php';
require_once 'Controller/ScoreController.php';
require_once 'Controller/DistanceController.php';

if(!empty($_GET['controller']) && !empty($_GET['action'])){
	switch ($_GET['controller']){
		case 'image':
			$controller = new ImageController();
			if ($_GET['action'] == 'getImg'){
				if(isset($_GET['id'])) {
					$controller->getImage($_GET['id'],!empty($_GET['w'])?$_GET['w']:null,!empty($_GET['h'])?$_GET['h']:null,!empty($_GET['s'])?$_GET['s']:null,!empty($_GET['t'])?$_GET['t']:null);
				}
			}
			break;
		case 'score':
			$controller = new ScoreController();
			if ($_GET['action'] == 'getScoreV1' ) {
				$n = $_GET['nn'] > 1490 ? 1490 : $_GET['nn'];
				$controller->getScoreV1( $_GET['id'], $n, $_GET['w'], $_GET['h']);	
			}
			else if ($_GET['action'] == 'getScoreV2') {
				$n = $_GET['nn'] > 1490 ? 1490 : $_GET['nn'];
				$s = $_GET["s"] != "0";
				$controller->getScoreV2($_GET['id'], $n, $_GET['w'], $_GET['h'], $_GET['s']);
			}
			else if ($_GET['action'] == 'getScoreV3') {
				$n = $_GET['nn'] > 1490 ? 1490 : $_GET['nn'];
				$s = $_GET["s"] != "0";
				$controller->getScoreV3($_GET['id'], $n, $_GET['w'], $_GET['h'], $_GET['s']);
			}
			break;
		case 'distance':
			$controller = new DistanceController();
			if($_GET['action'] == 'getDistances'){
				$controller->getDistancesV2($_GET['id'], $_GET['nn'], $_GET['w'], $_GET['h']);
			}
			else if ($_GET['action'] == 'getDistances2dDemo'){
				$controller->getDistances2dDemo($_GET['id'], $_GET['nn'], $_GET['w'], $_GET['h']);
			}
			else if ($_GET['action'] == 'getDistances3dDemo'){
				$controller->getDistances3dDemo($_GET['id'], $_GET['nn'], $_GET['w'], $_GET['h']);
			}
			break;
		default:
			break;
	}
	
// 	return;
	
// 	switch($_GET['action']){
// 		case 'getImg':
			
// 		case 'getVoisinsN':
// 			if(  (isset($_GET['id'])) && (isset($_GET['nn'])) && (isset($_GET['w'])) && (isset($_GET['h'])) )
// 			{
// 				$controller->getVoisinsN( $_GET['id'], $_GET['nn'], $_GET['w'], $_GET['h']);
// 			}
// 			break;
// 		case 'getVoisinsNPlusUn':
// 			if(  (isset($_GET['id'])) && (isset($_GET['nn'])) && (isset($_GET['nnPlusUn'])) && (isset($_GET['w'])) && (isset($_GET['h'])) )
// 			{
// 				$controller->getVoisinsNPlusUn( $_GET['id'], $_GET['nn'], $_GET['nnPlusUn'], $_GET['w'], $_GET['h'] );
// 			}
// 			break;
// 		default :
// 			break;
// 	}

}
?>
