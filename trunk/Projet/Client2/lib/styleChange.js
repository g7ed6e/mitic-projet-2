function init(){
	$("#searchInput").width($("#searchDiv").width() - 50);
}

function ok(){
	//moveTo("searchDiv",15,5,20);
	$('.index').animate({
		opacity: 0
	},500, function(){
		$('#searchDiv').animate({
			top: '-=280'
		},500,function() {
				$('#main').animate({
					opacity : 100
				},5000,function() {
			});
		});
	});
}
