<?php
require_once 'Model/ImageModel.php';

class ImageController {

	private $model;


	public function  __construct(){
		$this->model = new ImageModel();
	}

	public function getImage($id, $w=0,$l=0,$c=0,$t=0){
		$image = $this->model->getImage($id,$w,$l,$c,$t);
		require_once 'View/ImageView.php';
		$view = new ImageView($image);
		$view->Render();
		imagedestroy($image[0]);
	}
}
?>