<?php
class JsonView implements View{

	private $data;
	
	public function __construct($data){
		$this->data = $data;
	}
	
	public function Render(){
		echo json_encode($this->data);
	}
	
	
}