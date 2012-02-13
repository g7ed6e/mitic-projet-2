<?php
require_once 'Model/ImageModel.php';

class ImageController implements Controller{
	
	private $model;
	
	
	public function  __construct(){
		$this->model = new ImageModel();		
	}
	
	public function allDistance(){
		require_once 'View/JsonView.php';
		$ditances = $this->model->getAllDistance();
		$view = new JsonView($ditances);
		$view->Render();
	}
	
	public function getSignificativesNodes($id,$neighboors){
		require_once 'View/JsonView.php';
		$ditances = $this->model->getSignificativesDistances($id,$neighboors,2);
		$view = new JsonView($ditances);
		$view->Render();
	}
}