<?php
class DistanceModel {

	private function getPlusProches($id, $n, &$mat, &$distances)
	{

		/*
		//var_dump($mat[$id - 1]);
		$distanceSquareMax = max($mat[$id - 1]);
		// tri croissant des distances;
		$distances = array();
		for($i = 0;$i<sizeof($mat[$id]);$i++){
			if(($i+1) == $id) continue;
			//if($i == $id)continue;
			$distances[$i+1] = $mat[$id-1][$i];
		}
		asort($distances);
		// extraction des $n + 1 supérieurs
		$distances = array_slice($distances, 0, $n, true);
		return $distances;*/
		
// 		echo("1 -> 967 = " .$this->accesMemoireMatrix(1, 967, $mat));
// 		echo("967 -> 1 = " .$this->accesMemoireMatrix(967, 1, $mat));
		
		//$distances = array(); //[950] = 12, [765] = 24

		//echo("967 -> 525 = " .$this->accesMemoireMatrix(967, 525, $mat));		
		
		for($i = 1;$i < sizeof($mat[0])+1;$i++){
			if($i == $id)continue;
			$distances[$i] = $this->accesMemoireMatrix($i, $id, $mat); 
			//echo("distances[".$i."]=".$distances[$i]."<br />");
		}
		
		
		
		
// 		echo("distances_ ");
// 		var_dump($distances_);
		asort($distances);
		
		$distances = array_slice($distances, 0, $n, true);
		
		//var_dump($distances); //([966]= )
		
		return;// $distances;
	}

	private function appliqueRatioTailleEcran(&$positions, $w, $h)
	{
		// ratio en fonction de la resolution envoyée
		$ratio = (min($w, $h) / 2);
		foreach($positions as $key => &$value)
		{
			$value[1] *= ($ratio);
			$value[2] *= ($ratio);
		}
	}
/*
	//Calcul l'emplacement des points dans un plan
	private function coordonnesXY($angle , $distance){
		$coordonnees = array();
		$coordonnees ['x'] = round($distance * cos($angle), 4);
		$coordonnees ['y'] = round($distance * sin($angle), 4);
		return $coordonnees;
	}


	// calcul l'angle d'un nouveau point en fonction de sa distance par rapport a $id et $deuxieme_point_de_ref (not� A et B)
	//	// alpha = acos ((b² - a² - c²)/-2ac)
	private function calculeAngle($a, $b, $c, $d, $e, $f)
	{
		if((-2*$a*$c) == 0)var_dump("a=" . $a . " b=" . $b . " c=" . $c . " id=" . $d." 2eme=".$e." p=".$f);
		$t = round( ($b*$b - $a*$a - $c*$c) / (-2*$a*$c), 4) ;
		return acos($t);
	}


	public function getDistances($id, $n, $w, $h){

//return phpinfo();//apc_cache_info();
		// 		if(apc_exists("foo"))
		// 		{
		// 			var_dump("exists");
		// 			$foo = apc_fetch("foo");
		// 		}
		// 		else
		// 		{
		// 			var_dump("exists pas");
		// 			apc_store("foo", "test");
		// 		}

		// 		return;
		// les deux tableaux retournés
		
		
		$positions = array();
		$liens = array();
		
		//return phpinfo();

		if(apc_exists("matrix")) {
			var_dump("exists");
			$matrix = apc_fetch("matrix");
		}
		else {
			$matrix = array();
			var_dump("exists pas");
			// parsage fichier
			$file_out = file_get_contents(ROOT_DATA_REPOSITORY.SEP."new".SEP."out.txt");
			$lines = explode("\n", $file_out);
			array_pop($lines);

			for($i = 0;$i<sizeof($lines);$i++){
				$line = explode(" ", trim($lines[$i]));

			//	if(sizeof($lines) != 1491) var_dump(sizeof($lines));
				for($j = 0;$j < sizeof($line);$j++){
					$matrix[$i] = $line;
				}
			}
			for($i = 0;$i < sizeof($lines);$i++){
				for($j = 0;$j < sizeof($lines);$j++){
					$matrix[$i][$j] = sqrt($matrix[$i][$j]);
				}
			}

			if (apc_store("matrix", $matrix)) var_dump("success");
			else var_dump('failure');
		}

			

		//
		$tousLesPoints = array();



		// recherche des n plus proches voisins

		$voisins_rang_n = $this->getPlusProches($id, $n, $matrix);

		//var_dump($voisins_rang_n);

		$keys = array_keys($voisins_rang_n);
		$deuxieme_point_de_ref = $keys[sizeof($keys)-1];


		//

		// 		var_dump($matrix[0][966]);
		// 		var_dump($matrix[0][965]);
		// 		var_dump($matrix[966][0]);
		// 		var_dump($matrix[965][0]);
		// on remplit les distances par rapport à id et deuxieme point de ref

		foreach ($voisins_rang_n as $voisinId => $distance)
		{
			array_push($tousLesPoints, $voisinId);
			// 			$distancesParRapportAId[$voisinId] = $distance;
			// 			$distancesParRapportADeuxiemePointDeRef[$voisinId] = $matrix[$voisinId-1][$deuxieme_point_de_ref-1];

			$voisins_rang_n_plus_un =  $this->getPlusProches($voisinId, $n, $matrix);
			foreach($voisins_rang_n_plus_un as $voisin_rang_n_plus_deux => $distanceToVoisinRangNPlusUn){
				array_push($tousLesPoints, $voisin_rang_n_plus_deux );
				// 				$distancesParRapportAId[$voisin_rang_n_plus_deux] = $matrix[$id-1][$voisinId-1];
				// 				$distancesParRapportADeuxiemePointDeRef[$voisin_rang_n_plus_deux] = $matrix[$voisinId-1][$deuxieme_point_de_ref-1];
			}
		}

		$tousLesPoints = array_unique(array_values($tousLesPoints));
		//var_dump($tousLesPoints);


		// on place le premier point au centre (en 0, 0)
		$positions[0] = array(intval($id), 0, 0, 0);
		// on place le deuxieme point sur l'axe des abcisses
		$positions[1] = array($deuxieme_point_de_ref, $matrix[$id-1][$deuxieme_point_de_ref-1], 0, 0);// distancesParRapportAId[$deuxieme_point_de_ref], 0);
		$index = 2;


		foreach(array_values($tousLesPoints) as $pointId){

			if(($pointId == $id)||($pointId == $deuxieme_point_de_ref))continue;

			$a = $matrix[$id-1][$deuxieme_point_de_ref-1];// $distancesParRapportAId[$deuxieme_point_de_ref];
			$b = $matrix[$deuxieme_point_de_ref-1][$pointId];// $distancesParRapportADeuxiemePointDeRef[$pointId];
			$c = $matrix[$id-1][$pointId]; //$distancesParRapportAId[$pointId];
			$angle = $this->calculeAngle($a, $b, $c, $id, $deuxieme_point_de_ref, $pointId);
			$coords = $this->coordonnesXY($angle, $c);
			$positions[$index] = array($pointId, $coords['x'], $coords['y'], 0);
			$index++;
		}

		$this->appliqueRatioTailleEcran($positions, $w, $h);

		for($i = 0;$i< sizeof($positions);$i++){
			for($j = 0;$j< sizeof($positions);$j++){
				if($i >= $j)continue;
				array_push($liens, array($positions[$i][0], $positions[$j][0], 0));
			}
		}

		return array('positions' => $positions, 'liens' => $liens);
	}*/
	
