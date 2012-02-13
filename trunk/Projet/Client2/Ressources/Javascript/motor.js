function zoomChange(value){
	request($('#searchInput').val(),value);
}

function request(id, nbNeighbours){
	//http://localhost/projet/Server/index.php?controller=image&action=getSignifV1&id=1&nn=2
	$.getJSON('ajax/test.json', function(data) {
		//data = eval(data);
		//data.positions...
	});
}
