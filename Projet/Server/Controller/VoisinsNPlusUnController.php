<?php
require_once 'Model/VoisinsNPlusUnModel.php';

class VoisinsNPlusUnController implements Controller{

	private $model;

	public function  __construct(){
		$this->model = new VoisinsNPlusUnModel();
	}

	public function getVoisinsNPlusUn($id, $nn, $nPlusUn){
		require_once 'View/JsonView.php';
		$voisins = $this->model->getVoisinsNPlusUn($id,$nn, $nPlusUn);
		$view = new JsonView($voisins);
		$view->Render();
	}

}
?>