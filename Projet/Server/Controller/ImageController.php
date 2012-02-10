<?php
require_once 'Model/ImageModel.php';

class ImageController implements Controller{
	
	private $model;
	
	
	public function  __construct(){
		$this->model = new ImageModel();		
	}
	
	public function allDistance(){
		header("Content-type: application/json; charset=utf-8");
		require_once 'View/JsonView.php';
		$ditances = $this->model->getAllDistance();
		$view = new JsonView($ditances);
		$view->Render();
	}
}