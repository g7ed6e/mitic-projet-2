<?php
require_once 'Model/VoisinsNModel.php';

class VoisinsNController implements Controller{

	private $model;

	public function  __construct(){
		$this->model = new VoisinsNModel();
	}

	public function getVoisinsN($id, $nb_voisins,$w,$h){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getVoisinsN($id,$nb_voisins, $w, $h);
		$view = new JsonView($voisins);
		$view->Render();
	}

	
	public function getAllDistances()
	{
		require_once 'View/JsonView.php';
		$voisins = $this->model->getAllDistances();
		$view = new JsonView($voisins);
		$view->Render();
	}
}
?>