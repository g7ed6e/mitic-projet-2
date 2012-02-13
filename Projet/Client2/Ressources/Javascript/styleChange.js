function init(){
	resized();
	var min = 1;
	var max = 20;
	$("#slider").slider({
		max : max,
		min : min,
		value : (max-min)/2,
		step : 1,
		orientation : 'vertical',
		slide : function(event, ui){
			zoomChange(ui.value);
		}
	});
	$("#topLabelSlider").html(max);
	$("#bottomLabelSlider").html(min);
}

function resized(){
	$("#searchInput").width($("#searchDiv").width() - 70);
}

function ok(){
	if($('#searchDiv').position().top > 20){
		$('.index').animate({
			opacity: 0
		},500, function(){
			$('#searchDiv').animate({
				top: '-=280'
			},500,function() {
					$('#zoomSlider').animate({
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
}

function clickInputSearch(){
	var currentVal = $('#searchInput').val();
	if( currentVal == "Veuillez saisir votre recherche" ){ $("#searchInput").val(""); }
}
