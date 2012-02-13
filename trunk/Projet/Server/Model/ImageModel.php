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

	// 	public function getSignificativesDistances($id,$nn){
	// 		$array = $this->getAllDistance();
	// 		$voisins_n = $this->recupererMin($id, $nn, $array);
	// 		$res = $voisins_n;
	// 		foreach ($voisins_n as $v)
	// 			$res = array_merge($res, $this->recupererMin($v[0] != $id ?$v[0]:$v[1], $nn, $array));

	// 		return $res;
	// 	}

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


	public function getSignificativesDistancesV1($id,$nn,$sorted){

		$array = $this->getAllDistance();
		$voisins_n = $this->recupererMin($id, $nn, $array);
		$res = $voisins_n;
		// dans $ res on un tableau: id | id | dist

		var_dump($res);
		
		if($sorted)
		{
			array_multisort($res[2], SORT_ASC, SORT_NUMERIC);
			var_dump($res);
		}


		// on construit un tableau id | x | y
		// on place le premier point au centre (en 0, 0)
		$positions = array();
		$positions[0] = array($id, 0, 0);
		// l'angle entre chaque segment reliant un "plus proche voisin" à l'image de référence
		$angle = 2 * pi() / $nn;



		// on construit aussi un tableau contenant uniquement les associations d'image (I.E les liens)
		$liens = array();
		// on itère sur les plus proches voisins filtrés
		for ($i = 0; $i < $nn ; $i++)
		{
			// on calcule les coordonnées pour un id donné
			$coords = $this->coordonnesXY($i * $angle, $res[$i][2]);
			// on ajout l'id avec les coordonnées au tableau $positions
			$positions[$i+1] = array($res[$i][1], $coords['x'], $coords['y']);
			$liens[$i] = array($id, $res[$i][1]);
		}

		return array('positions' => $positions, 'liens' => $liens);
	}


	//Calcul l'emplacement des points pour la version v1 (étoile)
	function coordonnesXY($angle , $distance){
		$coordonnees = array();
		$coordonnees ['x'] = round($distance * cos($angle), 4);
		$coordonnees ['y'] = round($distance * sin($angle), 4);
		return $coordonnees;
	}

	function quicksort( $arr, $l = 0 , $r = NULL ) {

		// when the call is recursive we need to change

		//the array passed to the function yearlier

		static $list = array();

		if( $r == NULL )

		$list = $arr;

		if( $r == NULL )

		$r = count($list)-1;//last element of the array

		$i = $l;

		$j = $r;

		$tmp = $list[(int)( ($l+$r)/2 )];

		// partion the array in two parts.

		// left from $tmp are with smaller values,

		// right from $tmp are with bigger ones

		do {
				
			while( $list[$i] < $tmp )
				
			$i++;
				

				
			while( $tmp < $list[$j] )
				
			$j--;

			// swap elements from the two sides
				
			if( $i <= $j ) {

				$w = $list[$i];

				$list[$i] = $list[$j];

				$list[$j] = $w;



				$i++;

				$j--;

			}

		}while( $i <= $j );



		// devide left side if it is longer the 1 element

		if( $l < $j )

		quicksort(NULL, $l, $j);

		// the same with the right side

		if( $i < $r )

		quicksort(NULL, $i, $r);

		// when all partitions have one element

		// the array is sorted



		return $list;

	}

}