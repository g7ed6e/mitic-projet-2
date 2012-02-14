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

	public function getImage($id,$w,$l,$c){

		$file = ROOT_DATA_REPOSITORY."/img/".$id.".jpg";
		$file2= ROOT_DATA_REPOSITORY."/img/".$id."new.jpg";
		$size = getimagesize($file);

		if ( $size) {
			if($w==0||$l==0){
				if($c!=0){
					if ($size['mime']=='image/jpeg' ) {
						$img_big = imagecreatefromjpeg($file); # On ouvre l'image d'origine
						$img_new = imagecreate($size[0]*$c, $size[1]*$c);
						# création de la miniature
						$img_mini = imagecreatetruecolor($size[0]*$c, $size[1]*$c)
						or   $img_mini = imagecreate($size[0]*$c, $size[1]*$c);

						// copie de l'image, avec le redimensionnement.
						imagecopyresized($img_mini,$img_big,0,0,0,0,$size[0]*$c, $size[1]*$c,$size[0],$size[1]);
						//var_dump($img_mini);

						return $img_mini;
					}
					elseif ($size['mime']=='image/png' ) {
						$img_big = imagecreatefrompng($file); # On ouvre l'image d'origine
						$img_new = imagecreate($w, $l);
						# création de la miniature
						$img_mini = imagecreatetruecolor($w, $l)
						or   $img_mini = imagecreate($w, $l);

						// copie de l'image, avec le redimensionnement.
						imagecopyresized($img_mini,$img_big,0,0,0,0,$w,$l,$size[0],$size[1]);

						imagepng($img_mini,$file );

					}
					elseif ($size['mime']=='image/gif' ) {
						$img_big = imagecreatefromgif($file); # On ouvre l'image d'origine
						$img_new = imagecreate($w, $l);
						# création de la miniature
						$img_mini = imagecreatetruecolor($w, $l)
						or   $img_mini = imagecreate($w, $l);

						// copie de l'image, avec le redimensionnement.
						imagecopyresized($img_mini,$img_big,0,0,0,0,$w,$l,$size[0],$size[1]);

						imagegif($img_mini,$file );
					}
				}else{

					if ($size['mime']=='image/jpeg' ) {
						$img_big = imagecreatefromjpeg($file); # On ouvre l'image d'origine

						return $img_big;
					}
					elseif ($size['mime']=='image/png' ) {
						$img_big = imagecreatefrompng($file); # On ouvre l'image d'origine
						$img_new = imagecreate($w, $l);
						# création de la miniature
						$img_mini = imagecreatetruecolor($w, $l)
						or   $img_mini = imagecreate($w, $l);

						// copie de l'image, avec le redimensionnement.
						imagecopyresized($img_mini,$img_big,0,0,0,0,$w,$l,$size[0],$size[1]);

						imagepng($img_mini,$file );

					}
					elseif ($size['mime']=='image/gif' ) {
						$img_big = imagecreatefromgif($file); # On ouvre l'image d'origine
						$img_new = imagecreate($w, $l);
						# création de la miniature
						$img_mini = imagecreatetruecolor($w, $l)
						or   $img_mini = imagecreate($w, $l);

						// copie de l'image, avec le redimensionnement.
						imagecopyresized($img_mini,$img_big,0,0,0,0,$w,$l,$size[0],$size[1]);

						imagegif($img_mini,$file );
					}
				}
			}else{
				if ($size['mime']=='image/jpeg' ) {
					$img_big = imagecreatefromjpeg($file); # On ouvre l'image d'origine
					$img_new = imagecreate($w, $l);
					# création de la miniature
					$img_mini = imagecreatetruecolor($w, $l)
					or   $img_mini = imagecreate($w, $l);

					// copie de l'image, avec le redimensionnement.
					imagecopyresized($img_mini,$img_big,0,0,0,0,$w,$l,$size[0],$size[1]);
					//var_dump($img_mini);

					return $img_mini;
				}
				elseif ($size['mime']=='image/png' ) {
					$img_big = imagecreatefrompng($file); # On ouvre l'image d'origine
					$img_new = imagecreate($w, $l);
					# création de la miniature
					$img_mini = imagecreatetruecolor($w, $l)
					or   $img_mini = imagecreate($w, $l);

					// copie de l'image, avec le redimensionnement.
					imagecopyresized($img_mini,$img_big,0,0,0,0,$w,$l,$size[0],$size[1]);

					imagepng($img_mini,$file );

				}
				elseif ($size['mime']=='image/gif' ) {
					$img_big = imagecreatefromgif($file); # On ouvre l'image d'origine
					$img_new = imagecreate($w, $l);
					# création de la miniature
					$img_mini = imagecreatetruecolor($w, $l)
					or   $img_mini = imagecreate($w, $l);

					// copie de l'image, avec le redimensionnement.
					imagecopyresized($img_mini,$img_big,0,0,0,0,$w,$l,$size[0],$size[1]);

					imagegif($img_mini,$file );
				}
			}
		}

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


	public function getSignificativesDistancesV1($id,$nn){
		// dans $ res on un tableau: id | id | dist
		$array = $this->getAllDistance();
		$voisins_n = $this->recupererMin($id, $nn, $array);
		$res = $voisins_n;

		// on construit un tableau id | x | y
		// on place le premier point au centre (en 0, 0)
		$positions = array();
		$positions[0] = array($id, 0, 0);
		// l'angle entre chaque segment reliant un "plus proche voisin" � l'image de r�f�rence
		$angle = 2 * pi() / $nn;

		// on construit aussi un tableau contenant uniquement les associations d'image (I.E les liens)
		$liens = array();
		// on it�re sur les plus proches voisins filtr�s
		for ($i = 0; $i < $nn ; $i++)
		{
			// on calcule les coordonn�es pour un id donn�
			$coords = $this->coordonnesXY($i * $angle, $res[$i][2]);
			// on ajout l'id avec les coordonn�es au tableau $positions
			$positions[$i+1] = array($res[$i][1], $coords['x'], $coords['y']);
			$liens[$i] = array($id, $res[$i][1]);
		}

		return array('positions' => $positions, 'liens' => $liens);
	}

	public function getSignificativesDistancesV2($id,$n,$n_plus_1){
		// on lit tout le contenu du fichier (1225 lignes pour 50 points)
		$array = $this->getAllDistance();

		// on prend les $n plus proches voisins de $id
		$voisins_n = $this->voisins_n($id, $n, $array);

		$voisins_n = $this->recupererMin($id, $nn, $array);

		$res = $voisins_n;
		foreach ($voisins_n as $v)
		{
			$res = array_merge($res, $this->recupererMin($v[0] != $id ?$v[0]:$v[1], $nn, $array));
		}


		// distances par rapport � B
		// en fonction de la taille de array on d�duit le nb d'images diff�rentes
		// ici 1225 lignes -> 50 images
		$dist_b = array();
		$j = 0;
		$nb_images = (1 + sqrt(8 * sizeof($array) + 1) ) / 2;
		//var_dump($nb_images);

		for($i = $nb_images - 1; $i < (2*$nb_images - 2);  $i++)
		{
			// cas de la premiere ligne
			if($i == $nb_images - 1) $dist_b[$j] = array($id, $array[$j][2]);
			// cas des lignes d'index n � 2n-1
			var_dump($array[$i][1]);
			//else $dist_b[$j] = array($array[$i][1], $array[$i][2]);

			$j++;
		}
		var_dump($dist_b);
		//var_dump($dist_b);

		// on construit un tableau id | x | y
		// on place le premier point au centre (en 0, 0)
		$positions = array();
		$positions[0] = array($id, 0, 0);
		return null;

	}


	// calcul l'angle
	//	// alpha = acos ((b� - a� - c�)/-2ac)
	private function calculeAngle($a, $b, $c)
	{
		return acos( (pow($b,2) - pow($a, 2) - pow($c, 2)) / -2 * a*c  );
	}

	//Calcul l'emplacement des points pour la version v1 (�toile)
	private function coordonnesXY($angle , $distance){
		$coordonnees = array();
		$coordonnees ['x'] = round($distance * cos($angle), 4);
		$coordonnees ['y'] = round($distance * sin($angle), 4);
		return $coordonnees;
	}


	public function voisins_n($id, $nn)
	{
		// lecture du fichier
		$array = $this->getAllDistance();

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

	public function voisins_n_plus_1($id, $nn, $nn_plus_1)
	{
		// lecture du fichier
		$array = $this->getAllDistance();

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
}