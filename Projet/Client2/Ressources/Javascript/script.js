var min = 1;
var max = 49;
var midValue = Math.round((max-min)/2);
var currentSearch = '';
var hoveredImageId = -1;
var debugMousePos = true;

$(document).ready(function(){
	resized();
	$("#nbNeighboursInput").val(midValue);
	$("#slider").slider({
		max : max,
		min : min,
		value : midValue,
		step : 1,
		orientation : 'vertical',
		stop : function(event, ui){
			zoomChange(ui.value);

		},
		slide : function(event, ui){
			$("#nbNeighboursInput").val(ui.value);
		}
	});
	$("#topLabelSlider").html(max);
	$("#bottomLabelSlider").html(min);
	$("#btnOk").click(ok);
	
	$("#searchInput").focus(function(){
		currentSearch = $(this).val();
		$(this).val('');
	}).blur(function(){
	//	$(this).val(currentSearch);
	});
	
	
	$(canvas).mousemove(function(evt){
        var mousePos = getMousePos(canvas, evt);
        if(debugMousePos){
        	var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
        	writeMessage(canvas, message);
        }
        testImageHover(mousePos);
    });
	
	$("#graphSaver").click(function() { 
		// save canvas image as data url (png format by default)
	    $("#graphSaver").attr("href", canvas.toDataURL());
	});
	
	
});



function resized(){
	$("#searchInput").width($("#searchDiv").width() - 70);

}


function ok(){	
		$('.index').animate({
			opacity: 0
		},500, function(){
			$('#header').animate({
				top: '-=300'
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
			$('#chooser').animate({
				opacity : 0
			},1000,function() {});
			$('#chooser').animate({
				width : 0
			},100,function() {});
			$('#chooser').animate({
				height : 0
			},100,function() {});
			search();
		});
		$("#btnOk").unbind("click", ok);
		$("#btnOk").click(search);
		/*width : 0
				height : 0*/
}

function search(){
	request($('#searchInput').val(), $("#nbNeighboursInput").val());
}

function zoomChange(value){
	request($('#searchInput').val(),value);
}

function getMousePos(canvas, evt){
    // get canvas position
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj && obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
 
    // return relative mouse position
    var mouseX = evt.clientX - left + window.pageXOffset;
    var mouseY = evt.clientY - top + window.pageYOffset;
    return {
        x: mouseX,
        y: mouseY
    };
}

function writeMessage(canvas, message){
    ctx.clearRect(0, 0, 150, 30);
    ctx.font = '8pt Calibri';
    ctx.fillStyle = 'black';
    ctx.fillText(message, 10, 25);
}

function writeMessageHover(canvas, message){
    ctx.clearRect(0, 30, 150, 150);
    ctx.font = '8pt Calibri';
    ctx.fillStyle = 'black';
    ctx.fillText(message, 10, 145);
}

function testImageHover(mousePos)
{
	var message = '';
	var found = false;
	for (var i = 0;i < graph.nodes.length;i++)
	{
		var node = graph.nodes[i];
		if((mousePos.x > node.position.x)&&(mousePos.x < node.position2.x)
				&&(mousePos.y > node.position.y)&&(mousePos.y < node.position2.y)) {
			message = (node.id);
			if(node.id != hoveredImageId)
			{
				/*if(hoveredImageId == -1) {
					$(".popupImageDetails").animate({ opacity: 0}, 1000, function() {*/ 
						$(".popupImageDetails").remove(); 
					/*}); 
				}*/
				hoveredImageId = node.id;
				var img = new Image();
				img.src = '../Server/index.php?controller=image&action=getImg&id='+node.id+'&t=150';
				jQuery(img).load(function() {
					$(".popupImageDetails").css('width', img.width)
						.css('height', img.height);
						/*.animate({ opacity: 1 },1000, null);*/
				});
				$("#main").append("<div class='popupImageDetails'></div>");
		        $(".popupImageDetails").append(img);	
		        
			}
			$(".popupImageDetails").css('left', mousePos.x + 20)
				.css('top', mousePos.y + 20);
			found = true;
			break;
		}
	}
	if(!found){ $(".popupImageDetails").remove(); hoveredImageId = -1;  }
	writeMessageHover(canvas, message);
}
