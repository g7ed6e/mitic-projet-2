<?php
class ImageModel implements Model{
	
	public function getAllDistance(){
		$res = array();
		$file = file_get_contents(ROOT_DATA_REPOSITORY.SEP."50.txt");
		$distances = explode("\n", $file);
		
		foreach ($distances as $distance)
			$res[] = explode(" ", $distance);
		
		return $res;
	}
	
}