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
	ctx = canvas.getContext('2d');
	resized();
	
	$('#divGraph').width($("#zoneGraph").width());
	$('#divGraph').height($("#zoneGraph").height());
	$('#divGraph').svg({onLoad:
		function(svg) { 
			divSVG = svg; 
			var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
		} 
	});

	$(canvas)
		.mousemove(
				function(evt) {
					var mousePos = getMousePos(canvas, evt);
					if (debugMousePos) {
						var message = "Mouse position: "
								+ mousePos.x + ","
								+ mousePos.y;
						if (debugMousePos)
							writeMessage(canvas, message);
					}
					// testImageHover(mousePos);
				})
		.mousedown(function(evt) {
			var mousePos = getMousePos(canvas, evt);
			var nodeId = getImageId(mousePos);
			if (nodeId != -1) {
				hoveredImageId = nodeId;
			}
		})
		.mouseup(
				function(evt) {
					var mousePos = getMousePos(canvas, evt);
					var nodeId = getImageId(mousePos);
					if (popupShown)
						$(".popupImageDetails").remove();
					if ((nodeId != -1)
							&& (hoveredImageId == nodeId)) {
						var img = new Image();
						img.src = '../Server/index.php?controller=image&action=getImg&id='
								+ nodeId + '&t=200';
						jQuery(img)
								.load(
										function() {
											$(this)
													.css(
															'width',
															img.width)
													.css(
															'height',
															img.height)
													.css(
															'margin',
															10);
											$(
													".popupImageDetails")
													.css(
															"width",
															img.width + 20)
													.css(
															'height',
															img.height + 50);
											$("#main")
													.append(
															"<div class='popupImageDetails'><br /><button>Centrer l\'image</button></div>");
											$(
													".popupImageDetails")
													.prepend(
															img);
											$(
													".popupImageDetails > button")
													.bind(
															'click',
															function() {
																saveHisto(nodeId);
																request(
																		nodeId,
																		$(
																				"#nbNeighboursInput")
																				.val());
																$(
																		"#searchInput")
																		.val(
																				nodeId);
																$(
																		".popupImageDetails")
																		.remove();
															})
													.button();
											positionnePopup(
													canvas,
													mousePos,
													nodeId);
										});
					} else
						hoveredImageId = -1;
				});

});

function clearGraph() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = canvas.width;
	for( var i in svgItems ){
		divSVG.remove(svgItems[i]); 
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
		//divSVG.circle(imgX, imgY, 30, 
		//{fill: 'none', stroke: 'red', strokeWidth: 3}); 
		var item = divSVG.image(imgX, imgY, imgWidth, imgHeight, "../Server/index.php?controller=image&action=getImg&id="+node.id+"&t=50");
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
