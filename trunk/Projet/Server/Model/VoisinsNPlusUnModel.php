<?php
class VoisinsNPlusUnModel implements Model{

	private function getAllDistances(){
		$res = array();
		$file = file_get_contents(ROOT_DATA_REPOSITORY.SEP."50.txt");
		$distances = explode("\n", $file);

		foreach ($distances as $distance){
			$distance = trim($distance);
			if(!empty($distance)) $res[] = explode(" ", $distance);
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

	public function getVoisinsNPlusUn($id,$nn,$nPlusUn){
		// lecture du fichier
		$array = $this->getAllDistances();

		// extraction des $nn proches voisins de $id ainsi que leurs distance par rapoort à $id
		$voisins_id = $this->voisinsN($id, $nn, $array);
		var_dump($voisins_id);

		// on construit aussi un tableau contenant uniquement les associations d'image (I.E les liens qui seront affichés)
		$liens = array();
		$nb_liens = 0;
		// création des liens de rang n
		foreach($voisins_id as $k => $v)
		{
			$liens[$nb_liens] = array(intval($id), $k);
			$nb_liens++;
		}

		// extraction des $nPlusUn plus proches voisins des $nn plus proches voisins de $id
		$tmp = array();
		foreach(array_keys($voisins_id) as $key)
		{
			$voisinsNPlusUnKeys = array_keys($this->voisinsN($key, $nPlusUn, $array));
			// maintenant on va chercher la distance de ces points par rapport à $id
			foreach($voisinsNPlusUnKeys as $vNPlusUnKey)
			{
				if($vNPlusUnKey != $id)
				{
					foreach ($array as $a)
					{
						if( (($a[0] == $id)&&($a[1] == $vNPlusUnKey))
						|| (($a[0] == $vNPlusUnKey)&&($a[1] == $id)))
						{
							$tmp[$vNPlusUnKey] = $a[2];
							$liens[$nb_liens] = array(intval($key), $vNPlusUnKey);
							$nb_liens++;
							break;
						}
					}
				}
			}
		}

		var_dump($liens);
		
		// fusion avec le tableau des voisins de premier niveau
		foreach ($tmp as $key => $value)
		{
			$voisins_id[$key] = $value;
		}
		// on a maintenant dans $voisins_id toutes les images a afficher
		// ainsi que leurs distances par rapport a l'image de référence
		var_dump($voisins_id);

		// maintenant, on va extraire les distances des points par rapport
		// a un deuxieme point de référence pour pouvoir ensuite utiliser le theoreme d'Al-Kachi
		// ici, le deuxieme point de référence est le plus proche voisin de $id (perte en precision a vérifier..)
		$deuxieme_point_de_ref = array_shift(array_keys($voisins_id));// extract the first key from $voisins_id
		var_dump($deuxieme_point_de_ref);
			
		$voisins_deuxieme_point_de_ref = array();
		foreach(array_keys($voisins_id) as $key)
		{
			if($key != $deuxieme_point_de_ref)
			{
				foreach($array as $a)
				{
					if( (($a[0] == $deuxieme_point_de_ref)&&($a[1] == $key))
					|| (($a[1] == $deuxieme_point_de_ref)&&($a[0] == $key)))
					{
						$voisins_deuxieme_point_de_ref[$key] = $a[2];
						break;
					}
				}
			}
		}

		var_dump($voisins_deuxieme_point_de_ref);

		// Calcul des positions grace a theoreme d'Al-Kachi
		$positions = array();


		// on place le premier point au centre (en 0, 0)
		$positions[0] = array(intval($id), 0, 0);
		// on place le deuxieme point sur l'axe des abcisses
		$positions[1] = array($deuxieme_point_de_ref, array_shift(array_values($voisins_id)), 0);


		return null;

		// on itère sur les plus proches voisins filtrés
		$i = 0;
		foreach($voisins_id as $key => $value)
		{
			// on calcule les coordonnï¿½es pour un id donnï¿½
			$coords = $this->coordonnesXY($i * $angle, $value);
			// on ajout l'id avec les coordonnï¿½es au tableau $positions
			$positions[$i+1] = array($key, $coords['x'], $coords['y']);
			$liens[$i] = array(intval($id), $key);
			$i++;
		}



		//		var_dump($positions);



		var_dump($voisins_id);
		var_dump($deuxieme_point_de_ref);
		var_dump($voisins_deuxieme_point_de_ref);
		// on remet de l'aléatoire afin de ne pas afficher une spirale
		// 		usort($positions, function($a, $b)
		// 		{
		// 			return .01 * rand(0, 100) >= .5;
		// 		});

		return array('positions' => $positions, 'liens' => $liens);
	}

	// calcul l'angle d'un nouveau point en fonction de sa distance par rapport a $id et $deuxieme_point_de_ref (noté A et B)
	//	// alpha = acos ((bï¿½ - aï¿½ - cï¿½)/-2ac)
	private function calculeAngle($a, $b, $c)
	{
		return acos( (pow($b,2) - pow($a, 2) - pow($c, 2)) / -2 * a*c  );
	}


}
