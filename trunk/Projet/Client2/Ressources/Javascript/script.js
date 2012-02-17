var min = 1;
var max = 49;
var midValue = Math.round((max-min)/2);
var hoveredImageId = -1;
var debugMousePos = false;
var searchInputDefaultText = "Veuillez saisir un identifiant d'image";
var histoVisible = false;
var filterVisible = false;
var popupShown = false;
var clicked = false;
var debut;
var dragDeplacementDelta;
var compteur = 0;

$(document).ready(function(){
	resized();
	
	$("#canvas").mousedown(function(evt){
		clicked = true;
		debut = {"x" : evt.clientX, "y" : evt.clientY};
	}).mouseup(function(){
		draw();
		clicked = false;
	}).mousemove(function(evt){
		if(clicked) $("#canvas").trigger('dragCanvas', [{"x" : evt.clientX, "y" : evt.clientY}]);
	});
	
	$("#canvas").bind('dragCanvas', function(evt, param){
		compteur++;
		dragDeplacementDelta = {"x" : debut.x - param.x, "y" : debut.y - param.y};
		graphCenter.x -= dragDeplacementDelta.x;
		graphCenter.y -= dragDeplacementDelta.y;
		if(compteur  %2 == 0)draw();
		debut = param;
	});
	
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
	$("#searchInput").keypress(okKeypressedEnter).focus(function(){
		if($(this).val() == searchInputDefaultText)
		{
			$(this).val('').css('color', '#000000').css('font-style', 'normal');
		}
	}).blur(function(){
		if ($(this).val() == "")
		{
			$(this).attr('value', searchInputDefaultText).css('font-style', 'italic').css('color', '#aaa');
		}
	}).attr('value', searchInputDefaultText);
	
	
	$(canvas).mousemove(function(evt){
        var mousePos = getMousePos(canvas, evt);
        if(debugMousePos){
        	var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
        	if(debugMousePos) writeMessage(canvas, message);
        }
        //testImageHover(mousePos);
    }).mousedown(function(evt){
    	var mousePos = getMousePos(canvas, evt);
    	var nodeId = getImageId(mousePos);
    	if (nodeId != -1)
    	{
    		hoveredImageId = nodeId;
    	}
    }).mouseup(function(evt){
    	var mousePos = getMousePos(canvas, evt);
    	var nodeId = getImageId(mousePos); 
    	if ((nodeId != -1)&&(hoveredImageId == nodeId)&&(!popupShown))
    	{
    		var img = new Image();
			img.src = '../Server/index.php?controller=image&action=getImg&id='+nodeId+'&t=200';
			jQuery(img).load(function() {
				$(this).css('width', img.width).css('height', img.height).css('margin', '10'); 
			});
			$("#main").append("<div class='popupImageDetails'><p>Noeud :"+nodeId+"</p></div>");
	        $(".popupImageDetails").append(img);
	        positionnePopup(canvas, mousePos, nodeId);
    	}
    	else hoveredImageId = -1;
    });
	
	$('body').bind("onresize", resized);
	$("#graphSaver").click(function() { 
		// save canvas image as data url (png format by default)
	    $("#graphSaver").attr("href", canvas.toDataURL());
	});
	$("#zoomP").click(function(){		
		zoom += 0.5;
		draw();
	});
	$("#zoomM").click(function(){
		if(zoom != 1){
			zoom -= 0.5;
			draw();
		}
	});
});

function resized(){
	$("#searchInput").width($("#searchDiv").width() - 70);
}
function okKeypressedEnter(event){
	if ( event.which == 13 ) { ok(); }
}
function searchKeypressedEnter(event){
	if ( event.which == 13 ) { search(); }
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
				$('#bloc').animate({
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
			$('#radio').animate({
				opacity : 100
			},1000,function() {});
			search();
		});
		$("#btnOk").unbind("click", ok).click(search);
		$("#searchInput").unbind("keypress", okKeypressedEnter).keypress(searchKeypressedEnter);
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

/*function testImageHover(mousePos)
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
				$(".popupImageDetails").remove(); 
				hoveredImageId = node.id;
				var img = new Image();
				img.src = '../Server/index.php?controller=image&action=getImg&id='+node.id+'&t=150';
				jQuery(img).load(function() { $(".popupImageDetails").css('width', img.width).css('height', img.height); });
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
	if(debugMousePos)writeMessageHover(canvas, message);
}*/

function getImageId(mousePos)
{
	for (var i = 0;i < graph.nodes.length;i++)
	{
		var node = graph.nodes[i];
		if((mousePos.x > node.position.x)&&(mousePos.x < node.position2.x)
				&&(mousePos.y > node.position.y)&&(mousePos.y < node.position2.y)) {
			return node.id;
		}
	}
	return -1;
}

function show(id) {
	var d = document.getElementById(id);
	if(id == "smenu1"){
		var b = document.getElementById("l1");
		if (!histoVisible) {
			d.style.display='block';
			b.className='liste ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left ui-state-active'
			histoVisible = true;
		}else{
			d.style.display='none';
			b.className='liste ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left'
			histoVisible = false;
		}
	}else{
		var b = document.getElementById("l2");
		if (!filterVisible) {
			d.style.display='block';
			b.className='liste ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right ui-state-active'
			filterVisible = true;
		}else{
			d.style.display='none';
			b.className='liste ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right'
			filterVisible = false;
		}
	}
}
function positionnePopup(canvas, mousePos, nodeId)
{
	$(".popupImageDetails").css('top', mousePos.y + 20).css("left", mousePos.x + 20);
	popupShown = true;
}