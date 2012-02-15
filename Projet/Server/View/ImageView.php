<?php
class ImageView implements View{
	private $data;
	private $format;

	public function __construct($data){
		$this->data = $data[1];
		$this->format = $data[0];
	}

	public function Render(){

		if ($this->format=='image/jpeg' ) {
			header("Content-Type: image/jpeg");
			imagejpeg($this->data);
		}
		elseif ($this->format=='image/png' ) {
			header("Content-Type: image/png");
			imagepng($this->data);
		}
		elseif ($this->format=='image/gif' ) {
			header("Content-Type: image/gif");
			imagegif($this->data);
		}


	}

}
?>