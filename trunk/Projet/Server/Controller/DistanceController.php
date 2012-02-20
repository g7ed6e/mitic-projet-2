<?php
require_once 'Model/DistanceModel.php';

class DistanceController{

	private $model;

	public function  __construct(){
		$this->model = new DistanceModel();
	}

	public function getDistances($id, $n, $nPlusUn,$w,$h){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getDistances($id,$n,$nPlusUn, $w, $h);
		$view = new JsonView($voisins);
		$view->Render();
	}

	
// 	public function getAllDistances()
// 	{
// 		require_once 'View/JsonView.php';
// 		$voisins = $this->model->getAllDistances();
// 		$view = new JsonView($voisins);
// 		$view->Render();
// 	}
}
?>