<?php
class ImageView {
	private $data;
	private $format;

	public function __construct($data){
		$this->data = $data[1];
		$this->format = $data[0];
	}

	public function Render(){
		if ($this->format=='image/jpeg' ) {
			header("Content-Type: image/jpeg");
			header("Expires: Fri, 1 Jun 2012 05:00:00 GMT");
			imagejpeg($this->data);
		}
		elseif ($this->format=='image/png' ) {
			header("Content-Type: image/png");
			header("Expires: Fri, 1 Jun 2012 05:00:00 GMT");
			imagepng($this->data);
		}
		elseif ($this->format=='image/gif' ) {
			header("Content-Type: image/gif");
			header("Expires: Fri, 1 Jun 2012 05:00:00 GMT");
			imagegif($this->data);
		}
	}

}
?>