var min = 3;
var max = 100;
var nbImage = 20;
var nbMaxImage = 1491;
var midValue = Math.round((max-min)/4);
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
var histo = new Array();
var zoomable = true;
var nbLoaded = 0;


$(document).ready(function(){

	if($("#searchInput").val() == "" )$("#searchInput").val(searchInputDefaultText);
	loadHistoFromCookie();
	
	/**
	 * En cas de resized de la fentre on redimensionne la zone 
	 * d'affichage et redessine le graph
	 */
	$(window).resize(function() {
		resized();
		draw();
	});

	remplirSlider();
	
	$("#linkImg1, #linkImg2, #linkImg3, #linkImg4, #linkImg5," +
		" #linkImg6, #linkImg7, #linkImg8, #linkImg9, #linkImg10," +
		" #linkImg11, #linkImg12, #linkImg13, #linkImg14, #linkImg15," +
		" #linkImg16, #linkImg17, #linkImg18, #linkImg19, #linkImg20").click(function(){
		remplirSearch(this);
	});
	$("#choixRendu , #choixData, #choixNiveau").buttonset();
	$("#choixRendu input, #choixData input, #choixNiveau input").change(function(){
		evenement(this);
	});
	
	
	
	/**
	 * Permet de setter un nombre de voisins directement dans la zone de texte
	 */
	$("#nbNeighboursInput").val(midValue).keyup(function(event){
		if(!(this.value.toString().search(/^[0-9]+$/) == 0))
			this.value = this.value.substring(0, this.value.length-1);
		else{
			$("#slider").slider('value', this.value);
			zoomChange($("#slider").slider('value'));
		}
	});
	
	/**
	 * Slider pour selectionner un nombre de voisins
	 */
	
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
	
	/**
	 * Cr�ation du btn ok
	 * association de la fonction ok au click
	 */
	$("#btnOk").button();
	$("#btnOk").click(ok);
	
	/**
	 * Cr�ation du btn webGL
	 * association de la fonction wgl au click
	 */	
	$("#btnWGL").button();
	$("#btnWGL").click(wgl);
	
	$("#centrer").button();
	$("#centrer").click(centrerGraph);

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
	});
	
	/**
	 * Cr�ation des btn de zoom
	 * gestion du zoom au click
	 */
	$("#zoomP").click(function(){
		zoomPlus();
	}).button();
	$("#zoomM").click(function(){
		zoomMoins();
	}).button();
	
	function zoomPlus(){
		if(zoomable){
			var ZoomCoeff = 1;
			if(graph!=null && graph.nodes.length > 40 ) ZoomCoeff = graph.nodes.length/40;
			zoom *= 1.5*ZoomCoeff;
			zoomable = false;
			draw();
		}
	}
	function zoomMoins(){
		if(zoomable){
			if(zoom >= 1){
				var ZoomCoeff = 1;
				if(graph!=null && graph.nodes.length > 40 ) ZoomCoeff = graph.nodes.length/40;
				zoom *= 1/(1.5*ZoomCoeff);
				zoomable = false;
				draw();
			}
		}
	}
	
	/**
	 * Cr�ation des btn historique et filtre
	 * gestion des traitements au click
	 */
	
	$(".menu").button().click(function(){
		$(this).next("ul").toggle();
	});

});



/**
 * Gestion de la touche entr?e pour le champ de recherche et 
 */
function okKeypressedEnter(event){
	if ( event.which == 13 ) { ok(); }
}
function searchKeypressedEnter(event){
	if ( event.which == 13 ) { search(); }
}

/**
 * Declenchement d'une recherche avec le lancement de l'animation en cas de premi?re recherche
 */
