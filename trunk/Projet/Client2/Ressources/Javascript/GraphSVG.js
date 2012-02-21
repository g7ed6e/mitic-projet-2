var canvas;
var ctx;
var divSVG;
var svgItems = [];

$(document)
.ready(
function() {

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
	
	//$('#divGraph').width($("#zoneGraph").width());
	//$('#divGraph').height($("#zoneGraph").height());
	$('#zoneGraph').svg({onLoad:
		function(svg) { 
			divSVG = svg; 
			var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
		} 
	});
});
	

function clearGraph() {
	$('#divGraph').svg('destroy');
	$('#divGraph').svg({onLoad:
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
	img.src="../Server/index.php?controller=image&action=getImg&id="+node.id+"&t=50";
	jQuery(img).load(function() {
	
		node.width = img.width;
		node.height = img.height;
		console.log(node.center);
		console.log(zoom);
			
		var imgX = Math.round( (node.center.x * zoom) - (node.width/2) + graphCenter.x );
		var imgY = Math.round( (node.center.y * zoom) - (node.height/2) + graphCenter.y );
		var imgWidth = Math.round(img.width);
		var imgHeight = Math.round(img.height);
		var item = divSVG.image(imgX, imgY, imgWidth, imgHeight,img.src);
		svgItems[svgItems.length] = item;
	});
}

function drawEdge(edge){
	
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	var x1 = Math.round(edge.source.center.x * zoom + graphCenter.x);
	var y1 = Math.round(edge.source.center.y * zoom + graphCenter.y);
	var x2 = Math.round(edge.target.center.x * zoom + graphCenter.x);
	var y2 = Math.round(edge.target.center.y * zoom + graphCenter.y);
	
			/*line.setAttribute("x1", );
			line.setAttribute("y1", Math.round(edge.source.center.y * zoom + graphCenter.y));
			line.setAttribute("x2", Math.round(edge.target.center.x * zoom + graphCenter.x));
			line.setAttribute("y2", Math.round(edge.target.center.y * zoom + graphCenter.y));*/
	
	//mySvg.appendChild(line);
	var g = divSVG.group({stroke: 'black', strokeWidth: 1}); 
	var item = divSVG.line(g, x1, y1, x2, y2); 
	svgItems[svgItems.length] = g;
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