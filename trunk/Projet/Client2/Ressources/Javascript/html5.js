var canvas;
var ctx;

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

					$("#graphSaver").click(function() { 
						// save canvas image as data url (png format by default)
						$("#graphSaver").attr("href", canvas.toDataURL());
					});
					
				});


function clearGraph() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = canvas.width;
}

function drawNode(node) {

	if (canvas.getContext) {

		var img = new Image();
		img.src = "../Server/index.php?controller=image&action=getImg&id="
				+ node.id + "&t=" + (mignatureSize * zoom);
		// on attend le chargement complet de l'image pour l'insérer dans le
		// canvas
		jQuery(img).load(
				function() {
					node.width = img.width;
					node.height = img.height;

					node.position = {
						"x" : (node.center.x * zoom) - (node.width / 2)
								+ graphCenter.x,
						"y" : (node.center.y * zoom) - (node.height / 2)
								+ graphCenter.y
					};
					node.position2 = {
						"x" : (node.center.x * zoom) + (node.width / 2)
								+ graphCenter.x,
						"y" : (node.center.y * zoom) + (node.height / 2)
								+ graphCenter.y
					};
					ctx.fillRect(node.position.x, node.position.y, img.width,
							img.height); // afficher un rectangle plein
					ctx.drawImage(img, node.position.x, node.position.y,
							img.width, img.height);
				});

	}

}

function drawEdge(edge) {

	if (canvas.getContext) {
		ctx.beginPath();
		ctx.moveTo(edge.source.center.x * zoom + graphCenter.x,
				edge.source.center.y * zoom + graphCenter.y);
		ctx.lineTo(edge.target.center.x * zoom + graphCenter.x,
				edge.target.center.y * zoom + graphCenter.y);
		ctx.lineWidth = 0.5;
		// choix de la couleur en fonction du pas
		if (edge.score <= pas) {
			ctx.strokeStyle = rouge;
		} else if ((edge.score > 2 * pas) && (edge.score <= pas * 3)) {
			ctx.strokeStyle = jaune;
		} else if ((edge.score > pas) && (edge.score <= pas * 2)) {
			ctx.strokeStyle = orange;
		} else {
			ctx.strokeStyle = vert;
		}
		ctx.stroke();
	}
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

function positionnePopup(canvas, mousePos, nodeId)
{
	$(".popupImageDetails").css('top', mousePos.y + 20).css("left", mousePos.x + 20);
	popupShown = true;
}


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