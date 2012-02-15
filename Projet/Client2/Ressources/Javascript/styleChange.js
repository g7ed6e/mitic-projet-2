var min = 1;
var max = 49;
var midValue = Math.round((max-min)/2);

function init(){
	resized();
	$("#nbNeighboursInput").val(midValue);
	$("#slider").slider({
		max : max,
		min : min,
		value : midValue,
		step : 1,
		orientation : 'vertical',
		stop : function(event, ui){
			$("#nbNeighboursInput").val(ui.value);
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
				
				$('#main').animate({
					opacity : 100
				},5000,function() {});
				
				$('#nbNeighbours').animate({
					opacity : 100
				},500,function() {});
				
				$('#zoomSlider').animate({
					opacity : 100
				},500,function() {});
			});
		});
	
	}
	request($('#searchInput').val(), $("#nbNeighboursInput").val());

}

function clickInputSearch(){
	var currentVal = $('#searchInput').val();
	if( currentVal == "Identifiant de l'image" ){ $("#searchInput").val(""); }
}
