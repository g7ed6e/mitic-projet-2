var canvas;
var ctx;
var divSVG;
var svgItems = [];
var translateX = 0;
var translateY = 0;

$(document)
.ready(
function() {

	$("#fg").click(function() {
		translateGraph(-75,0);
	});
	$("#fd").click(function() {
		translateGraph(75,0);
	});
	$("#fh").click(function() {
		translateGraph(0,-75);
	});
	$("#fb").click(function() {
		translateGraph(0,75);
	});
	
	/**
	 * Permet de détectecter un drag dans la zone de dessin et 
	 * envoi un evt de type dragGraph
	 */
	
	$("#zoneGraph").mousedown(function(evt){
		clicked = true;
		debut = {"x" : evt.clientX, "y" : evt.clientY};
	}).mouseup(function(){
		//draw();
		clicked = false;
	}).mousemove(function(evt){
		if(clicked) $("#zoneGraph").trigger('dragGraph', [{"x" : evt.clientX, "y" : evt.clientY}]);
	});

	/**
	 * Listener sur l'evt de type dragGraph
	 * permet de déplacer le graph en fonction de la souris
	 */
	$("#zoneGraph").bind('dragGraph', function(evt, param){
		translateGraph( (param.x - debut.x) , (param.y -debut.y) );
		debut = param;
	});
	
	/*
	 * $('#canvas').bind( 'swipe', function( e ) { graphCenter.x -=
	 * 150; draw(); e.stopImmediatePropagation(); return false; } );
	 * 
	 * 
	 * 
	 * $('#canvas').bind( 'swiperight', function( e ) {
	 * graphCenter.x += 150; draw();
	 * e.stopImmediatePropagation(); return false; } );
	 * 
	 * $('#canvas').bind( 'swipeup', function( e ) {
	 * graphCenter.y -= 150; draw();
	 * e.stopImmediatePropagation(); return false; } );
	 * $('#canvas').bind( 'swipedown', function( e ) {
	 * graphCenter.y += 150; draw();
	 * e.stopImmediatePropagation(); return false; } );
	 */

			
	canvas = $("#zoneGraph").get(0);
	//ctx = canvas.getContext('2d');
	resized();
	//$("#zoneGraph").width( $("#main").innerWidth() - $("#zoomDiv").innerWidth());
	//$("#zoneGraph").height( $("#main").innerHeight()-$("#zoneGraph").get(0).offsetTop-$("#footer").innerHeight()-10);
	
	//$('#divGraph').width($("#zoneGraph").width());
	//$('#divGraph').height($("#zoneGraph").height());
	$('#zoneGraph').svg({onLoad:
		function(svg) { 
			divSVG = svg; 
			var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
		} 
	});
});

function translateGraph(deltaX, deltaY){
	translateX+= deltaX;
	translateY+= deltaY;
	for( var i in svgItems ){
		$(svgItems[i]).attr("transform", "translate("+translateX+","+translateY+")");
	}
}
/*
function translateGraphAnimated(deltaX, deltaY){
	translateX+= deltaX;
	translateY+= deltaY;
	for( var i in svgItems ){
		$(svgItems[i]).animate(
			{svgTransform: "translate("+translateX+" "+translateY+")"},
			500);
	}
}*/
	

function clearGraph() {
	$('#zoneGraph').svg('destroy');
	$('#zoneGraph').svg({onLoad:
		function(svg) { 
			divSVG = svg; 
			var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
		} 
	});
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	//canvas.width = canvas.width;
	for( var i in svgItems ){
		//divSVG.remove(svgItems[i]); 
		svgItems.splice(i, 1); 
	}
}

function drawNode(node){
	
	img=new Image();
	img.src = "../Server/index.php?controller=image&action=getImg&id="
				+ node.id + "&t=" + (mignatureSize * zoom);
	jQuery(img).load(function() {
	
		node.width = img.width;
		node.height = img.height;
		console.log(node.center);
		console.log(zoom);
			
		var imgX = Math.round( (node.center.x * zoom) - (node.width/2) + graphCenter.x );
		var imgY = Math.round( (node.center.y * zoom) - (node.height/2) + graphCenter.y );
		var imgWidth = Math.round(img.width);
		var imgHeight = Math.round(img.height);
		var item = divSVG.image(imgX, imgY, imgWidth, imgHeight,"../Server/index.php?controller=image&action=getImg&id="+ node.id + "&t=" + (mignatureSize * zoom));
		svgItems[svgItems.length] = item;
		$(item).attr("transform", "translate("+translateX+","+translateY+")");
	});
}

function drawEdge(edge){
	
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	var x1 = Math.round(edge.source.center.x * zoom + graphCenter.x);
	var y1 = Math.round(edge.source.center.y * zoom + graphCenter.y);
	var x2 = Math.round(edge.target.center.x * zoom + graphCenter.x);
	var y2 = Math.round(edge.target.center.y * zoom + graphCenter.y);
	

	var g = divSVG.group({stroke: 'black', strokeWidth: 1}); 
	var item = divSVG.line(g, x1, y1, x2, y2); 
	svgItems[svgItems.length] = item;
	$(item).attr("transform", "translate("+translateX+","+translateY+")");
}

function resized(){
	$("#zoneGraph").css('width', $("#main").innerWidth() - $("#zoomDiv").innerWidth()+"px");
	$("#zoneGraph").css('height', $("#main").innerHeight()-$("#zoneGraph").get(0).offsetTop-$("#footer").innerHeight()-10+"px");
	graphDimension = {"width":$("#zoneGraph").width(), "height": $("#zoneGraph").height()};
	graphCenter = {"x":$("#zoneGraph").width() / 2, "y": $("#zoneGraph").height() / 2};
	$("#fg").css("left", 0).css("top", $("#zoneGraph").get(0).offsetTop + graphCenter.y-23+"px");
	$("#fd").css("left", $("#zoneGraph").width()-35).css("top", $("#zoneGraph").get(0).offsetTop + graphCenter.y-23 +"px");
	$("#fh").css("left", graphCenter.x-24).css("top", $("#zoneGraph").get(0).offsetTop);
	$("#fb").css("left", graphCenter.x-24).css("top", $("#zoneGraph").get(0).offsetTop + $("#zoneGraph").height() -35+"px");
}

function encode_as_img_and_link(){
/*
 // Add some critical information
 //$("zoneGraph").attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});

 var svg = $("#zoneGraph").html();
 var b64 = Base64.encode(svg);

 // Works in recent Webkit(Chrome)
 //$("graphSaver").html('data:image/svg+xml;base64,\n"+b64+"');

 // Works in Firefox 3.6 and Webit and possibly any browser which supports the data-uri
 //$("graphSaver").html('data:image/svg+xml;base64,\n"+b64+"');
	window.open('data:image/svg+xml;base64,\n"+b64+"');*/
}
