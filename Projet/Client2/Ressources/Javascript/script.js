var min = 0;
var max = 19;
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
var nbhist = 0;
var close = true;
var close2 = true;

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
	 * Permet de détectecter un drag dans la zone de dessin et 
	 * envoi un evt de type dragGraph
	 */
	
	$("#zoneGraph").mousedown(function(evt){
		clicked = true;
		debut = {"x" : evt.clientX, "y" : evt.clientY};
	}).mouseup(function(){
		draw();
		clicked = false;
	}).mousemove(function(evt){
		if(clicked) $("#zoneGraph").trigger('dragGraph', [{"x" : evt.clientX, "y" : evt.clientY}]);
	});

	/**
	 * Listener sur l'evt de type dragGraph
	 * permet de déplacer le graph en fonction de la souris
	 */
	$("#zoneGraph").bind('dragGraph', function(evt, param){
		compteur++;
		dragDeplacementDelta = {"x" : debut.x - param.x, "y" : debut.y - param.y};
		graphCenter.x -= dragDeplacementDelta.x;
		graphCenter.y -= dragDeplacementDelta.y;
		if(compteur  %6 == 0 )draw();
		debut = param;
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
	 */
	$("#btnOk").button();
	$("#btnOk").click(ok);
	
	$("#btnWGL").button();
	$("#btnWGL").click(wgl);

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
	$("#b1").button().click(function(){
		if(close){
			showHisto();
			close = false;
		}else{
			close = true;	
		}
		$(this).next("ul").toggle();

	});
	$("#b2").button().click(function(){
		if(close2){
			close2 = false;
		}else{
			close2 = true;	
		}
		$(this).next("ul").toggle();
	});
});


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

function search(){
	saveHisto($('#searchInput').val());
	request($('#searchInput').val(), $("#nbNeighboursInput").val());
}

function zoomChange(value){
	request($('#searchInput').val(),value);
}

function evenement(object){
	if (object.id == 'htm'){
		HTML = true;
	}
	if (object.id == 'svg'){
		HTML = false;
	}
	if (object.id == 'niv1'){
		algoNPlusUn = false;
	}
	if (object.id == 'niv2'){
		algoNPlusUn = true;
	}
}

function remplirSlider(){
	//on parcour le slider
	for (var i = 1;i <= 20 ;i++) {
		//on genere un entier aléatoire en 1 et 1491
		var numRand = Math.floor(Math.random()*1490) + 1;
		//on recupere la case du slider
		var img = document.getElementById("img"+i);
		//on remplace l'image de cette case par celle dont
		//l'ID sur le serveur coorespond au nombre aléatoire
		img.src="../Server/index.php?controller=image&action=getImg&id="+numRand+"&w=100&l=100";
		//on remplace aussi l'attribut alt de l'image par son id
		img.alt=numRand;
	}
}

function remplirSearch(object){
	//on recupere le fils du lien (notre image)
	var enfant = object.childNodes;
	//on recupere son attribut alt (son ID)
	var idImg = enfant[0].alt;
	$("#searchInput").css('color', '#000000').css('font-style', 'normal');
	$("#searchInput").val(idImg);
	$("#searchInput").effect("highlight", {'color' : 'red'}, 1000);

}


function saveHisto(id){
	histo[nbhist]=id;
	nbhist++;
	if(!close){
		$("#b1").next("ul").toggle();
		close = true;
	}
	if(!close2){
		$("#b2").next("ul").toggle();
		close2 = true;
	}
}

function showHisto(){

	$('#smenu1').empty();
	for(var i = 0; i < nbhist ; i++){
		var img="../Server/index.php?controller=image&action=getImg&id="+histo[i]+"&t=50";
		var chisto ="<li><a href='#' onclick='changeImg("+histo[i]+");'><img src="+img+"><span class='marge'>"+histo[i]+"</span></a></li>";
		$(chisto).appendTo('#smenu1');

	}
}

function changeImg(id){
	request(id, midValue);
	$("#b1").next("ul").toggle();
	close=true;
	if(!close2){
		$("#b2").next("ul").toggle();
		close2 = true;
	}
}

function wgl(){
	var idWebGL=$("#searchInput").val();
	var urlWGL="../Client2/indexWebGL.html?id="+idWebGL;
	window.open(urlWGL);
}
