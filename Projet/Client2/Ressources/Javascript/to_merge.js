var hoveredImageId = -1;

$(document).ready(function(){
	canvas.addEventListener('mousemove', function(evt){
        var mousePos = getMousePos(canvas, evt);
        var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
        writeMessage(canvas, message);
        testImageHover(mousePos);
    }, false);
	
	$("#graphSaver").bind("click", function() { 
		// save canvas image as data url (png format by default)
	    $("#graphSaver").attr("href", canvas.toDataURL());
	});
	
});

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
				if(hoveredImageId == -1) {
					/*$(".popupImageDetails").animate({ opacity: 0}, 1000, function() {*/ 
						$(".popupImageDetails").remove(); 
					/*});*/ 
				}
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
	if(!found){ $(".popupImageDetails").remove(); }
	writeMessageHover(canvas, message);
}