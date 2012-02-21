<?php
require_once 'Model/ScoreModel.php';

class ScoreController{

	private $model;

	public function  __construct(){
		$this->model = new ScoreModel();
	}

	public function getScoreV1($id, $nb_voisins,$w,$h){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getScoreV1($id,$nb_voisins, $w, $h);
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
	
	public function getScoreV2($id, $n, $w, $h, $s)
	{
		require_once 'View/JsonView.php';
		$voisins = $this->model->getScoreV2($id, $n, $w, $h, $s);
		$view = new JsonView($voisins);
		$view->Render();
	}
	
	public function getScoreV3($id, $n, $w, $h, $s)
	{
		require_once 'View/JsonView.php';
		$voisins = $this->model->getScoreV3($id, $n, $w, $h, $s);
		$view = new JsonView($voisins);
		$view->Render();
	}
}
?>