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
	 */
	public function getSignificativesNodesV1($id, $nb_neighboors){
		require_once 'View/JsonView.php';
		$distances = $this->model->getSignificativesDistancesV1($id,$nb_neighboors);
		$view = new JsonView($distances);
		$view->Render();
	}

	public function getSignificativesNodesV2($id, $nb_neighboors){
		require_once 'View/JsonView.php';
		$distances = $this->model->getSignificativesDistancesV2($id,$nb_neighboors);
		$view = new JsonView($distances);
		$view->Render();
	}

	public function getImage($id, $w=0,$l=0){
		$image = $this->model->getImage($id,$w,$l);
		require_once 'View/ImageView.php';

		$view = new ImageView($image);
		$view->Render();
	}

	public function voisins_n($id, $nn)
	{
		require_once 'View/JsonView.php';
		$result = $this->model->voisins_n($id, $nn);
		$view = new JsonView($result);
		$view->Render();
	}
	
	public function voisins_n_plus_1($id, $nn, $nn_plus_1)
	{
		require_once 'View/JsonView.php';
		$result = $this->model->voisins_n_plus_1($id, $nn, $nn_plus_1);
		$view = new JsonView($result);
		$view->Render();
	}
}