function zoomChange(value){
	request($('#searchInput').val(),value);
}

function request(id, nbNeighbours){
	$.getJSON('http://localhost/projet/Server/index.php?controller=image&action=getSignifV1&id='+id+'&nn='+nbNeighbours+'', function(data) {
		//alert('reponse serveur = '+data);
		//afficheGraph(data);//not yet implemented
	});

}