function ok(){
	if(isCorrectSearch()){	
		$('.index').animate({
			opacity: 0
		},500, function(){
			$('#header').animate({
				top: '0'
			},500,function() {
	
				$('#main, #nbNeighbours, #zoomSlider').animate({
					opacity : 100
				},5000,function() {});
	
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
			$('#radio, #bloc, #logo, #menu_gauche, #menu_droite, #zoneGraph, .fleche, #zoomDiv').show().animate({
				opacity : 100
			},1000,function() {});
	
			resized();
			search();
	
		});
		$("#btnOk").unbind("click", ok).click(search);
		$("#searchInput").unbind("keypress", okKeypressedEnter).keypress(searchKeypressedEnter);
	}
}

// pour charger directement � partir d'un cookie, pas besoin d'animation !
function okExpress(){
	if(isCorrectSearch()){	
		$('.index').animate({
			opacity: 0
		},1, function(){
			$('#header').animate({
				top: '0'
			},1,function() {
				$('#main, #nbNeighbours, #zoomSlider').animate({
					opacity : 100
				},1,function() {});
	
			});
			$('#chooser').animate({
				opacity : 0
			},1,function() {});
			$('#chooser').animate({
				width : 0
			},1,function() {});
			$('#chooser').animate({
				height : 0
			},1,function() {});
			$('#radio, #bloc, #logo, #menu_gauche, #menu_droite, #zoneGraph, .fleche, #zoomDiv').show().animate({
				opacity : 100
			},1,function() {setArrows();});
			
			resized();
			loadFromCookie();
			searchFromSwitch();
		});
		$("#btnOk").unbind("click", ok).click(search);
		$("#searchInput").unbind("keypress", okKeypressedEnter).keypress(searchKeypressedEnter);
	}
	
}

/**
 * Lancement d'une recherche a partir du contenu de la barre de recherche
 */
function search(){
	if(isCorrectSearch()){
		saveHisto($('#searchInput').val());
		request($('#searchInput').val(), $("#nbNeighboursInput").val());
	}
}

/**
 * Lancement d'une recherche pour réafficher le resultat lors d'un switch entre html5 et SVG
 * On ne sauvegarde pas l'historique dans ce cas la
 */
function searchFromSwitch(){
	if(isCorrectSearch()){
		request($('#searchInput').val(), $("#nbNeighboursInput").val());
	}
}

/**
 * Methode qui recharge le graphe quand on change la valeur de zoom
 * @param value
 */
function zoomChange(value){
	request($('#searchInput').val(),value);
}

/**
 * Gestion de changement de valeur des boutons radio
 * @param object
 */
function evenement(object){
	if (object.id == 'htm'){
		if(HTML != true){
			var nodeId = getHistoCookie().split("|")[getHistoCookie().split("|").length-1];
			setTransferData($("#nbNeighboursInput").val(), zoom, translateX , translateY, nodeId, algoNPlusUn);
			HTML = true;
			window.open("./index.html","_self");
		}
	}
	if (object.id == 'svg'){
		if(HTML == true){
			var nodeId = getHistoCookie().split("|")[getHistoCookie().split("|").length-1];
			setTransferData($("#nbNeighboursInput").val(), zoom, graphCenter.x , graphCenter.y, nodeId, algoNPlusUn);
			HTML = false;
			window.open("./indexSVG.html","_self");
		}
	}
	if (object.id == 'niv1'){
		algoNPlusUn = false;
		var maxImg = max;
		$("#topLabelSlider").html(maxImg);
		$( "#slider" ).slider( "option", "max", maxImg );
		if (($( "#slider" ).slider( "option", "value"))> maxImg){
			$( "#slider" ).slider( "option", "value", maxImg );
			$("#nbNeighboursInput").val(maxImg);
		}
		search();
			
	}
	if (object.id == 'niv2'){
		algoNPlusUn = true;
		var maxImg = nbImage;
		$("#topLabelSlider").html(maxImg);
		$( "#slider" ).slider( "option", "max", maxImg );
		if (($( "#slider" ).slider( "option", "value"))> maxImg){
			$( "#slider" ).slider( "option", "value", maxImg );
			$("#nbNeighboursInput").val(maxImg);
		}
		//$("#topLabelSlider").html(max);
		//$( "#slider" ).slider( "option", "max", max );
		search();
	}
}

/**
 * Remplissage du carroussel de la page d'accueil avec des images al?atoires
 */
function remplirSlider(){
	//on parcour le slider
	for (var i = 1;i <= 20 ;i++) {
		//on genere un entier al�atoire en 1 et 1491
		var numRand = Math.floor(Math.random()*nbMaxImage);
		//on recupere la case du slider
		var img = document.getElementById("img"+i);
		//on remplace l'image de cette case par celle dont
		//l'ID sur le serveur coorespond au nombre al�atoire
		img.src="../Server/index.php?controller=image&action=getImg&id="+numRand+"&w=100&l=100";
		//on remplace aussi l'attribut alt de l'image par son id
		img.alt=numRand;
	}
}

/**
 * M?thode de remplissage de la barre de recherche quand on clique sur une miniature du carroussel
 * @param object
 */
function remplirSearch(object){
	//on recupere le fils du lien (notre image)
	var enfant = object.childNodes;
	//on recupere son attribut alt (son ID)
	var idImg = enfant[0].alt;
	$("#searchInput").css('color', '#000000').css('font-style', 'normal');
	$("#searchInput").val(idImg);
	$("#searchInput").effect("highlight", {'color' : 'red'}, 1000);

}

/**
 * Méthode permettant de sauver un id pour l'histo + ferme la fenetre d'histo.
 */
function saveHisto(id){
	if(addHistoCookie(id)){
		var img="../Server/index.php?controller=image&action=getImg&id="+id+"&t=50";
		$('#smenu1').prepend("<li><a href='#' onclick='changeImg("+id+");'><img src="+img+"><span class='marge'>"+id+"</span></a></li>");
	}
}

/**
*	M�thode permettant de charger l'historique � partir d'un cookie
**/
function loadHistoFromCookie(){
	var histoFromCookie = getHistoCookie();
	
	for(var i in histoFromCookie.split("|")){
		if(histoFromCookie.split("|")[i] != ""){
			var img="../Server/index.php?controller=image&action=getImg&id="+histoFromCookie.split("|")[i]+"&t=50";
			$('#smenu1').prepend("<li><a href='#' onclick='changeImg("+histoFromCookie.split("|")[i]+");'><img src="+img+"><span class='marge'>"+histoFromCookie.split("|")[i]+"</span></a></li>");
		}
	}	
}

/**
 * Chargement de l'image id par l'historique en refermant ce dernier + les filtres
 * @param id
 */
function changeImg(id){
	request(id, midValue);
	$("#b1").next("ul").toggle();
}

/**
 * Envoi de la requete pour le WebGL
 */
function wgl(){
	var idWebGL=$("#searchInput").val();
	var urlWGL="../Client2/indexWebGL.html?id="+idWebGL+"&controller="+ (algoNPlusUn? "distance" : "score")+"&n="+$("#nbNeighboursInput").val() ;
	window.open(urlWGL);
}

/**
 * V?rifie que le contenu de la barre de recherche est au format valide
 * @returns {Boolean}
 */
function isCorrectSearch(){
	var searchVal = $('#searchInput').val();
	return (searchVal.toString().search(/^[0-9]+$/) == 0)
		&& searchVal != ""
		&& searchVal != searchInputDefaultText
		&& searchVal >= 1
		&& searchVal <= nbMaxImage;
}

// pour savoir si toute les images d'une recherche ont �t� charg�es ou pas.
function checkLoading(){
	nbLoaded++;
	var valMax = parseInt($( "#slider" ).slider( "option", "value"))+1;
	if(nbLoaded >= valMax ){
		zoomable = true;
		nbLoaded = 0;
	}
}
