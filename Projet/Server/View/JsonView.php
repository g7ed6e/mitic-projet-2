<?php
class JsonView implements View{

	private $data;
	
	public function __construct($data){
		$this->data = $data;
	}
	
	public function Render(){
		//header("Content-type: application/json; charset=utf-8");
		// Date in the past
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Cache-Control: no-cache");
		header("Pragma: no-cache");
		echo json_encode($this->data);
	}
	
	
}