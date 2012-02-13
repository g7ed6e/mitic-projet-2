<?php
class ImageView implements View{
	private $data;
	
	public function __construct($data){
		$this->data = $data;
	}
	
	public function Render(){
		header("Content-Type: image/jpeg");
		imagejpeg($this->data);
	}
}