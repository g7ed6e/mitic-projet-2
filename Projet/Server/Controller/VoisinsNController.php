<?php
require_once 'Model/VoisinsNModel.php';

class VoisinsNController implements Controller{

	private $model;

	public function  __construct(){
		$this->model = new VoisinsNModel();
	}

	public function getVoisinsN($id, $nb_voisins){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getVoisinsN($id,$nb_voisins);
		$view = new JsonView($voisins);
		$view->Render();
	}

	
// 	public function voisins_n_plus_1($id, $nn, $nn_plus_1)
// 	{
// 		require_once 'View/JsonView.php';
// 		$result = $this->model->voisins_n_plus_1($id, $nn, $nn_plus_1);
// 		$view = new JsonView($result);
// 		$view->Render();
// 	}
	
}
?>