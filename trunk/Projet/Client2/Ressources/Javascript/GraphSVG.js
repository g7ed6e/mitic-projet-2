var divSVG;			// objet créé à partir de jquery SVG pour créer les lignes et images.
var svgItems = [];	// liste des objets SVG dans la div
var translateX = 0;	// valeur du x de la translation de "l'objet global SVG"
var translateY = 0;	// valeur du x de la translation de "l'objet global SVG"
var mousePos;		// valeurs pour la position de la souris
var popupShown = false;	// boolean pour savoir si la popup est présente ou pas.

$(document).ready(	// Execution au chargement du document
function() {
	HTML = false;
	
	$("#fg").click(function() {	// ajout de l'évènement au clique de la flèche gauche
		translateGraph(-75,0);
	});
	$("#fd").click(function() {	// ajout de l'évènement au clique de la flèche droite
		translateGraph(75,0);
	});
	$("#fh").click(function() {	// ajout de l'évènement au clique de la flèche haut
		translateGraph(0,-75);
	});
	$("#fb").click(function() {	// ajout de l'évènement au clique de la flèche bas
		translateGraph(0,75);
	});
	
	/**
	 * Permet de détectecter un drag dans la zone de dessin et 
	 * envoi un evt de type dragGraph
	 */
	$("#zoneGraph").mousedown(function(evt){
		clicked = true;
		debut = {"x" : evt.clientX, "y" : evt.clientY};		// valeur d'origine pour la translation
		if (popupShown) $(".popupImageDetails").remove();	// enlever la popup lors d'un click dans le vide
		return false;	// permet de ne pas parasiter avec le drag => la translation.
	}).mouseup(function(){
		clicked = false;
	}).mousemove(function(evt){	// enregistrer la position de la souris
		mousePos = getMousePos($("#zoneGraph"), evt);
		if(clicked) $("#zoneGraph").trigger('dragGraph', [{"x" : evt.clientX, "y" : evt.clientY}]);
	});

	/**
	 * Listener sur l'evt de type dragGraph
	 * permet de déplacer le graph en fonction de la souris via une translation du SVG
	 */
	$("#zoneGraph").bind('dragGraph', function(evt, param){
		translateGraph( (param.x - debut.x) , (param.y -debut.y) );
		debut = param;
	});
	
	resized();	// dimensionner la div contenant le graph.

	$('#zoneGraph').svg({onLoad:function(svg) { // initialiser la zone de dessin SVG à partir de la div zoneGraph
			divSVG = svg; 
			var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
		} 
	});
	
	if(getTransferData() != ""){
		$('#searchInput').val(getTransferData().split("|")[4]);
		okExpress();
	}
});

// Fonction pour effectuer une translation de tous les objets SVG créés
function translateGraph(deltaX, deltaY){
	translateX+= deltaX;
	translateY+= deltaY;
	for( var i in svgItems ){
		$(svgItems[i]).attr("transform", "translate("+translateX+","+translateY+")");
	}
}
/*
// fonction pour déplacer avec une animation tous les objets SVG créés = ne fonctionne pas
function translateGraphAnimated(deltaX, deltaY){
	translateX+= deltaX;
	translateY+= deltaY;
	for( var i in svgItems ){
		$(svgItems[i]).animate(
			{svgTransform: "translate("+translateX+" "+translateY+")"},
			500);
	}
}*/
	
// Nettoyer le graph pour pouvoir en réafficher un autre
function clearGraph() {
	$('#zoneGraph').svg('destroy');
	$('#zoneGraph').svg({onLoad:
		function(svg) { 
			divSVG = svg; 
			var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
		} 
	});
	for( var i in svgItems ){
		//divSVG.remove(svgItems[i]); 
		svgItems.splice(i, 1); 
	}
}

// dessiner une image SVG
function drawNode(node){
	
	var img=new Image(); 
	img.src = "../Server/index.php?controller=image&action=getImg&id="
				+ node.id + "&t=" + (mignatureSize * zoom);
	jQuery(img).load(function() { //récupération de l'image et donc de ses données corrolaires.
	
		node.width = img.width;
		node.height = img.height;
			
		var imgX = Math.round( (node.center.x * zoom) - (node.width/2) + graphCenter.x );
		var imgY = Math.round( (node.center.y * zoom) - (node.height/2) + graphCenter.y );
		var imgWidth = Math.round(img.width);
		var imgHeight = Math.round(img.height);
		var item = divSVG.image(imgX, imgY, imgWidth, imgHeight,img.src); // création de l'objet SVG image
		svgItems[svgItems.length] = item;	// ajout de l'objet fraichement créé dans le tableau
		$(item).click(function() {
			onClickImage(node.id, img);	// ajout de l'évènement sur l'image pour l'apparition de la popup
		});
		$(item).attr("transform", "translate("+translateX+","+translateY+")"); // translater l'élément si translation il y a
		checkLoading();
	});
}	

