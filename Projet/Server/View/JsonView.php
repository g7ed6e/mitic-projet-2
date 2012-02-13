<?php
class JsonView implements View{

	private $data;
	
	public function __construct($data){
		$this->data = $data;
	}
	
	public function Render(){
		//header("Content-type: application/json; charset=utf-8");
		echo json_encode($this->data);
	}
	
	
}