<?php
class ImageModel implements Model{

	public function getAllDistance(){
		$res = array();
		$file = file_get_contents(ROOT_DATA_REPOSITORY.SEP."50.txt");
		$distances = explode("\n", $file);

		foreach ($distances as $distance){
			$distance = trim($distance);
			if(!empty($distance)) $res[] = explode(" ", $distance);
		}
		return $res;
	}

	public function getSignificativesDistances($id,$nn,$prof){
		$array = $this->getAllDistance();
		$voisins_n = $this->recupererMin($id, $nn, $array);
		$res = $voisins_n;	
		foreach ($voisins_n as $v)
			$res = array_merge($res, $this->recupererMin($v[0] != $id ?$v[0]:$v[1], $nn, $array));

		return $res;
	}
	
	private function recupererMin($id,$nn, &$dist){
			$keys = array();
			$res = array();
			$tid = array();
			$val = array();
			$max = 1;
			$nb = 0;
			foreach($dist as $key => $di){
				if(($di[0]==$id) || ($di[1]==$id)){
					if($nb==$nn){
						if(floatval($di[2])<floatval($max)){
							for($i =0; $i<$nn;$i++){
								if(floatval($max)==floatval($val[$i])){
									$val[$i]=$di[2];
									$tid[$i]=$di;
									$keys[$i] = $key;										
									$max = max($val);										
									break;
								}
							}
						}
					}else{
						$keys[] = $key; 
						$tid[]=$di;
						$val[]=$di[2];
						$nb++;
						$max = max($val);
					}
				}
			}

			foreach ($keys as $key)
				unset($dist[$key]);
			
			return $tid;
	}
	
}