<?php
class ScoreModel {

	public function getAllDistances(){
		$res = array();
		$file = file_get_contents(ROOT_DATA_REPOSITORY.SEP."50bis.txt");
		$distances = explode("\n", $file);
		
		foreach ($distances as $distance){
			$distance = trim($distance);
			if(!empty($distance)) 
			{
				$res[] = explode(" ", $distance);
			}
		}
		return $res;
	}
	
	private function calculeScore($d_square, $max)
	{
		return ($max - $d_square) / $max;//score = (2 - d²)/2
	}
	
	public function getScoreV2($id, $n, $w, $h, $spyrale){
		// les deux tableaux retournés
		$positions = array();
		$positions[0] = array(intval($id), 0, 0);
		// l'angle entre chaque segment reliant un "plus proche voisin" � l'image de r�f�rence
		$angle = 2 * pi() / $n;
		$liens = array();
		
		// parsage fichier
		$array = array();
		
		$file_idx = file_get_contents(ROOT_DATA_REPOSITORY.SEP."graph_idx.txt");
		$lines_idx = explode("\n", $file_idx);
		$line_idx = trim($lines_idx[$id - 1]);
		
		$file_dis = file_get_contents(ROOT_DATA_REPOSITORY.SEP."graph_dis.txt");
		$lines_dis = explode("\n", $file_dis);
		$line_dis = trim($lines_dis[$id - 1]);
		
		$idx = explode(" ", $line_idx);
		$dis = explode(" ", $line_dis);

		// calcul des scores sur la ligne
		$tmp = array();
		$_max = max($dis);
		for($i = 1;$i< sizeof($idx);$i++)
		{
			$tmp[$idx[$i]] = $this->calculeScore(round(floatval($dis[$i]), 4), $_max);
		}
		
		// tri décroissant des distances au carré (c'est proportionnel au score a priori, sinon ce tri tri devra etre déplacé apres le calcul du score)
		arsort($tmp);
		// extraction des $n supérieurs
		$tmp = array_slice($tmp, 0, $n, true);

		//var_dump($tmp);
		
 		if(!$spyrale)
 		{
 			// on remet de l'al�atoire afin de ne pas afficher une spirale
 			uksort($tmp, function($a, $b)
 			{
 				return .01 * rand(0, 100) >= .5;
 			});
 		}
		
 		//var_dump($tmp);
 		
		// construction d'un tableau contenant le plus proches voisins		
		$voisins_n = array();
		$min = 1;$max = 0;
		$i = 0;
		foreach($tmp as $iid => $score)// id image -> distance au carré
		{
//			$score = $this->calculeScore($dsqr);// score
			$distance = 1 - $score;
			$voisins_n[intval($iid)] = $distance;// on transforme un score de 1 en distance (à l'ecran) 0 et score 0 en distance 1
			$min = $distance < $min ? $distance : $min;// on récupére les dist min et max
			$max = $distance > $max ? $distance : $max;
			$liens[$i] = array(intval($id), intval($iid), round($score, 2));// on ajoute le lien
			$i++;
		}
		// début
// 		for($i = 1;$i < sizeof($idx);$i++)
// 		{
// 			$d_square = round(floatval($dis[$i]), 4);// distance au carré
// 			$score = $this->calculeScore($d_square);// score
// 			$distance = 1 - $score; 
// 			$voisins_n[$idx[$i]] = $distance;// on transforme un score de 1 en distance (à l'ecran) 0 et score 0 en distance 1
// 			$min = $distance < $min ? $distance : $min;// on récupére les dist min et max
// 			$max = $distance > $max ? $distance : $max;
// 			$liens[$i-1] = array(intval($id), intval($idx[$i]));// on ajoute le lien
// 		}

		// fin
		
	
		
		$ref_dist = $max - $min;
		foreach($voisins_n as $key => &$value)
		{
			$value = (($value - $min) / $ref_dist);
			$value += (0.25 * (1 - $value));// pour repousser la premiere image qui vient se mettre sur l'iumage de référence
		}
		
		//var_dump($voisins_n);
		
		$i = 0;
		foreach($voisins_n as $key => $value)
		{
			// on calcule les coordonn�es pour un id donné
			$coords = $this->coordonnesXY($i * $angle, $value);  
			// on ajout l'id avec les coordonn�es au tableau $positions
			$positions[$i+1] = array($key, $coords['x'], $coords['y']);
			//$liens[$i] = array(intval($id), $key);
			$i++;
		}

		$this->appliqueRatioTailleEcran($positions, $w, $h);

		return array('positions' => $positions, 'liens' => $liens);
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

	private function voisinsFichierPlatV1($id, $nn, $array)
	{
		// extraction des voisins de $id
		$voisins_n = array();
		foreach($array as $value)
		{
			if ($value[0] == $id){
				$voisins_n[$value[1]] = $value[2];
			} else if ($value[1] == $id){
				$voisins_n[$value[0]] = $value[2];
			}
		}
		//tri décroissant des score
		arsort($voisins_n);
		// extraction des $nn supérieurs
		return array_slice($voisins_n, 0, $nn, true);
	}

	//Calcul l'emplacement des points pour la version v1 (�toile)
	private function coordonnesXY($angle , $distance){
		$coordonnees = array();
		$coordonnees ['x'] = round($distance * cos($angle), 4);
		$coordonnees ['y'] = round($distance * sin($angle), 4);
		return $coordonnees;
	}

	public function getScoreV1($id,$nn,$w, $h){
		// lecture du fichier
		$array = $this->getAllDistances();
		//var_dump($array);
		// extraction des nn proches voisins
		$voisins_n = $this->voisinsFichierPlatV1($id, $nn, $array); //recupererMin($id, $nn, $array);

		// on remet de l'al�atoire afin de ne pas afficher une spirale
		uksort($voisins_n, function($a, $b)
		{
			return .01 * rand(0, 100) >= .5;
		});

		// on place le premier point au centre (en 0, 0)
		$positions = array();
		$positions[0] = array(intval($id), 0, 0);
		// l'angle entre chaque segment reliant un "plus proche voisin" � l'image de r�f�rence
		$angle = 2 * pi() / $nn;

		// on construit aussi un tableau contenant uniquement les associations d'image (I.E les liens)
		$liens = array();
		// on itère sur les plus proches voisins filtrés

		$max = 0;// va servir a calculer le ratio à appliquer en fonction de la resolution
		$min = 1;
		foreach($voisins_n as $key => &$value)
		{
			$value = 1 - $value; // on transforme un score de 1 en distance 0 
			// et score 0 en distance 1
			$max = $value > $max ? $value : $max;
			$min = $value < $min ? $value : $min;
		}
		
		//var_dump($voisins_n);
		
		$ref_dist = $max - $min;		
		//var_dump($ref_dist);
		foreach($voisins_n as $key => &$value)
		{
//			var_dump($value);
			$value = (($value - $min) / $ref_dist);
			$value += (0.15 * (1 - $value));// pour repousser lapremiere image qui vient se mettre sur l'iumage de référence
		}
		
		//var_dump($voisins_n);
		
		$i = 0;
		foreach($voisins_n as $key => $value)
		{
			// on calcule les coordonn�es pour un id donn�
			$coords = $this->coordonnesXY($i * $angle, $value);//   
			// on ajout l'id avec les coordonn�es au tableau $positions
			$positions[$i+1] = array($key, $coords['x'], $coords['y']);
			$liens[$i] = array(intval($id), $key);
			$i++;
		}

		$this->appliqueRatioTailleEcran($positions, $w, $h);
		
		return array('positions' => $positions, 'liens' => $liens);
	}
}
?>