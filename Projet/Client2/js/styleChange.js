function ok(){
	//moveTo("searchDiv",15,5,20);
	$('.index').animate({
		opacity: 0
	},500, function(){
		$('#searchDiv').animate({
			top: "-="+($('#searchDiv').offset().top-20)+""
		},500,function() {
			$('#changeMode').animate({
				opacity : 100
			},500,function() {
				$('#main').animate({
					opacity : 100
				},5000,function() {
				});
			});
		});
	});
}
