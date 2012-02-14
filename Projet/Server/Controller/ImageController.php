<?php
require_once 'Model/ImageModel.php';

class ImageController implements Controller{

	private $model;


	public function  __construct(){
		$this->model = new ImageModel();
	}

	public function getImage($id, $w=0,$l=0,$c=0){
		$image = $this->model->getImage($id,$w,$l,$c);
		require_once 'View/ImageView.php';
		$view = new ImageView($image);
		$view->Render();
	}
}