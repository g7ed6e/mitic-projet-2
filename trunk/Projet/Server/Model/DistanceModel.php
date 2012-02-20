<?php
class DistanceModel {
	
	private function getPlusProches($id, $n, $idx, $dis)
	{
		// elimination des 19 - $n non plus proches voisins
		$tmp = array();
		for($i = 1;$i < sizeof($idx);$i++)
		{
		$tmp[$idx[$i]] = round(sqrt(floatval($dis[$i])), 4);
		}
		// tri décroissant des distances
		arsort($tmp);
		// extraction des $n supérieurs
		$tmp = array_slice($tmp, 0, $n, true);
	}
	
	public function getDistances($id, $n, $nPlusUn, $w, $h){
		// les deux tableaux retournés
		$positions = array();
		$liens = array();
		$nb_liens = 0;
		
		$file_idx = file_get_contents(ROOT_DATA_REPOSITORY.SEP."graph_idx.txt");
		$lines_idx = explode("\n", $file_idx);
		$line_idx = trim($lines_idx[$id - 1]);
	
		$file_dis = file_get_contents(ROOT_DATA_REPOSITORY.SEP."graph_dis.txt");
		$lines_dis = explode("\n", $file_dis);
		$line_dis = trim($lines_dis[$id - 1]);
		
		// extraction des n plus proches voisins
		$idx = explode(" ", $line_idx);
		$dis = explode(" ", $line_dis);
		
		$voisins_rang_n = $this->getPlusProches($id, $n, $idx, $dis);
		foreach ($voisins_rang_n as $key => $value)
		{
			$liens[$nb_liens] = array(intval($id), $k);
			$nb_liens++;
		}
	}
}
?>