	function distance ($x1, $y1 , $x2 , $y2){
		return sqrt( pow($x1 - $x2, 2) + pow($y1 - $y2, 2) );
	}
	
	function coordonneesXY ($a, $b, $c, $d , $xd , $yd , $precision){
		$coordonnees = array();
		$delta = ($b*$b - $a*$a - $c*$c) / (-2*$a*$c);
		$angle = acos( max(min(1,$delta),-1) );
		$coordonnees ['x'] = round($c * cos($angle), 4);
		$coordonnees ['y'] = round($c * sin($angle), 4);
		$distanceTemp =  $this->distance($coordonnees ['x'] ,$coordonnees ['y'] , $xd, $yd);
	
		if ( abs($distanceTemp - $d) >= pow(10, 1-$precision) ){
			$coordonnees ['y'] = -1 * $coordonnees ['y'];
		}
		return $coordonnees;
	}
	
	function accesMemoireMatrix ($i,$j,&$matrix){
		if($i == $j){
			return 0;
		}
		else{
			$m = min($i,$j) - 1;
			$n = (max($i, $j) - min($i, $j)) -1 ;//sizeof($matrix[0]) + 1 - max($i-1,$j-1);
			return sqrt($matrix[$m][$n]); 
			//return sqrt($matrix[min($i-1,$j-1)][max($i-1,$j-1)]);
		}
	}
	
