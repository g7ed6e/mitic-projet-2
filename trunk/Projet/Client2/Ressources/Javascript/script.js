var min = 2;
var max = 40;
var nbImage = 1490;
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
var histo = new Array();


$(document).ready(function(){
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
	 * Création du btn ok
	 * association de la fonction ok au click
	 */
	$("#btnOk").button();
	$("#btnOk").click(ok);
	
	/**
	 * Création du btn webGL
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
	}).attr('value', searchInputDefaultText);
	
	/**
	 * Création des btn de zoom
	 * gestion du zoom au click
	 */
	$("#zoomP").click(function(){		
		zoom *= 2;
		draw();
	}).button();
	$("#zoomM").click(function(){
		if(zoom != 1){
			zoom *= 0.5;
			draw();
		}
	}).button();
	
	/**
	 * Création des btn historique et filtre
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
	
			search();
			resized();
	
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
		HTML = true;
	}
	if (object.id == 'svg'){
		HTML = false;
	}
	if (object.id == 'niv1'){
		algoNPlusUn = false;
		max = 40;
		$("#topLabelSlider").html(max);
		$( "#slider" ).slider( "option", "max", max );
		if (($( "#slider" ).slider( "option", "value"))> max){
			$( "#slider" ).slider( "option", "value", max );
			$("#nbNeighboursInput").val(max);
		}
			
	}
	if (object.id == 'niv2'){
		algoNPlusUn = true;
		max = nbImage;
		$("#topLabelSlider").html(max);
		$( "#slider" ).slider( "option", "max", max );
	}
}

/**
 * Remplissage du carroussel de la page d'accueil avec des images al?atoires
 */
function remplirSlider(){
	//on parcour le slider
	for (var i = 1;i <= 20 ;i++) {
		//on genere un entier aléatoire en 1 et 1491
		var numRand = Math.floor(Math.random()*nbImage) + 1;
		//on recupere la case du slider
		var img = document.getElementById("img"+i);
		//on remplace l'image de cette case par celle dont
		//l'ID sur le serveur coorespond au nombre aléatoire
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
 * M?thode permettant de sauver un id pour l'histo + ferme la fenetre d'histo.
 */
function saveHisto(id){
	var img="../Server/index.php?controller=image&action=getImg&id="+id+"&t=50";
	$('#smenu1').append("<li><a href='#' onclick='changeImg("+id+");'><img src="+img+"><span class='marge'>"+id+"</span></a></li>");
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
	var urlWGL="../Client2/indexWebGL.html?id="+idWebGL;
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
		&& searchVal <= nbImage+1;;
}
