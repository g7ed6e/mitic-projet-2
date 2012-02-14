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

	//Calcul l'emplacement des points pour la version v1 (ï¿½toile)
	private function coordonnesXY($angle , $distance){
		$coordonnees = array();
		$coordonnees ['x'] = round($distance * cos($angle), 4);
		$coordonnees ['y'] = round($distance * sin($angle), 4);
		return $coordonnees;
	}

	public function getVoisinsNPlusUn($id,$nn,$nPlusUn){
		// lecture du fichier
		$array = $this->getAllDistances();

		// extraction des nn proches voisins de $id
		$voisins_id = $this->voisinsN($id, $nn, $array);

		
		
		// on place le premier point au centre (en 0, 0)
		$positions = array();
		$positions[0] = array(intval($id), 0, 0);
		// l'angle entre chaque segment reliant un "plus proche voisin" ï¿½ l'image de rï¿½fï¿½rence
		$angle = 2 * pi() / $nn;

		// on construit aussi un tableau contenant uniquement les associations d'image (I.E les liens)
		$liens = array();
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
		
		// maintenant, on va extraire toutes les positions des points par rapport
		// a un deuxieme point de référence pour utiliser le theoreme de Al-Kachi
 		$deuxieme_point_de_ref = $positions[1][0];
 		
 		
 		$voisins_deuxieme_point_de_ref = array();
		$i = 0;
		foreach($positions as $p)
		{
			if(($p[0] != $id)&&($p[0] != $deuxieme_point_de_ref))
			{
				foreach($array as $a)
				{
					if( (($a[0] == $deuxieme_point_de_ref)&&($a[1] == $p[0]))
					 || (($a[1] == $deuxieme_point_de_ref)&&($a[0] == $p[0])))
					{
						$voisins_deuxieme_point_de_ref[$p[0]] = $a[2];
						$i++;				
						break;
					}					
				}
			}
		}
		
		var_dump($voisins_id);
		var_dump($voisins_deuxieme_point_de_ref);
		// on remet de l'aléatoire afin de ne pas afficher une spirale
// 		usort($positions, function($a, $b)
// 		{
// 			return .01 * rand(0, 100) >= .5;
// 		});

		return array('positions' => $positions, 'liens' => $liens);
	}
}