	public function getDistancesV2($id, $n, $w, $h){
	
		
		
		$positions = array();
		$liens = array();
	
// 		if(apc_exists("matrix")) {
// 			$matrix = apc_fetch("matrix");
// 		}
// 		else {
			$matrix = array();
			
			// parsage fichier
			$file_out = file_get_contents(ROOT_DATA_REPOSITORY.SEP."new".SEP."1491n.txt");
			$lines = explode("\n", $file_out);
			array_pop($lines);
	
			// création 
			for($i = 0;$i<sizeof($lines);$i++){
				$line = explode(" ", trim($lines[$i]));
				$matrix[$i] = $line;
				//	if(sizeof($lines) != 1491) var_dump(sizeof($lines));
				//for($j = 0;$j < sizeof($line);$j++){
					
				//}
			}
// 			echo("1->2=" . $this->accesMemoireMatrix(1, 2, $matrix));
// 			echo("\n");
// 			echo("2->1=" . $this->accesMemoireMatrix(2, 1, $matrix));
// 			return;
// 			$iii = sizeof($lines);
// 			for($i = 0;$i < $iii;$i++){
// 				for($j = 0;$j < $iii;$j++){
// 					$matrix[$i][$j] = sqrt($matrix[$i][$j]);
// 				}
// 				$iii--;
// 			}
			unset($lines);
			unset($file_out);
// 			apc_store("matrix", $matrix);
// 		}
	

		//
		$tousLesPoints = array();
		// recherche des n plus proches voisins
		//$this->getPlusProches(967, 1, $matrix);
		
		//$voisins_rang_n = $this->getPlusProches($id, $n, $matrix);
		$this->getPlusProches($id, $n, $matrix, $voisins_rang_n);
		
		
		//var_dump($voisins_rang_n);
	//	echo("voisins rang n = ");
//		var_dump($voisins_rang_n);
		$keys = array_keys($voisins_rang_n);
		
		$deuxieme_point_de_ref = $keys[sizeof($keys)-1];
		$troisieme_poin_de_ref = $keys[sizeof($keys)-2];
		
		// on remplit les distances par rapport à id et deuxieme point de ref	
		foreach ($voisins_rang_n as $voisinId => $distance)
		{
			array_push($tousLesPoints, $voisinId);
		//	echo("voisinId=" .$voisinId . "");
			$voisins_rang_n_plus_un = array();
			//$voisins_rang_n_plus_un =  
			$this->getPlusProches($voisinId, $n, $matrix, $voisins_rang_n_plus_un);
			foreach($voisins_rang_n_plus_un as $voisin_rang_n_plus_deux => $distanceToVoisinRangNPlusUn){
				array_push($tousLesPoints, $voisin_rang_n_plus_deux );
			}
			unset($voisins_rang_n_plus_un);
		}
		
		unset($voisins_rang_n);
	
		$tousLesPoints = array_unique(array_values($tousLesPoints));
		// on place le premier point au centre (en 0, 0)
		$positions[0] = array(intval($id), 0, 0, 0);
		// on place le deuxieme point sur l'axe des abcisses
		$positions[1] = array($deuxieme_point_de_ref, $this->accesMemoireMatrix($id,$deuxieme_point_de_ref, $matrix), 0, 0);// distancesParRapportAId[$deuxieme_point_de_ref], 0);
		
		$a = $this->accesMemoireMatrix($id,$deuxieme_point_de_ref, $matrix);
		$b = $this->accesMemoireMatrix($deuxieme_point_de_ref,$troisieme_poin_de_ref, $matrix);
		$c = $this->accesMemoireMatrix($id,$troisieme_poin_de_ref, $matrix);
		
		$coordsJuge = $this->coordonneesXY($a, $b, $c, $c, 0, 0, 5);
		$positions[2] = array($troisieme_poin_de_ref, $coordsJuge['x'], $coordsJuge['y'], 0);
		
		$xd = $coordsJuge['x'];
		$yd = $coordsJuge['y'];
		
		//var_dump($tousLesPoints);
		
		$index = 3;
		foreach(array_values($tousLesPoints) as $pointId){
	
			if(($pointId == $id)||($pointId == $deuxieme_point_de_ref)||($pointId == $troisieme_poin_de_ref))continue;
	
			// $distancesParRapportAId[$deuxieme_point_de_ref];
			$b = $this->accesMemoireMatrix($deuxieme_point_de_ref,$pointId, $matrix);// $distancesParRapportADeuxiemePointDeRef[$pointId];
			$c = $this->accesMemoireMatrix($id,$pointId, $matrix); //$distancesParRapportAId[$pointId];
			$d = $this->accesMemoireMatrix($troisieme_poin_de_ref,$pointId, $matrix);
			
			//$angle = $this->calculeAngle($a, $b, $c, $id, $deuxieme_point_de_ref, $pointId);
			$coords = $this->coordonneesXY($a, $b, $c, $d, $xd, $yd, 5);
			$positions[$index] = array($pointId, $coords['x'], $coords['y'], 0);
			$index++;
		}
	
		$this->appliqueRatioTailleEcran($positions, $w, $h);
	
		for($i = 0;$i< sizeof($positions);$i++){
			for($j = 0;$j< sizeof($positions);$j++){
				if($i >= $j)continue;
				array_push($liens, array($positions[$i][0], $positions[$j][0], 0));
			}
		}
	
		return array('positions' => $positions, 'liens' => $liens);
	}
}
?>