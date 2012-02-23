<?php
/*
 * 
 * 	Implémentation correspondant au premier contrat d'interface,
 *  A l'epoque, nous pensions que les valeurs du fichier etaient des distances alorq que c'etait en réalité des scores.
 *
 *  Affichage d'un graph étoilé
 * 
 * */


class VoisinsNModel {

	public function getAllDistances(){
		$res = array();
		$file = file_get_contents(ROOT_DATA_REPOSITORY.SEP."50.txt");
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

	private function voisinsN($id, $nn, $array)
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
		//tri croissant des longueurs
		asort($voisins_n);
		// extraction des $nn plus proches
		return array_slice($voisins_n, 0, $nn, true);
	}

	//Calcul l'emplacement des points pour la version v1 (�toile)
	private function coordonnesXY($angle , $distance){
		$coordonnees = array();
		$coordonnees ['x'] = round($distance * cos($angle), 4);
		$coordonnees ['y'] = round($distance * sin($angle), 4);
		return $coordonnees;
	}

	public function getVoisinsN($id,$nn,$w, $h){
		// lecture du fichier
		$array = $this->getAllDistances();
		//var_dump($array);
		// extraction des nn proches voisins
		$voisins_n = $this->voisinsN($id, $nn, $array); //recupererMin($id, $nn, $array);

		// on remet de l'aléatoire afin de ne pas afficher une spirale
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

		$i = 0;
		$max = 0;// va servir a calculer le ratio à appliquer en fonction de la resolution
		foreach($voisins_n as $key => $value)
		{
			$max = $value > $max ? $value : $max;
			// on calcule les coordonn�es pour un id donn�
			$coords = $this->coordonnesXY($i * $angle, $value);
			// on ajout l'id avec les coordonn�es au tableau $positions
			$positions[$i+1] = array($key, $coords['x'], $coords['y']);
			$liens[$i] = array(intval($id), $key);
			$i++;
		}

		// une fois le max trouvé on applique le ratio
		// en fonction de la resolution envoyée 
		$max_screen = (min($w, $h) / 2) - 20;
		$ratio = ($max_screen ) / $max;
		foreach($positions as $key => &$value)
		{		
			$value[1] *= ($ratio);
			$value[2] *= ($ratio);
		}

		return array('positions' => $positions, 'liens' => $liens);
	}
}
?>
