<?php
require_once 'Model/DistanceModel.php';

class DistanceController{

	private $model;

	public function  __construct(){
		$this->model = new DistanceModel();
	}

	public function getDistancesV2($id, $n, $w,$h){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getDistancesV2($id, $n , $w, $h);
		$view = new JsonView($voisins);
		$view->Render();
	}

	public function getDistances2dDemo($id, $n, $w,$h){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getDistances2dDemo($id, $n , $w, $h);
		$view = new JsonView($voisins);
		$view->Render();
	}
	
	public function getDistances3dDemo($id, $n, $w,$h){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getDistances3dDemo($id, $n , $w, $h);
		$view = new JsonView($voisins);
		$view->Render();
	}
}
?>