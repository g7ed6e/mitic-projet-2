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
		$ditances = $this->model->getSignificativesDistances($id,$neighboors);
		$view = new JsonView($ditances);
		$view->Render();
	}
	
	/**
	 * 
	 * @param unknown_type $id
	 * @param unknown_type $nb_neighboors
	 * @param unknown_type $sorted
	 */
	public function getSignificativesNodesV1($id, $nb_neighboors){
		require_once 'View/JsonView.php';
		$distances = $this->model->getSignificativesDistancesV1($id,$nb_neighboors);
		$view = new JsonView($distances);
		$view->Render();
	}
}