// dessiner une arrête ( = ligne ) en svg
function drawEdge(edge){
	
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	var x1 = Math.round(edge.source.center.x * zoom + graphCenter.x);
	var y1 = Math.round(edge.source.center.y * zoom + graphCenter.y);
	var x2 = Math.round(edge.target.center.x * zoom + graphCenter.x);
	var y2 = Math.round(edge.target.center.y * zoom + graphCenter.y);
	
	//appel de choixCouleur(edge.score) pour avoir une couleur en fonction du score
	var g = divSVG.group({stroke: choixCouleur(edge.score), strokeWidth: 1}); 
	var item = divSVG.line(g, x1, y1, x2, y2); 	// création de lélément ligne SVG
	svgItems[svgItems.length] = item;			// ajout de l'élément dans le tableau
	$(item).attr("transform", "translate("+translateX+","+translateY+")"); // translater l'élément si translation il y a
}

// fonction pour (re)dimensionner la div contenant le graph
function resized(){
	$("#zoneGraph").css('width', $("#main").innerWidth() - $("#zoomDiv").innerWidth()+"px");
	$("#zoneGraph").css('height', $("#main").innerHeight()-$("#zoneGraph").get(0).offsetTop-$("#footer").innerHeight()-10+"px");
	graphDimension = {"width":$("#zoneGraph").width(), "height": $("#zoneGraph").height()};
	graphCenter = {"x":$("#zoneGraph").width() / 2, "y": $("#zoneGraph").height() / 2};
	$("#loading").css("left", graphCenter.x-50+"px").css("top", graphCenter.y-11+$("#zoneGraph").get(0).offsetTop+"px");
	setArrows();
}


// créer une popup de l'image cliquée et l'afficher à côté de la souris
function onClickImage(nodeId){
	var img = new Image();
	img.src = '../Server/index.php?controller=image&action=getImg&id='+ nodeId + '&t=200';
	jQuery(img).load(function() { //chargement de l'image et de ses données corrolaires
		$(".popupImageDetails")
				.css("width",img.width + 20)
				.css('height',img.height + 50);
		$("#main").append("<div class='popupImageDetails'><br /><button>Centrer l\'image</button></div>");
		$(".popupImageDetails").prepend(img);
		$(".popupImageDetails > button").bind('click', function() { // évènement au click sur le bouton "Centrer l'image"
							saveHisto(nodeId);	// ajout de l'élement dans l'historique
							centrerGraph();
							request(nodeId,$("#nbNeighboursInput").val());	// nouvelle requête
							$("#searchInput").val(nodeId);					// rajout de l'id dans la barre de recherche
							$(".popupImageDetails").remove();				// suppression de la popup
						})
				.button();
		positionnePopup();	// positionnement de la popup lorsqu'elle apparaît
	});
	popupShown = true;
}

// fonction pour positionner la popup en fonction de la position de la souris
function positionnePopup(){
	var posX = mousePos.x + 20;
	var posY = mousePos.y + 20;
	var tmp = $(window).width();
	if($(".popupImageDetails").width() + posX > $(window).width() ) 
		posX = $(window).width() - $(".popupImageDetails").width() - 20;
	if($(".popupImageDetails").height() + posY > $(window).height() ) 
		posY = $(window).height() - $(".popupImageDetails").height() - 20;
		
	$(".popupImageDetails").css('top', posY).css("left", posX);
	popupShown = true;
}

// fonction pour récupérer la position de la souris relative à la fenêtre
function getMousePos(div, evt){
	var obj = div;
	var top = $(div).offset().top;
	var left = $(div).offset().left;

	// return relative mouse position
	var mouseX = evt.clientX - left + window.pageXOffset;
	var mouseY = evt.clientY - top + window.pageYOffset;
	return {
		x: mouseX,
		y: mouseY
	};
}

function centrerGraph(){
	zoom =1;			// réinitialisation du zoom
	translateX = 0;		// réinitialisation du x de la translation
	translateY = 0;		// réinitialisation du x de la translation
	draw();
}

function loadFromCookie(){
	var transferData = getTransferData();
	if(transferData != ""){
		resized();
		$( "#slider" ).slider( "option", "value", transferData.split("|")[0] );
		$("#nbNeighboursInput").val(transferData.split("|")[0]);
		zoom = transferData.split("|")[1];
		translateX = parseInt(transferData.split("|")[2]) - graphCenter.x;
		translateY = parseInt(transferData.split("|")[3]) - graphCenter.y;
		
		resetTransferData();
		$('#searchInput').val(transferData.split("|")[4]);
		var algoTmp = transferData.split("|")[5];
		if (algoTmp == "true"){algoNPlusUn = true;}
		else {algoNPlusUn = false;}
	}
}